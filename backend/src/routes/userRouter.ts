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

const userRouter = Router()

userRouter.post(APIPaths.User._(), async function(req: Req, res: Res) {
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
            throw new RouteError(400, 'user already exists')
        } else {
            throw error
        }
    }
})

userRouter.post(APIPaths.User.Login(), async function(req: Req, res: Res) {
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

userRouter.get(APIPaths.User.byId(), async function(req: Req, res: Res) {
    const id = parseInt(req.params.id)
    if (Number.isNaN(id))
        throw new RouteError(400, 'Invalid id')

    const services = getServices()
    const user = await services.UserService.getById(id)

    if (!user)
        throw new RouteError(404, 'User not found')

    res.json({ ...user, password: undefined })
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

export default userRouter
