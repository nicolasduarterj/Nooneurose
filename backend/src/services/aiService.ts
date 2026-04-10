import openRouter from "@src/common/constants/openRouter"
import EnvVars from "@src/common/constants/env"
import AIServiceError from "@src/common/types/AIServiceError"

export default class AIService {
    private static basePrompt: string
    private static model: string

    static {
        AIService.basePrompt = ''
        AIService.model = 'google/gemma-4-26b-a4b-it:free'
    }

    /**
     * Sends a message to the AI model
     * @param msg message to be sent
     * @returns the AI response
     * @throws AIServiceError if the model response is null
     */
    public static async sendMessage(msg: string): Promise<string> {
        const completion = await openRouter.chat.completions.create({
            model: EnvVars.OpenRouterModel,
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
    }
}
