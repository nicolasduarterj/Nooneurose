import UserServiceError from "@src/common/types/UserServiceError"
import User from "@src/models/common/User"
import { UpdateUserData } from "./UserService"

export default abstract class LocalUserService {

    private static userRepo = new Set<User>()
    private static counter = 0

    // eslint-disable-next-line
    public static async create(email: string, password: string, name: string): Promise<User> {
        const alreadyExists = Array.from(this.userRepo).find(user => user.email === email)

        if (alreadyExists) {
            throw new UserServiceError('User already exists')
        }

        const user: User = {
            id: ++LocalUserService.counter,
            name,
            email,
            password
        }

        this.userRepo.add(user)
        return user
    }

    // eslint-disable-next-line
    public static async authenticateAndRetrieve(email: string, password: string): Promise<User | null> {
        const user = Array.from(this.userRepo).find(user => user.email === email)

        if (!user || user.password !== password) {
            return null
        }

        return user
    }

    // eslint-disable-next-line
    public static async getById(id: number): Promise<User | null> {
        const user = Array.from(this.userRepo).find(user => user.id === id)

        return user ?? null
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public static async update(user: User, change: UpdateUserData): Promise<User> {
        const foundUser = Array.from(this.userRepo).find(candidate => candidate.id === user.id) as User
        foundUser.name = change.name ?? foundUser.name
        foundUser.password = change.password ?? foundUser.password
        return foundUser
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public static async search(query: string): Promise<User[]> {
        const candidates = Array.from(this.userRepo).filter(user => user.name.match(query) !== null)
        return candidates
    }
}
