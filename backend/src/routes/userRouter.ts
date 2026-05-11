import { getServices } from '@src/services/Services'
import { Req, Res } from './common/express-types'

import { Router } from 'express'
import { RouteError } from '@src/common/utils/route-errors'
import UserServiceError from '@src/common/types/UserServiceError'
import Paths from '@src/common/constants/Paths'
import jwt from 'jsonwebtoken'
import EnvVars from '@src/common/constants/env'

const userRouter = Router()

userRouter.post('/', async function(req: Req, res: Res) {
    const services = getServices()

    if (req.headers['content-type'] !== 'application/json') {
        throw new RouteError(400, 'Invalid content-type')
    }

    if (!req.body['email'] || !req.body['password'] || !req.body['name']) {
        throw new RouteError(400, 'Missing parameters')
    }

    try {
        const user = await services.UserService.create(
            req.body.email,
            req.body.password,
            req.body.name
        )

        res.json(user)
    } catch (error) {
        if (error instanceof UserServiceError) {
            res.json({ error: 'User already exists.' })
            return
        } else {
            throw error
        }
    }
})

userRouter.post(Paths.User.Login, async function(req: Req, res: Res) {
    const services = getServices()

    if (req.headers['content-type'] !== 'application/json') {
        throw new RouteError(400, 'Invalid content-type')
    }

    if (!req.body['email'] || !req.body['password']) {
        throw new RouteError(400, 'Missing parameters')
    }

    const user = await services.UserService.authenticateAndRetrieve(req.body['email'], req.body['password'])
    if (!user) {
        throw new RouteError(400, 'Wrong email or password')
    }

    const token = jwt.sign({ id: user.id }, EnvVars.JwtSecret)
    res.json({ token: token })
})

export default userRouter
