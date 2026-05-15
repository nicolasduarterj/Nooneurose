import Chat from "@src/models/common/Chat";
import User from "@src/models/common/User"
import Character from "@src/models/common/Character"

export default interface IChatService {
    create(owner: User, character: Character): Promise<Chat>
    getChatsByUser(user: User): Promise<Chat[]>
    getChatById(id: number): Promise<Chat | null>
}
