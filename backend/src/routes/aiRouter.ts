import { Req, Res } from "./common/express-types";

import { getServices } from "@src/services/Services";
import { RouteError } from "@src/common/utils/route-errors";
import { Router } from "express";
import Paths from "@src/common/constants/Paths";
import authorize from "@src/common/utils/middleware/authorize";

const aiRouter = Router()

aiRouter.post(Paths.AI.Send, authorize, async function(req: Req, res: Res) {
    const services = getServices()

    if (req.headers['content-type'] != 'application/json') {
        throw new RouteError(400, 'Invalid content-type.')
    }

    const content = req.body['message']
    if (!content) {
        throw new RouteError(400, 'Missing message')
    }

    const chatId = parseInt(req.body['chatId'])
    if (Number.isNaN(chatId))
        throw new RouteError(400, 'Missing chat UUID')

    const chat = await services.ChatService.getChatById(chatId)
    if (!chat || chat.ownerId !== req.user?.id)
        throw new RouteError(400, 'Inexistent chat')

    const msg = await services.MessageStorageService.registerMessage(content, chat)
    const character = await services.CharacterService.getById(chat.characterId)
    if (!character)
        throw new RouteError(500, 'chat with invalid character')
    const latestPrompt = await services.PromptService.getLatestPrompt(character)
    const history = await services.MessageStorageService.getMessagesAndResponsesByChat(chat)
    const response = await services.AIService.sendMessage(msg.content, latestPrompt.content, history)
    await services.MessageStorageService.registerResponse(response, msg.id)
    res.json({ response: response })
    await services.PromptService.generatePromptFromUnusedMessages(chat)
})

export default aiRouter
