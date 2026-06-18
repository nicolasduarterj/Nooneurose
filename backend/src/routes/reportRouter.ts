import { APIPaths } from "@src/common/constants/Paths";
import { Router } from "express";
import { Req, Res } from "./common/express-types";
import authorize from "@src/common/utils/middleware/authorize";
import { RouteError } from "@src/common/utils/route-errors";
import { getServices } from "@src/services/Services";

const reportRouter = Router()

reportRouter.post(APIPaths.Report._(), authorize, async function(req: Req, res: Res) {
    if (!req.user)
        throw new RouteError(500, 'missing user')

    const charId = Number.parseInt(req.body.characterId)

    if (Number.isNaN(charId) || !req.body.motive)
        throw new RouteError(400, 'missing parameters')

    const services = getServices()
    const character = await services.CharacterService.getById(charId)

    if (!character)
        throw new RouteError(400, 'inexistent character')

    const report = await services.ReportService.create(character, req.body.motive)
    res.json(report)
})

reportRouter.get(APIPaths.Report._(), authorize, async function(req: Req, res: Res) {
    if (!req.user)
        throw new RouteError(500, 'missing user')

    if (!req.user.isAdmin)
        throw new RouteError(403, 'Only admins can see reports')

    const services = getServices()
    const reports = await services.ReportService.getAll()
    res.json(reports)
})

export default reportRouter
