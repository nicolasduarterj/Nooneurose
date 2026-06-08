import Chat from "@src/models/common/Chat"
import Character from "@src/models/common/Character"
import User from "@src/models/common/User"
import { chatsTable } from "@src/db/schema"
import db from "@src/db/db"
import { eq } from "drizzle-orm"

export default abstract class MainChatService {
    public static async create(owner: User, character: Character): Promise<Chat> {
        const res = await db.insert(chatsTable).values({
            ownerId: owner.id,
            characterId: character.id,
        }).returning()

        return res[0]
    }

    public static async getChatsByUser(user: User): Promise<Chat[]> {
        const res = await db.select().from(chatsTable).where(eq(chatsTable.ownerId, user.id))
        return res
    }
 
    public static async getChatById(id: number): Promise<Chat | null> {
        const res = await db.select().from(chatsTable).where(eq(chatsTable.id, id))
        if (res.length < 1)
            return null
        return res[0]
    }

    public static async getByCharacter(character: Character): Promise<Chat[]> {
        const res = await db.select().from(chatsTable).where(eq(chatsTable.characterId, character.id))
        return res
    }

    public static async delete(chat: Chat): Promise<void> {
        await db.delete(chatsTable).where(eq(chatsTable.id, chat.id))
    }
}
