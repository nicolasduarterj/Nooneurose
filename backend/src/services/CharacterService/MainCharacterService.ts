import Character from "@src/models/common/Character"
import { charactersTable, promptsTable } from "@src/db/schema"
import db from "@src/db/db"
import User from "@src/models/common/User"
import { eq, ilike } from "drizzle-orm"
import { UpdateCharacterData } from "./ICharacterService"
import { getServices } from "../Services"

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

    public static async getByUser(user: User): Promise<Character[]> {
        const res = await db.select().from(charactersTable).where(eq(charactersTable.ownerId, user.id))
        return res
    }

    public static async queryByName(targetName: string): Promise<Character[]> {
        const res = await db.select().from(charactersTable)
            .where(ilike(charactersTable.name, `%${targetName}%`))

        return res
    }

    public static async update(id: number, data: UpdateCharacterData): Promise<Character | null> {
        const res = await db.update(charactersTable).set(data).where(eq(charactersTable.id, id)).returning()
        if (res.length < 1)
            return null
        return res[0]
    }

    public static async createDerived(base: Character, newOwner: User): Promise<Character> {
        const services = getServices()
        const res = await db.insert(charactersTable).values({
            name: base.name,
            description: base.description,
            ownerId: newOwner.id,
            isGloballyChangeable: true,
            isPrivatelyChangeable: true,
            imageURL: base.imageURL
        }).returning()

        const character = res[0]
        const latestBasePrompt = await services.PromptService.getLatestPrompt(base)
        await db.insert(promptsTable).values({
            content: latestBasePrompt.content,
            parentId: latestBasePrompt.parentId,
            character: character.id,
            timestamp: new Date()
        })

        return character
    }

    public static async getN(n: number): Promise<Character[]> {
        const res = await db.select().from(charactersTable).limit(n)
        return res
    }
}
