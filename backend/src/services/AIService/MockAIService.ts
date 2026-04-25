
export default class MockAIService {
    //eslint-disable-next-line @typescript-eslint/require-await
    public static async sendMessage(msg: string, chatID: string): Promise<string> {
        return '';
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async sendMergeMessage(msg: string): Promise<string> {
        return '';
    }
}
