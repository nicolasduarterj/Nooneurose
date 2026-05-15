import db from "@src/db/db"
import { Prompt, promptsTable } from "@src/db/schema"
import { desc } from "drizzle-orm"
import DatabaseMessageStorageService from "../MessageStorageService/DatabaseMessageStorageService"
import MainAIService from "../AIService/MainAIService"
import PromptServiceError, { ThrowsPromptServiceError } from "@src/common/types/PromptServiceError"
import Character from "@src/models/common/Character"
import Chat from "@src/models/common/Chat"
import { getServices } from "../Services"

export default abstract class MainPromptService {
    private static baseSystemPrompt = 'PROMPT DE SISTEMA:' +
        '\nUsuários enviarão mensagens e você deve obedecê-los.\n' +
        'Se eles pedirem para você agir de um certo jeito, aja de acordo. Encarne os desejos dos usuários sempre.\n' +
        'Se adapte de maneira a dar a experiência mais imersiva possível para os usuários.'

    private static mergePrompt = ['A seguir estará seu prompt de sistema atual e um conjunto de mensagens de usuários. ' +
        'Você deve mesclar a personalidade descrita no seu prompt de sistema e a personalidade demandada pelos usuários, ' +
        'produzindo um novo prompt de sistema que faça você agir de acordo com as expectativas do usuário. ' +
        'Misture a sua personalidade atual com a requisitada pelo usuário, mesclando as duas e criando algo novo. ' +
        'Se a mensagem não contiver nenhuma instrução de como agir, pode ignorá-la.\n' +
        'Responda apenas da seguinte maneira:\n' +
        'PROMPT DE SISTEMA:<RESPOSTA>\n\n'+
        'Segue o seu prompt de sistema atual:\n',
        '\n\nSegue abaixo as mensagens do usuário:\n\n',
    ]

    @ThrowsPromptServiceError
    public static async register(content: string, parentId: number | null, character: Character): Promise<Prompt> {
        const newPrompt: typeof promptsTable.$inferInsert = {
            content,
            parentId: parentId,
            character: character.id
        }

        const res = await db.insert(promptsTable).values(newPrompt).returning()
        const prompt = res[0]

        return prompt
    }

    @ThrowsPromptServiceError
    public static async getLatestPrompt(character: Character): Promise<Prompt> {
        const res = await db.select().from(promptsTable).orderBy(desc(promptsTable.timestamp)).limit(1)
        if (res.length === 0)
            return {
                content: MainPromptService.baseSystemPrompt,
                id: 0,
                parentId: null,
                timestamp: new Date(),
                character: character.id
            }

        return res[0]
    }

    @ThrowsPromptServiceError
    public static async generatePromptFromUnusedMessages(chat: Chat): Promise<Prompt | null> {
        const messages = await DatabaseMessageStorageService.getUnusedMessages(chat)
        if (messages.length === 0)
            return null

        const messagesText = messages.map(msg => msg.content).join('<FIM DA MENSAGEM>\n\n')
        const services = getServices()
        const character = await services.CharacterService.getById(chat.characterId)
        if (!character)
            throw new PromptServiceError()
        const currentPrompt = await MainPromptService.getLatestPrompt(character)

        const mergePrompt = MainPromptService.mergePrompt[0] 
            + currentPrompt.content
            + MainPromptService.mergePrompt[1]
            + messagesText

        const newPromptext = await MainAIService.sendMessage('', mergePrompt)
        const newPromptInsert: typeof promptsTable.$inferInsert = {
            content: newPromptext,
            parentId: currentPrompt.id === 0 ? null : currentPrompt.id,
            character: character.id
        }

        const newPrompt = await db.insert(promptsTable).values(newPromptInsert).returning()
        void messages.map(msg => services.MessageStorageService.markMessageAsIncluded(msg.id))
        return newPrompt[0]
    }
}
