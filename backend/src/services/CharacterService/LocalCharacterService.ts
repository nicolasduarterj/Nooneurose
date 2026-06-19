import Character from "@src/models/common/Character"
import User from "@src/models/common/User"
import { UpdateCharacterData } from "./ICharacterService"

export default abstract class LocalCharacterService {
    private static characterStore: Character[] = []
    private static nextId = 0

    //eslint-disable-next-line
    public static async create(name: string, description: string, owner: User, permissionFile?: string): Promise<Character> {
        const newChar: Character = {
            id: ++LocalCharacterService.nextId,
            name,
            description,
            ownerId: owner.id,
            isGloballyChangeable: false,
            isPrivatelyChangeable: false,
            imageURL: null,
            permissionFile: permissionFile ?? null
        }

        this.characterStore.push(newChar)
        return newChar
    }

    //eslint-disable-next-line
    public static async getById(id: number): Promise<Character | null> {
        return this.characterStore.find(char => char.id === id) ?? null
    }

    //eslint-disable-next-line
    public static async getByUser(user: User): Promise<Character[]> {
        return this.characterStore.filter(char => char.ownerId === user.id)
    }

    //eslint-disable-next-line
    public static async queryByName(targetName: string): Promise<Character[]> {
        const regex = new RegExp(`.*${targetName}.*`)
        return this.characterStore.filter(char => regex.test(char.name))
    }

    //eslint-disable-next-line
    public static async update(id: number, data: UpdateCharacterData): Promise<Character | null> {
        const character = this.characterStore.find(char => char.id === id)

        if (!character)
            return null

        if (data.name !== undefined)
            character.name = data.name

        if (data.description !== undefined)
            character.description = data.description

        if (data.imageURL !== undefined)
            character.imageURL = data.imageURL

        if (data.isGloballyChangeable !== undefined)
            character.isGloballyChangeable = data.isGloballyChangeable

        if (data.isPrivatelyChangeable !== undefined)
            character.isPrivatelyChangeable = data.isPrivatelyChangeable

        return character
    }

    //eslint-disable-next-line
    public static async createDerived(base: Character, newOwner: User): Promise<Character> {
        const clone: Character = { ...base, ownerId: newOwner.id, id: ++this.nextId }
        this.characterStore.push(clone)
        return clone
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public static async getN(n: number): Promise<Character[]> {
        return this.characterStore.slice(0, n)
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public static async delete(character: Character): Promise<void> {
        this.characterStore = this.characterStore.filter(char => char.id !== character.id)
    }
}
