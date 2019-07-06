class ReportService {

    CheckObjectIfEmpty(obj: object): boolean {
        const result = Object.keys(obj);
        return result.length === 0;
    }

    CheckObjectLength(obj: object): number {
        const result = Object.keys(obj);
        return result.length;
    }


}

export default new ReportService();
