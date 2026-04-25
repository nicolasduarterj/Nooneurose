import openRouter from "@src/common/constants/openRouter"
import EnvVars from "@src/common/constants/env"
import AIServiceError from "@src/common/types/AIServiceError"
import { MessageAndResponse } from "@src/db/schema"
import { ChatCompletionMessageParam } from "openai/resources/index.js"
import logger from 'jet-logger'

export default class MainAIService {
    private static basePrompt: string
    private static model: string

    static {
        MainAIService.basePrompt = ''
        MainAIService.model = EnvVars.OpenRouterModel
    }

    /**
     * Sends a message to the AI model
     * @param msg message to be sent
     * @returns the AI response
     * @throws AIServiceError if the model response is null
     * @throws Error if the API threw an error
     */
    public static async sendMessage(msg: string, systemPrompt: string, history?: MessageAndResponse[]): Promise<string> {
        try {
            const historyFormatted: ChatCompletionMessageParam[] = []
            const historyCast = history ?? []

            for (const mar of historyCast) {
                historyFormatted.push({
                    role: 'user',
                    content: mar.messages.content
                })
                if (mar.responses)
                    historyFormatted.push({
                        role: 'assistant',
                        content: mar.responses.content
                    })
            }

            const messages: ChatCompletionMessageParam[] = [
                {
                    role: 'system',
                    content: systemPrompt
                },
                ...historyFormatted,
                {
                    role: 'user',
                    content: msg
                }
            ]

            logger.info('Sending following completion request to AI:')
            logger.info(JSON.stringify(messages))

            const completion = await openRouter.chat.completions.create({
                model: MainAIService.model,
                messages
            })

            const response = completion.choices[0].message.content

            if (!response) {
                throw new AIServiceError('AI model did not return')
            }

            return response
        } catch (error) {
            if (error instanceof AIServiceError)
                throw error
            else {
                throw new AIServiceError('Unexpected AI service error', { cause: error })
            }
        }
    }
}
