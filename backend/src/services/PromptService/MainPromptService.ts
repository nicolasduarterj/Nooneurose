import db from "@src/db/db"
import { Prompt, promptsTable } from "@src/db/schema"
import { desc } from "drizzle-orm"
import DatabaseMessageStorageService from "../MessageStorageService/DatabaseMessageStorageService"
import MainAIService from "../AIService/MainAIService"

export default abstract class MainPromptService {
    private static baseSystemPrompt = 'PROMPT DE SISTEMA:' +
        '\nUsuários enviarão mensagens e você deve obedecê-los.\n' +
        'Se eles pedirem para você agir de um certo jeito, aja de acordo. Encarne os desejos dos usuários sempre.\n' +
        'Se adapte de maneira a dar a experiência mais imersiva possível para os usuários.'

    private static mergePrompt = ['A seguir estará seu prompt de sistema atual e um conjunto de mensagens de usuários. ' +
        'Você deve mesclar a personalidade descrita no seu prompt de sistema e a personalidade demandada pelos usuários, ' +
        'produzindo um novo prompt de sistema que faça você agir de acordo com as expectativas do usuário. Responda apenas ' +
        'da seguinte maneira:\n\n' +
        'PROMPT DE SISTEMA:<RESPOSTA>\n\n'+
        'Segue o seu prompt de sistema atual:\n\n',
        '\n\nSegue abaixo as mensagens do usuário:\n\n',
    ]

    public static async registerPrompt(content: string, parent_id: number | null): Promise<Prompt> {
        const newPrompt: typeof promptsTable.$inferInsert = {
            content,
            parentId: parent_id
        }

        const res = await db.insert(promptsTable).values(newPrompt).returning()
        const prompt = res[0]

        return prompt
    }

    public static async getLatestPrompt(): Promise<Prompt> {
        const res = await db.select().from(promptsTable).orderBy(desc(promptsTable.timestamp)).limit(1)
        if (res.length === 0)
            return {
                content: MainPromptService.baseSystemPrompt,
                id: 0,
                parentId: null,
                timestamp: new Date()
            }

        return res[0]
    }

    public static async generatePromptFromUnusedMessage(chat_uuid: string): Promise<Prompt | null> {
        const messages = await DatabaseMessageStorageService.getUnusedMessages(chat_uuid)
        if (messages.length === 0)
            return null

        const messagesText = messages.map(msg => msg.content).join('<END OF MESSAGE>\n\n')
        const currentPrompt = await MainPromptService.getLatestPrompt()

        const mergePrompt = MainPromptService.mergePrompt[0] 
            + currentPrompt.content
            + MainPromptService.mergePrompt[1]
            + messagesText

        const newPromptext = await MainAIService.sendMergeMessage(mergePrompt)
        const newPromptInsert: typeof promptsTable.$inferInsert = {
            content: newPromptext,
            parentId: currentPrompt.id,
        }

        const newPrompt = await db.insert(promptsTable).values(newPromptInsert).returning()
        return newPrompt[0]
    }
}
