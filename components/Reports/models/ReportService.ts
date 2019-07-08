import { EAgeRange } from '@/components/Reports';

class ReportService {
    anysislyTemplate(json: string): object | null {
        let result = null;
        try {
            result = JSON.parse(json);
        } catch (e) {
            console.log(e);
        }
        return result;
    }

    CheckObjectIfEmpty(obj: object): boolean {
        const result = Object.keys(obj);
        return result.length === 0;
    }

    CheckObjectLength(obj: object): number {
        const result = Object.keys(obj);
        return result.length;
    }

    SwitchAgeRange(index) {
        switch (index) {
            case '0':
                return EAgeRange.lower20;
            case '1':
                return EAgeRange.m21_30;
            case '2':
                return EAgeRange.m31_40;
            case '3':
                return EAgeRange.m41_50;
            case '4':
                return EAgeRange.m51_60;
            case '5':
                return EAgeRange.upper61;
            default:
                return EAgeRange.none;
        }
    }
}

export default new ReportService();
