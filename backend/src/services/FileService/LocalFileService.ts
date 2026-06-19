import EnvVars from '@src/common/constants/env'
import fs from 'node:fs/promises'

export default abstract class LocalFileService {
    public static async store(file: File): Promise<void> {
        const arrBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrBuffer)
        await fs.writeFile(`${EnvVars.StorageDir}/${file.name}`, buffer)
    }

    public static async retrieve(filename: string): Promise<File | null> {
        try {
            const buffer = await fs.readFile(`${EnvVars.StorageDir}/${filename}`)
            return new File([buffer], filename)
        } catch (_error) {
            return null
        }
    }
}
