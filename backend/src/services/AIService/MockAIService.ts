import Message from "@src/models/common/Message";

export default class MockAIService {
    //eslint-disable-next-line
    public static async sendMessage(msg: string, systemPrompt: string, history?: Message[]): Promise<string> {
        return 'Retorno mock da IA.';
    }
}
