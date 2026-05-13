export default interface Character {
    id: number
    name: string
    description: string
    isGloballyChangeable: boolean
    isPrivatelyChangeable: boolean
    ownerId: number
    imageURL: string | null
}
