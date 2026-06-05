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

characterRouter.get(APIPaths.Character.ById(), async function(req: Req, res: Res) {
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

characterRouter.patch(APIPaths.Character.ById(), authorize, async function(req: Req, res: Res) {
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

export default characterRouter
