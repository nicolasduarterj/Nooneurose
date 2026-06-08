import { getServices } from '@src/services/Services'
import { Req, Res } from './common/express-types'

import { Router } from 'express'
import { RouteError } from '@src/common/utils/route-errors'
import UserServiceError from '@src/common/types/UserServiceError'
import { APIPaths } from '@src/common/constants/Paths'
import jwt from 'jsonwebtoken'
import EnvVars from '@src/common/constants/env'
import authorize from '@src/common/utils/middleware/authorize'
import { UpdateUserData } from '@src/services/UserService/UserService'
import User from '@src/models/common/User'
import loginRateLimit from '@src/common/utils/middleware/rate_limit'
import { isValidEmail } from '@src/common/utils/validators'

const userRouter = Router()

userRouter.post(APIPaths.User._(), async function(req: Req, res: Res) {
    const services = getServices()

    if (req.headers['content-type'] !== 'application/json') {
        throw new RouteError(400, 'Invalid content-type')
    }

    if (!req.body['email'] || !req.body['password'] || !req.body['name']) {
        throw new RouteError(400, 'Missing parameters')
    }

    //senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um número / senha forte
    const password: string = req.body['password']
    if (password.length < 8) {
      throw new RouteError(400, 'Password must be at least 8 characters')
    }
    if (!/[A-Z]/.test(password)) {
      throw new RouteError(400, 'Password must contain at least one uppercase letter')
    }
    if (!/[0-9]/.test(password)) {
      throw new RouteError(400, 'Password must contain at least one number')
    }
    if (!isValidEmail(req.body.email)) {
        throw new RouteError(400, 'Invalid email format')
    }

    try {
        const user = await services.UserService.create(
            req.body.email,
            req.body.password,
            req.body.name
        )

        res.json(sanitizeUser(user))
    } catch (error) {
        if (error instanceof UserServiceError) {
            throw new RouteError(400, 'user already exists')
        } else {
            throw error
        }
    }
})

userRouter.post(APIPaths.User.Login(), loginRateLimit, async function(req: Req, res: Res) {
    const services = getServices()

    if (req.headers['content-type'] !== 'application/json') {
        throw new RouteError(400, 'Invalid content-type')
    }

    if (!req.body['email'] || !req.body['password']) {
        throw new RouteError(400, 'Missing parameters')
    }

    const email: string = req.body['email']
    if (!isValidEmail(email)) {
        throw new RouteError(400, 'Invalid email format')
    }

    const user = await services.UserService.authenticateAndRetrieve(req.body['email'], req.body['password'])
    if (!user) {
        throw new RouteError(400, 'Wrong email or password')
    }

    const token = jwt.sign({ id: user.id }, EnvVars.JwtSecret, { expiresIn: '2h' })
    res.json({ token: token })
})

userRouter.get(APIPaths.User.byId(), async function(req: Req, res: Res) {
    const id = parseInt(req.params.id)
    if (Number.isNaN(id))
        throw new RouteError(400, 'Invalid id')

    const token = req.headers['authorization']?.replace('Bearer ', '')
    if (!token) throw new RouteError(401, 'missing auth token')

    const payload = jwt.verify(token, EnvVars.JwtSecret) as { id: number }

    if (id !== payload.id)
        throw new RouteError(403, 'you can only access your own user')

    const services = getServices()
    const user = await services.UserService.getById(id)

    if (!user)
        throw new RouteError(404, 'User not found')

    res.json(sanitizeUser(user))
})

userRouter.get(APIPaths.User.Characters(), authorize, async function(req: Req, res: Res) {
    const services = getServices()

    if (!req.user)
        throw new RouteError(500, 'error missing user')

    const characters = await services.CharacterService.getByUser(req.user)
    res.json(characters)
})

userRouter.patch(APIPaths.User._(), authorize, async function(req: Req, res: Res) {
    const services = getServices()

    if (!req.user)
        throw new RouteError(500, 'error missing user')

    const newPass = req.body.password
    const newName = req.body.name

    if (!newPass && !newName)
        throw new RouteError(400, 'nothing to update')

    const change: UpdateUserData = {
        name: newName ? newName : undefined,
        password: newPass ? newPass : undefined
    }

    const updatedUser = await services.UserService.update(req.user, change)
    res.json({ ...updatedUser, password: undefined })
})

userRouter.get(APIPaths.User.search(), async function(req: Req, res: Res) {
    const services = getServices()

    const candidates = await services.UserService.search(req.params.query)
    res.json(candidates.map(candidate => ({ ...candidate, password: undefined })))
})

export function sanitizeUser(user: User) {
    return {
        id: user.id,
        email: user.email,
        name: user.name
     };
}

export default userRouter
