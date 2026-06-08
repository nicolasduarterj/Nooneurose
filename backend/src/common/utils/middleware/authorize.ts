import { Req, Res } from "@src/routes/common/express-types"
import { getServices } from "@src/services/Services"
import { NextFunction } from "express"
import { RouteError } from "../route-errors"
import jwt from 'jsonwebtoken'
import EnvVars from "@src/common/constants/env"

interface Payload { id: number }

export default async function authorize(req: Req, res: Res, next: NextFunction) {
    const tokenRaw = req.headers['authorization']
    if (!tokenRaw || !tokenRaw.startsWith('Bearer'))
        throw new RouteError(401, 'missing auth token')
    const jwtoken = tokenRaw.replace('Bearer ', '')
    const services = getServices()
    try {
        const payload = jwt.verify(jwtoken, EnvVars.JwtSecret) as Payload
        const user = await services.UserService.getById(payload.id)
        if (!user) {
            throw new RouteError(401, 'user does not exist')
        }
        req.user = user
        next()
    } catch (_error) {
        throw new RouteError(401, 'login failed')
    }
}
