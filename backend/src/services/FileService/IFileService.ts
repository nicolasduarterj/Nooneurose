export default interface IFileService {
    store(file: File): Promise<void>
    retrieve(filename: string): Promise<File | null>
}
