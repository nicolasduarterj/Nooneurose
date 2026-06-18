import db from "@src/db/db";
import { reportsTable } from "@src/db/schema";
import Character from "@src/models/common/Character";
import Report from "@src/models/common/Report";
import { eq } from "drizzle-orm";

export default abstract class MainReportService {
    public static async create(character: Character, motive: string): Promise<Report> {
        const res = await db.insert(reportsTable).values({
            character: character.id,
            motive
        }).returning()

        return res[0]
    }

    public static async getAll(): Promise<Report[]> {
        const res = await db.select().from(reportsTable)
        return res
    }

    public static async delete(report: Report): Promise<void> {
        await db.delete(reportsTable).where(eq(reportsTable.id, report.id))
    }
}
