import User from "@src/models/common/User"

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}
