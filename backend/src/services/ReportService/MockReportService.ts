/* eslint-disable */
import Character from "@src/models/common/Character";
import Report from "@src/models/common/Report";

export default abstract class MockReportService {
    private static mockReport: Report = { id: 1, character: 1, motive: 'Motivo' }

    public static async create(character: Character, motive: string): Promise<Report> {
        return this.mockReport
    }

    public static async getAll(): Promise<Report[]> {
        return [this.mockReport]
    }

    public static async delete(report: Report): Promise<void> {}
}
