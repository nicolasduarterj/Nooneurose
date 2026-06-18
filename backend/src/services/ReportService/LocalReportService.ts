import Character from "@src/models/common/Character";
import Report from "@src/models/common/Report";

export default abstract class LocalReportService {
    private static reportRepository: Report[] = []
    private static nextId = 1

    // eslint-disable-next-line @typescript-eslint/require-await
    public static async create(character: Character, motive: string): Promise<Report> {
        const newReport: Report = {
            id: this.nextId++,
            character: character.id,
            motive
        }

        this.reportRepository.push(newReport)
        return newReport
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public static async getAll(): Promise<Report[]> {
        return this.reportRepository
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public static async delete(report: Report): Promise<void> {
        this.reportRepository = this.reportRepository.filter(rpt => rpt.id !== report.id)
    }
}
