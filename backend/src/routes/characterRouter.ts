import authorize from "@src/common/utils/middleware/authorize";
import { Router } from "express";
import { Req, Res } from "./common/express-types";
import { RouteError } from "@src/common/utils/route-errors";
import { getServices } from "@src/services/Services";
import { APIPaths } from "@src/common/constants/Paths";

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

export default characterRouter
