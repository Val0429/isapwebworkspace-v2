import { EAgeRange, EWeeks, EWeek } from '../';
import { ITemplateItem, IReportToTemplateItem } from '../';

class ReportService {
    datetimeFormat: {
        date: string;
        hour: string;
    } = {
        date: 'YYYY/MM/DD',
        hour: 'YYYY/MM/DD HH',
    };

    analysisTemplate(json: string): ITemplateItem | null {
        let result: ITemplateItem | null = null;
        try {
            let tempTemplate = JSON.parse(json);
            if (tempTemplate.objectId == undefined || tempTemplate.mode == undefined) {
                return result;
            }

            result = {
                objectId: tempTemplate.objectId,
                mode: tempTemplate.mode,
            };

            if (tempTemplate.name != undefined) {
                result.name = tempTemplate.name;
            }

            if (tempTemplate.type != undefined) {
                result.type = tempTemplate.type;
            }

            if (tempTemplate.startDate != undefined && !isNaN(new Date(tempTemplate.startDate).getTime())) {
                result.startDateString = tempTemplate.startDate;
                result.startDate = new Date(tempTemplate.startDate);
            }

            if (tempTemplate.endDate != undefined && !isNaN(new Date(tempTemplate.endDate).getTime())) {
                result.endDateString = tempTemplate.endDate;
                result.endDate = new Date(tempTemplate.endDate);
            }

            if (tempTemplate.sites != undefined && tempTemplate.sites.length > 0) {
                result.sites = tempTemplate.sites;
            }
            if (tempTemplate.tags != undefined && tempTemplate.tags.length > 0) {
                result.tags = tempTemplate.tags;
            }
            if (tempTemplate.sendDates != undefined && tempTemplate.sendDates.length > 0) {
                result.sendDates = tempTemplate.sendDates;
            }
            if (tempTemplate.sendUsers != undefined && tempTemplate.sendDates.length > 0) {
                result.sendDates = tempTemplate.sendDates;
            }
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

    showWeek(data: number): string {
        switch (data) {
            case 1:
                return EWeek.Mon;
            case 2:
                return EWeek.Tue;
            case 3:
                return EWeek.Wed;
            case 4:
                return EWeek.Thu;
            case 5:
                return EWeek.Fri;
            case 6:
                return EWeek.Sat;
            case 0:
                return EWeek.Sun;
        }
    }

    countRatio(value: number, prevValue: number): number {
        if (value == undefined) {
            return 0;
        }
        if (prevValue == undefined) {
            return 0;
        }
        if (value == null) {
            return 0;
        }
        if (prevValue == null) {
            return 0;
        }

        if (isNaN(value)) {
            return 0;
        }
        if (isNaN(prevValue)) {
            return 0;
        }
        if (value == 0) {
            return 0;
        }
        if (prevValue == 0) {
            return 0;
        }
        return value / prevValue - 1;
    }

    FormatNumber(str: string): string {
        return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    resolveUserSite(vue: any, response: any) {
        let tempTree = {};
        let tempChildrenArray = [];
        tempTree = response;
        if (vue.$user.user.allowSites.length > 0) {
            vue.$user.user.allowSites.map((site) => {
                if (response.childrens.length > 0) {
                    response.childrens.map((item) => {
                        if (item.objectId === site.objectId) {
                            let tempTreeData = JSON.parse(JSON.stringify(tempTree));
                            tempTreeData.childrens = [];
                            tempChildrenArray.push(item);
                            tempTreeData.childrens = tempChildrenArray;
                            tempTree = tempTreeData;
                        }
                    });
                }
            });
        }
        return tempTree;
    }
}

export default new ReportService();
