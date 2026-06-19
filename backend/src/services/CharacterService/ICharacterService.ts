import Character from "@src/models/common/Character"
import User from "@src/models/common/User"

export default interface ICharacterService {
    create(name: string, description: string, owner: User, permissionFile?: string): Promise<Character>
    getById(id: number): Promise<Character | null>
    getByUser(user: User): Promise<Character[]>
    queryByName(targetName: string): Promise<Character[]>
    update(id: number, data: UpdateCharacterData): Promise<Character | null>
    createDerived(base: Character, newOwner: User): Promise<Character>
    getN(n: number): Promise<Character[]>
    delete(Character: Character): Promise<void>
}

export type UpdateCharacterData = {
    name?: string
    description?: string
    imageURL?: string | null
    isGloballyChangeable?: boolean
    isPrivatelyChangeable?: boolean
}
