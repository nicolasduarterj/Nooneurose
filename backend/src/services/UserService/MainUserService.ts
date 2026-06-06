import User from "@src/models/common/User";
import { usersTable } from "@src/db/schema";
import { ThrowsUserServiceError } from "@src/common/types/UserServiceError";
import db from "@src/db/db";
import bcrypt from 'bcrypt'
import { eq } from "drizzle-orm";
import { UpdateUserData } from "./UserService";

export default abstract class MainUserService {

    @ThrowsUserServiceError
    public static async create(email: string, password: string, name: string): Promise<User> {
        const passHash = await bcrypt.hash(password, 10)
        const newUser: typeof usersTable.$inferInsert = {
            name,
            email,
            password: passHash
        }

        const res = await db.insert(usersTable).values(newUser).returning()
        return res[0]
    }

    @ThrowsUserServiceError
    public static async authenticateAndRetrieve(email: string, password: string): Promise<User | null> {
        const candidates = await db.select().from(usersTable).where(eq(usersTable.email, email))
        if (candidates.length < 1) {
            return null
        }

        const passwordMatch = await bcrypt.compare(password, candidates[0].password)
        if (!passwordMatch) {
            return null
        }

        return candidates[0]
    }

    @ThrowsUserServiceError
    public static async getById(id: number): Promise<User | null> {
        const candidates = await db.select().from(usersTable).where(eq(usersTable.id, id))

        if (candidates.length < 1) {
            return null
        }

        return candidates[0]
    }

    @ThrowsUserServiceError
    public static async update(user: User, change: UpdateUserData): Promise<User> {
        const processedPass = change.password ? await bcrypt.hash(change.password, 10) : undefined
        const updatedChange: UpdateUserData = { ...change, password: processedPass }
        const res = await db.update(usersTable).set(updatedChange).where(eq(usersTable.id, user.id)).returning()
        return res[0]
    }
}
