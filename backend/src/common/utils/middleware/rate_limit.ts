import { NextFunction } from "express";
import { Req, Res } from "@src/routes/common/express-types";
import { RouteError } from "../route-errors";

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const attempts = new Map<string, RateLimitEntry>();

/**
 * Middleware que limita tentativas de login por IP.
 * 10 tentativas a cada 15 minutos.
 */
export default function loginRateLimit(req: Req, _res: Res, next: NextFunction) {
    const windowMs = 15 * 60 * 1000; // 15 minutos
    const maxAttempts = 10;

    const key = req.ip ?? req.headers['x-forwarded-for']?.toString() ?? 'unknown';
    const now = Date.now();
    const current = attempts.get(key);

    if (!current || current.resetAt <= now) {
        attempts.set(key, { count: 1, resetAt: now + windowMs });
        next();
        return;
    }

    if (current.count >= maxAttempts) {
        throw new RouteError(429, 'Too many login attempts. Try again later.');
    }

    current.count += 1;
    attempts.set(key, current);
    next();
}