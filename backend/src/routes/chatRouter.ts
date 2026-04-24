import { Req, Res } from "./common/express-types";

import { getServices } from "@src/services/Services";
import { RouteError } from "@src/common/utils/route-errors";
import { Router } from "express";
import Paths from "@src/common/constants/Paths";

const chatRouter = Router()

/**
 * Get all messages and responses of a chat
 */
chatRouter.get(Paths.Chat.ChatUUID, async function(req: Req, res: Res) {
    const chatUUID = req.params.chatUUID

    if (!chatUUID)
        throw new RouteError(400, 'Invalid chatUUID')

    const services = getServices()

    const result = await services.MessageStorageService.getMessagesAndResponsesByChat(chatUUID)
    const filteredResult = result.map(msgAndResponse => ({ 
        message: msgAndResponse.messages.content,
        response: msgAndResponse.responses?.content ?? null
    }))
    res.json(filteredResult)
})

export default chatRouter
