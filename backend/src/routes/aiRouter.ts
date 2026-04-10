import { Req, Res } from "./common/express-types";

import { RouteError } from "@src/common/utils/route-errors";
import { Router } from "express";
import Paths from "@src/common/constants/Paths";
import AIService from "@src/services/aiService";

const aiRouter = Router()

aiRouter.post(Paths.AI.Send, async function(req: Req, res: Res) {
    if (req.headers['content-type'] != 'application/json') {
        throw new RouteError(400, 'Invalid content-type.')
    }

    const msg = req.body['message']
    if (msg === '') {
        throw new RouteError(400, 'Missing message')
    }

    const response = await AIService.sendMessage(msg)
    res.send({ response: response })
})

export default aiRouter
