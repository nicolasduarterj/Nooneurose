import Character from "@src/models/common/Character"
import User from "@src/models/common/User"

export default interface ICharacterService {
    create(name: string, description: string, owner: User): Promise<Character>
    getById(id: number): Promise<Character | null>
    getByUser(user: User): Promise<Character[]>
    queryByName(targetName: string): Promise<Character[]>
}
