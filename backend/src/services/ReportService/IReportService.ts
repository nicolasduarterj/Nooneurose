import Character from "@src/models/common/Character";
import Report from "@src/models/common/Report";

export default interface IReportService {
    create(character: Character, motive: string): Promise<Report>
    getAll(): Promise<Report[]>
    delete(report: Report): Promise<void>
}
