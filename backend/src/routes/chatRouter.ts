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

/**cria novo chat para o usuário autenticado*/
chatRouter.post('/', async function(req: Req, res: Res) {
    if (req.headers['content-type'] !== 'application/json')
        throw new RouteError(400, 'Invalid content-type')
 
    if (!req.body['characterId'])
        throw new RouteError(400, 'Missing parameter: characterId')
 
    const user = req.user
    if (!user)
        throw new RouteError(401, 'Unauthorized')
 
    const services = getServices()
 
    const character = await services.CharacterService.getById(Number(req.body['characterId']))
    if (!character)
        throw new RouteError(404, 'Character not found')
 
    const chat = await services.ChatService.create(user, character)
    res.json(chat)
})

/**Pega todos os chats do usuário*/
chatRouter.get('/', async function(req: Req, res: Res) {
    const user = req.user
    if (!user)
        throw new RouteError(401, 'Unauthorized')
 
    const services = getServices()
 
    const chats = await services.ChatService.getChatsByUser(user)
    res.json(chats)
})

export default chatRouter
