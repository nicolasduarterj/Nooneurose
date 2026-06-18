import authorize from "@src/common/utils/middleware/authorize";
import { Router } from "express";
import { Req, Res } from "./common/express-types";
import { RouteError } from "@src/common/utils/route-errors";
import { getServices } from "@src/services/Services";
import { APIPaths } from "@src/common/constants/Paths";
import { UpdateCharacterData } from "@src/services/CharacterService/ICharacterService";

const characterRouter = Router()

characterRouter.post(APIPaths.Character._(), authorize, async function(req: Req, res: Res) {
    if (!req.body['name'] || !req.body['description'] || !req.user) 
        throw new RouteError(400, 'missing parameters')

    const services = getServices()
    const character = await services.CharacterService.create(
        req.body['name'],
        req.body['description'],
        req.user
    )

    res.json(character)
})

characterRouter.get(APIPaths.Character._(), async function(req:Req, res: Res) {
    const services = getServices()
    const chars = await services.CharacterService.getN(10)
    res.json(chars)
})

characterRouter.get(APIPaths.Character.ById._(), async function(req: Req, res: Res) {
    const id = parseInt(req.params.id)
    if (Number.isNaN(id))
        throw new RouteError(400, 'invalid id')

    const services = getServices()
    const character = await services.CharacterService.getById(id)
    if (!character)
        throw new RouteError(400, 'invalid id')

    res.json(character)
})

characterRouter.get(APIPaths.Character.Search(), async function(req: Req, res: Res) {
    const services = getServices()

    if (!req.params.query)
        throw new RouteError(400, 'missing query')

    const match = await services.CharacterService.queryByName(req.params.query)
    res.json(match)
})

characterRouter.patch(APIPaths.Character.ById._(), authorize, async function(req: Req, res: Res) {
    if(!req.user)
        throw new RouteError(500, 'error missing user')

    const id = parseInt(req.params.id)
    if (Number.isNaN(id))
        throw new RouteError(400, 'invalid id')

    const services = getServices()

    const character = await services.CharacterService.getById(id)
    if (!character)
        throw new RouteError(404, 'character not found')

    if (character.ownerId !== req.user.id)
        throw new RouteError(403, 'you do not own this character')

    const body = req.body as Record<string, unknown>
    const updateData: UpdateCharacterData = {}

    if (body['name'] !== undefined) {
        if (typeof body['name'] !== 'string')
            throw new RouteError(400, 'invalid name')

        updateData.name = body['name']
    }

    if (body['description'] !== undefined) {
        if (typeof body['description'] !== 'string')
            throw new RouteError(400, 'invalid description')

        updateData.description = body['description']
    }

    if (body['imageURL'] !== undefined) {
        if (typeof body['imageURL'] !== 'string' && body['imageURL'] !== null)
            throw new RouteError(400, 'invalid imageURL')

        updateData.imageURL = body['imageURL']
    }

    if (body['isGloballyChangeable'] !== undefined) {
        if (typeof body['isGloballyChangeable'] !== 'boolean')
            throw new RouteError(400, 'invalid isGloballyChangeable')

        updateData.isGloballyChangeable = body['isGloballyChangeable']
    }

    if (body['isPrivatelyChangeable'] !== undefined) {
        if (typeof body['isPrivatelyChangeable'] !== 'boolean')
            throw new RouteError(400, 'invalid isPrivatelyChangeable')

        updateData.isPrivatelyChangeable = body['isPrivatelyChangeable']
    }

    if (Object.keys(updateData).length === 0) {
        throw new RouteError(400, 'no valid fields to update')
    }

    const updatedCharacter = await services.CharacterService.update(id, updateData)

    if (!updatedCharacter) {
        throw new RouteError(404, 'character not found') }

    res.json(updatedCharacter)
})

characterRouter.get(APIPaths.Character.ByOwner(), async function(req: Req, res: Res) {
    const userId = Number.parseInt(req.params.userId)

    if (Number.isNaN(userId))
        throw new RouteError(400, 'id must be a number')

    const services = getServices()
    const user = await services.UserService.getById(userId)

    if (!user)
        throw new RouteError(404, 'user not found')

    const chars = await services.CharacterService.getByUser(user)
    res.json(chars)
})

characterRouter.post(APIPaths.Character.ById.derive(), authorize, async function(req: Req, res: Res) {
    if (!req.user)
        throw new RouteError(500, 'error missing user')

    const charId = Number.parseInt(req.params.id)
    if (Number.isNaN(charId))
        throw new RouteError(400, 'invalid id')

    const services = getServices()
    const base = await services.CharacterService.getById(charId)

    if (!base)
        throw new RouteError(404, 'Inexistent character to derive')

    const derived = await services.CharacterService.createDerived(base, req.user)
    res.json(derived)
})

characterRouter.delete(APIPaths.Character.ById._(), authorize, async function(req: Req, res: Res) {
    if (!req.user)
        throw new RouteError(500, 'error missing user')

    const charId = Number.parseInt(req.params.id)
    if (Number.isNaN(charId))
        throw new RouteError(400, 'invalid id')

    const services = getServices()
    const base = await services.CharacterService.getById(charId)

    if (!base) {
        res.json({ message: 'deleted' })
        return
    }

    if (base.ownerId !== req.user.id && !req.user.isAdmin)
        throw new RouteError(403, 'Character is not yours')

    const chats = await services.ChatService.getByCharacter(base)
    await services.PromptService.deleteByCharacter(base)
    await Promise.all(chats.map(chat => services.MessageStorageService.deleteMessagesAndResponsesByChat(chat)))
    await Promise.all(chats.map(chat => services.ChatService.delete(chat)))
    await services.CharacterService.delete(base)
    res.json({ message: 'deleted' })
})

export default characterRouter
