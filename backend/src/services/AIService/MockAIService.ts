import { MessageAndResponse } from "@src/db/schema";

export default class MockAIService {
    //eslint-disable-next-line @typescript-eslint/require-await
    public static async sendMessage(msg: string, systemPrompt: string, history?: MessageAndResponse[]): Promise<string> {
        return 'Retorno mock da IA.';
    }
}
