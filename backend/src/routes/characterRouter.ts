import authorize from "@src/common/utils/middleware/authorize";
import { Router } from "express";
import { Req, Res } from "./common/express-types";
import { RouteError } from "@src/common/utils/route-errors";
import { getServices } from "@src/services/Services";
import Paths from "@src/common/constants/Paths";

const characterRouter = Router()

characterRouter.post('/', authorize, async function(req: Req, res: Res) {
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

characterRouter.get(Paths.Character.ById, async function(req: Req, res: Res) {
    const id = parseInt(req.params.id)
    if (Number.isNaN(id))
        throw new RouteError(400, 'invalid id')

    const services = getServices()
    const character = await services.CharacterService.getById(id)
    if (!character)
        throw new RouteError(400, 'invalid id')

    res.json(character)
})

export default characterRouter
