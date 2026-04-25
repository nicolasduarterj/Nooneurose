
export default class MockAIService {
    //eslint-disable-next-line @typescript-eslint/require-await
    public static async sendMessage(msg: string, systemPrompt: string): Promise<string> {
        return '';
    }
}
