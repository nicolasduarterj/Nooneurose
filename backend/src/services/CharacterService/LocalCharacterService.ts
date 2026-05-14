import Character from "@src/models/common/Character"
import User from "@src/models/common/User"

export default abstract class LocalCharacterService {
    private static characterStore: Character[] = []
    private static nextId = 0

    //eslint-disable-next-line
    public static async create(name: string, description: string, owner: User): Promise<Character> {
        const newChar: Character = {
            id: ++LocalCharacterService.nextId,
            name,
            description,
            ownerId: owner.id,
            isGloballyChangeable: false,
            isPrivatelyChangeable: false,
            imageURL: null
        }

        this.characterStore.push(newChar)
        return newChar
    }

    //eslint-disable-next-line
    public static async getById(id: number): Promise<Character | null> {
        return this.characterStore.find(char => char.id === id) ?? null
    }
}
