import openRouter from "@src/common/constants/openRouter"
import EnvVars from "@src/common/constants/env"
import AIServiceError from "@src/common/types/AIServiceError"

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
    public static async sendMessage(msg: string, chatID: string): Promise<string> {
        try {
            const completion = await openRouter.chat.completions.create({
                model: MainAIService.model,
                messages: [
                    {
                        role: 'user',
                        content: msg
                    }
                ]
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

    public static async sendMergeMessage(msg: string): Promise<string> {
        try {
            const completion = await openRouter.chat.completions.create({
                model: MainAIService.model,
                messages: [
                    {
                        role: 'system',
                        content: msg
                    }
                ]
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
