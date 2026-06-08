import { NextFunction } from "express";
import { Req, Res } from "@src/routes/common/express-types";
import { RouteError } from "../route-errors";
import logger from 'jet-logger'

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

    const key = req.ip ?? req.headers['x-forwarded-for']?.toString() ?? 'unknown'; // válido por causa do 'trust proxy'
    logger.info(`registering login attempt for ${key}.`)

    if (key === 'unknown') {
        throw new RouteError(500, 'Error missing IP.')
    }

    const now = Date.now();
    const current = attempts.get(key)

    if (!current) {
        attempts.set(key, { count: 1, resetAt: now + windowMs })
        next()
        return
    }

    if (current.resetAt <= now) {
        attempts.set(key, { count: 1, resetAt: now + windowMs });
        next();
        return;
    }

    current.count += 1
    if (current.count > maxAttempts) {
        throw new RouteError(429, 'Too many login attempts. Try again later.');
    }

    attempts.set(key, current);
    next();
}
