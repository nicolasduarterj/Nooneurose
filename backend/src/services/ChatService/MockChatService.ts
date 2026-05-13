import Chat from "@src/models/common/Chat"
import Character from "@src/models/common/Character"
import User from "@src/models/common/User"

export default abstract class MockChatService {
    private static nextId = 9000

    public static async create(owner: User, character: Character): Promise<Chat> {
        return {
            id: MockChatService.nextId++,
            ownerId: owner.id,
            characterId: character.id,
        }
    }

    public static async getChatsByUser(user: User): Promise<Chat[]> {
        return [
            {
                id: 9000,
                ownerId: user.id,
                characterId: 1,
            },
            {
                id: 9000,
                ownerId: user.id,
                characterId: 1,
            },
        ]
    }

    public static async getChatsById(id: number): Promise<Chat | null> {
        return {
            id,
            ownerId :1,
            characterId: 1,
        }
    }
}