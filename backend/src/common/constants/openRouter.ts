import OpenAI from 'openai'
import EnvVars from './env'

const openRouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: EnvVars.OpenRouterAPIKey,
})

export default openRouter
