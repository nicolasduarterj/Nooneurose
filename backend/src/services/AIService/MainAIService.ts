import openRouter from "@src/common/constants/openRouter"
import EnvVars from "@src/common/constants/env"
import AIServiceError, { ThrowsAIServiceError } from "@src/common/types/AIServiceError"
import { ChatCompletionMessageParam } from "openai/resources/index.js"
import logger from 'jet-logger'
import Message from "@src/models/common/Message"

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
     * @throws AIServiceError
     */
    @ThrowsAIServiceError
    public static async sendMessage(msg: string, systemPrompt: string, history?: Message[]): Promise<string> {

        const newmsg: ChatCompletionMessageParam = {
            content: msg,
            role: 'user'
        }

        const systemmsg: ChatCompletionMessageParam = {
            content: systemPrompt,
            role: 'system'
        }

        const messages = history
            ? [systemmsg, ...history.map(msg => ({ content: msg.content, role: msg.source })), newmsg]
            : [systemmsg, newmsg]

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
    }
}
