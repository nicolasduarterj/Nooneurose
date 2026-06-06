import User from "@src/models/common/User"
import { UpdateUserData } from "./UserService"

export default abstract class MockUserService {

    private static mockUser: User = {
        id: 1,
        name: 'Teste',
        password: 'awidmodnawodnaodnawoi',
        email: 'testeman@naoexiste.org'
    }

    // eslint-disable-next-line
    public static async create(email: string, password: string, name: string): Promise<User> {
        return MockUserService.mockUser
    }

    // eslint-disable-next-line
    public static async authenticateAndRetrieve(email: string, password: string): Promise<User | null> {
        return MockUserService.mockUser
    }

    // eslint-disable-next-line
    public static async getById(id: number): Promise<User | null> {
        return MockUserService.mockUser
    }

    // eslint-disable-next-line
    public static async update(user: User, change: UpdateUserData): Promise<User> {
        return MockUserService.mockUser
    }

    // eslint-disable-next-line
    public static async search(query: string): Promise<User[]> {
        return [MockUserService.mockUser]
    }
}
