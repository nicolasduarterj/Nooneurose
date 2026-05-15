import { Router } from "express";
import { getServices } from "@src/services/Services";
import { APIPaths } from "@src/common/constants/Paths";
import { Req, Res } from "./common/express-types";
import authorize from "@src/common/utils/middleware/authorize";
import { RouteError } from "@src/common/utils/route-errors";

const chatRouter = Router()

chatRouter.post(APIPaths.User.Chats._(), authorize, async function(req: Req, res: Res) {
    if (!req.user)
        throw new RouteError(500, 'error missing user')

    const characterId = parseInt(req.body['characterId'])
    if (Number.isNaN(characterId))
        throw new RouteError(400, 'Invalid character id')

    const services = getServices()
    const character = await services.CharacterService.getById(characterId)
    if (!character)
        throw new RouteError(400, 'Inexistent character')


    const newChat = await services.ChatService.create(req.user, character)
    res.json(newChat)
})

chatRouter.get(APIPaths.User.Chats._(), authorize, async function(req: Req, res: Res) {
    if (!req.user)
        throw new RouteError(500, 'error missing user')

    const services = getServices()
    const chats = await services.ChatService.getChatsByUser(req.user)
    res.json(chats)
})

chatRouter.get(APIPaths.User.Chats.ChatId._(), authorize, async function(req: Req, res: Res) {
    if (!req.user)
        throw new RouteError(500, 'error missing user')

    const chatId = parseInt(req.params.id)
    if (Number.isNaN(chatId))
        throw new RouteError(400, 'Invalid chatId')

    const services = getServices()
    const chat = await services.ChatService.getChatById(chatId)
    if (!chat || chat.ownerId !== req.user.id)
        throw new RouteError(404, 'Inexistent chat')

    res.json(chat)
})

chatRouter.get(APIPaths.User.Chats.ChatId.Messages(), authorize, async function(req: Req, res: Res) {
    if (!req.user)
        throw new RouteError(500, 'error missing user')

    const chatId = parseInt(req.params.id)
    if (Number.isNaN(chatId))
        throw new RouteError(400, 'Invalid chatId')

    const services = getServices()
    const chat = await services.ChatService.getChatById(chatId)
    if (!chat || chat.ownerId !== req.user.id)
        throw new RouteError(404, 'Inexistent chat')

    const messages = await services.MessageStorageService.getMessagesAndResponsesByChat(chat)
    res.json(messages)
})

export default chatRouter
