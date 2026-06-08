import Character from "@src/models/common/Character";
import User from "@src/models/common/User";
import { UpdateCharacterData } from "./ICharacterService";

export default abstract class MockCharacterService {
    private static mockChar: Character = {
        id: 1,
        ownerId: 1,
        name: 'TesteMan',
        description: 'Teste',
        isGloballyChangeable: true,
        isPrivatelyChangeable: true,
        imageURL: null
    }

    //eslint-disable-next-line
    public static async create(name: string, description: string, owner: User): Promise<Character> {
        return this.mockChar
    }

    //eslint-disable-next-line
    public static async getById(id: number): Promise<Character> {
        return this.mockChar
    }

    //eslint-disable-next-line
    public static async getByUser(user: User): Promise<Character[]> {
        return [this.mockChar]
    }

    //eslint-disable-next-line
    public static async queryByName(targetName: string): Promise<Character[]> {
        return [this.mockChar]
    }

    //eslint-disable-next-line
    public static async update(id: number, data: UpdateCharacterData): Promise<Character> {
        return this.mockChar = {
            ...this.mockChar,
            ...data,
            id: this.mockChar.id,
            ownerId: this.mockChar.ownerId,
        }
    }

    //eslint-disable-next-line
    public static async createDerived(base: Character, newOwner: User): Promise<Character> {
        return this.mockChar
    }

    //eslint-disable-next-line
    public static async getN(n: number): Promise<Character[]> {
        return [this.mockChar]
    }

    public static async delete(character: Character): Promise<void> {}
}
