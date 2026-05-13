import Character from "@src/models/common/Character"
import { charactersTable } from "@src/db/schema"
import db from "@src/db/db"
import User from "@src/models/common/User"
import { eq } from "drizzle-orm"

export default abstract class MainCharacterService {
    public static async create(name: string, description: string, owner: User): Promise<Character> {
        const res = await db.insert(charactersTable).values({
            name: name,
            description: description,
            ownerId: owner.id,
            isGloballyChangeable: true,
            isPrivatelyChangeable: true,
        }).returning()

        return res[0]
    }

    public static async getById(id: number): Promise<Character | null> {
        const res = await db.select().from(charactersTable).where(eq(charactersTable.id, id))
        if (res.length < 1)
            return null
        return res[0]
    }
}
