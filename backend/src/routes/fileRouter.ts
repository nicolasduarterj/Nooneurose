import { APIPaths } from "@src/common/constants/Paths";
import authorize from "@src/common/utils/middleware/authorize";
import { Router } from "express";
import { Req, Res } from "./common/express-types";
import { RouteError } from "@src/common/utils/route-errors";
import { getServices } from "@src/services/Services";
import EnvVars from "@src/common/constants/env";

const fileRouter = Router()

fileRouter.get(APIPaths.File.ByFilename(), authorize, async function(req: Req, res: Res) {
    if (!req.user || !req.user.isAdmin)
        throw new RouteError(403, 'must be admin to see files')

    const services = getServices()
    const file = await services.FileService.retrieve(req.params.filename)
    if (!file)
        throw new RouteError(404, 'file not found')

    const arrBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrBuffer)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=${file.name}`)
    res.send(buffer)
})

export default fileRouter
