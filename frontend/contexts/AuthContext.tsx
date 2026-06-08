'use client';

import { DoLoginRequest, LoggedUser, LoginResponse } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE, APP_AUTH_COOKIE, COOKIE_MAX_AGE, authHeaders } from "@/lib/api";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { decodeJwt } from "@/lib/jwt";

interface AuthContextType {
    user: LoggedUser | null;
    isAuthenticated: boolean;
    login: (credentials: DoLoginRequest, onLoginSuccess?: () => void) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userUpdate: Partial<LoggedUser>) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: async () => {},
    logout: async () => {},
    updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const cleanSession = () => {
        destroyCookie(null, APP_AUTH_COOKIE, { path: "/" });
        setLoggedUser(null);
        setIsAuthenticated(false);
    }

    useEffect(() => {
        const loadStoredAuth = async () => {
            const cookies = parseCookies();
            const token = cookies[APP_AUTH_COOKIE];

            if (!token) {
                cleanSession();
                return;
            }

            const payload = decodeJwt(token) as { id?: number; email?: string };
            if (!payload?.id) {
                cleanSession();
                return;
            }

            setIsAuthenticated(true);
            setLoggedUser({ id: payload.id, name: "" });

            try {
                const res = await fetch(`${API_BASE}/api/user/byId/${payload.id}`, {
                    headers: authHeaders(),
                });

                if (res.ok) {
                    const data = await res.json();
                    setLoggedUser({ id: payload.id, name: data.name });
                }
            } catch (error) {
                console.error("Falha ao carregar usuário autenticado", error);
            }
        }

        loadStoredAuth();
	}, []);

    const login = async ({ email, password }: DoLoginRequest, onLoginSuccess?: () => void) => {
        const res = await fetch(`${API_BASE}/api/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            throw new Error('Email ou senha incorretos.');
        }

        const data: LoginResponse = await res.json();

        setCookie(null, APP_AUTH_COOKIE, data.token, {
			maxAge: COOKIE_MAX_AGE,
			path: "/",
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
		});

        const tokenPayload = decodeJwt(data.token);

        const authenticatedUser: LoggedUser = {
            id: tokenPayload?.id || 0,
            name: data.name,
        };

        setLoggedUser(authenticatedUser);
        setIsAuthenticated(true);

        onLoginSuccess?.();
    };

    const updateUser = (userUpdate: Partial<LoggedUser>) => {
        setLoggedUser((prev) => (prev ? { ...prev, ...userUpdate } : prev));
    };

    const logout = async () => {
       cleanSession();
    }

    return (
        <AuthContext.Provider value={{ user: loggedUser, isAuthenticated, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
