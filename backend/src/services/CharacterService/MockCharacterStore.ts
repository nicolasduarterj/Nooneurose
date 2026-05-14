import Character from "@src/models/common/Character";
import User from "@src/models/common/User";

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
}
