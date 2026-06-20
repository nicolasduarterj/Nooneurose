'use client';

import { DoLoginRequest, LoggedUser, LoginResponse } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE, APP_AUTH_COOKIE, COOKIE_MAX_AGE, authHeaders } from "@/lib/api";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { decodeJwt } from "@/lib/jwt";

interface AuthContextType {
    user: LoggedUser | null;
    isAuthenticated: boolean;
    login: (
        credentials: DoLoginRequest,
        onLoginSuccess?: (user: LoggedUser) => void
    ) => Promise<void>;
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
    };

    useEffect(() => {
        const loadStoredAuth = async () => {
            const cookies = parseCookies();
            const token = cookies[APP_AUTH_COOKIE];

            if (!token) {
                cleanSession();
                return;
            }

            const payload = decodeJwt(token) as { id?: number };

            if (!payload?.id) {
                cleanSession();
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/api/user/byId/${payload.id}`, {
                    headers: authHeaders(),
                });

                if (!res.ok) {
                    cleanSession();
                    return;
                }

                const data = await res.json();

                setLoggedUser({
                    id: payload.id,
                    name: data.name,
                    isAdmin: data.isAdmin,
                });

                setIsAuthenticated(true);

            } catch (error) {
                console.error("Falha ao carregar usuário autenticado", error);
                cleanSession();
            }
        };

        loadStoredAuth();
    }, []);

    const login = async (
        { email, password }: DoLoginRequest,
        onLoginSuccess?: (user: LoggedUser) => void
    ) => {
        const res = await fetch(`${API_BASE}/api/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (!res.ok) {
            const errorResponse = await res.json().catch(() => null);
            const errorMessage =
                errorResponse?.error ?? "Email ou senha incorretos.";

            throw new Error(errorMessage);
        }

        const data: LoginResponse = await res.json();
        console.log(data);

        setCookie(null, APP_AUTH_COOKIE, data.token, {
            maxAge: COOKIE_MAX_AGE,
            path: "/",
            sameSite: "lax",
            secure: false,
        });

        const tokenPayload = decodeJwt(data.token) as { id?: number } | null;

        if (!tokenPayload?.id) {
            throw new Error("Token inválido.");
        }

        const userRes = await fetch(
            `${API_BASE}/api/user/byId/${tokenPayload.id}`,
            {
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            }
        );

        if (!userRes.ok) {
            throw new Error("Erro ao carregar dados do usuário.");
        }

        const userData = await userRes.json();

        const authenticatedUser: LoggedUser = {
            id: userData.id,
            name: userData.name,
            isAdmin: userData.isAdmin,
        };

        setLoggedUser(authenticatedUser);
        setIsAuthenticated(true);

        onLoginSuccess?.(authenticatedUser);
    };

    const updateUser = (userUpdate: Partial<LoggedUser>) => {
        setLoggedUser((prev) =>
            prev ? { ...prev, ...userUpdate } : prev
        );
    };

    const logout = async () => {
        cleanSession();
    };

    return (
        <AuthContext.Provider
            value={{
                user: loggedUser,
                isAuthenticated,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);