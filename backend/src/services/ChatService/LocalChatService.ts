import Chat from "@src/models/common/Chat"
import Character from "@src/models/common/Character"
import User from "@src/models/common/User"

export default abstract class LocalChatService {
    private static chatStore: Chat[] = []
    private static nextId = 1

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async create(owner: User, character: Character): Promise<Chat> {
        const chat: Chat = {
            id: LocalChatService.nextId++,
            ownerId: owner.id,
            characterId: character.id,
        }

        LocalChatService.chatStore.push(chat)
        return chat
        }

        //eslint-disable-next-line @typescript-eslint/require-await
        public static async getChatsByUser(user: User): Promise<Chat[]> {
            return LocalChatService.chatStore.filter(c => c.ownerId === user.id)
        }

        //eslint-disable-next-line @typescript-eslint/require-await
        public static async getChatById(id: number): Promise<Chat | null> {
            return LocalChatService.chatStore.find(c => c.id === id) ?? null
        }

        // eslint-disable-next-line @typescript-eslint/require-await
        public static async getByCharacter(character: Character): Promise<Chat[]> {
            return this.chatStore.filter(candidate => candidate.characterId === character.id)
        }

        // eslint-disable-next-line @typescript-eslint/require-await
        public static async delete(chat: Chat): Promise<void> {
            this.chatStore = this.chatStore.filter(candidate => candidate.id !== chat.id)
        }
}
