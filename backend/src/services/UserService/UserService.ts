import User from "@src/models/common/User";

export default interface IUserService {
    create(email: string, password: string, name: string): Promise<User>
    authenticateAndRetrieve(email: string, password: string): Promise<User | null>
    getById(id: number): Promise<User | null>
    update(user: User, change: UpdateUserData): Promise<User>
    search(query: string): Promise<User[]>
}

export interface UpdateUserData {
    name?: string
    password?: string
}
