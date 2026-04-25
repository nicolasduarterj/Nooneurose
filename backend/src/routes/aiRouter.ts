import { Req, Res } from "./common/express-types";

import { getServices } from "@src/services/Services";
import { RouteError } from "@src/common/utils/route-errors";
import { Router } from "express";
import Paths from "@src/common/constants/Paths";

const aiRouter = Router()

aiRouter.post(Paths.AI.Send, async function(req: Req, res: Res) {
    const services = getServices()

    if (req.headers['content-type'] != 'application/json') {
        throw new RouteError(400, 'Invalid content-type.')
    }

    const msg = req.body['message']
    if (!msg) {
        throw new RouteError(400, 'Missing message')
    }

    const chatUUID = req.body['chatUUID']
    if (!chatUUID)
        throw new RouteError(400, 'Missing chat UUID')


    const latestPrompt = await services.PromptService.getLatestPrompt()
    const loggedMessage = await services.MessageStorageService.registerMessage(msg, chatUUID)
    const response = await services.AIService.sendMessage(latestPrompt.content, msg)
    await services.MessageStorageService.registerResponse(response, loggedMessage.id)
    res.send({ response: response })
    await services.PromptService.generatePromptFromUnusedMessages(chatUUID)
})

export default aiRouter
