import { ERuleMode, EEqualMode, EAndMode, EThresholdMode } from '@/components/RuleAndActions';

export class RuleActionsService {
    ruleModeText(vue: any, ruleMode: ERuleMode): string {
        let result: string = '';
        switch (ruleMode) {
            case ERuleMode.trafficSingleSiteToday:
                result = vue._('w_RuleAndActions_RuleStatusTrafficSingleToday');
                break;
            case ERuleMode.trafficSingleSiteCurrent:
                result = vue._('w_RuleAndActions_RuleStatusTrafficSingleCurrent');
                break;
            case ERuleMode.trafficMultipleSiteToday:
                result = vue._('w_RuleAndActions_RuleStatusTrafficMultipleToday');
                break;
            case ERuleMode.trafficMultipleSiteCurrent:
                result = vue._('w_RuleAndActions_RuleStatusTrafficMultipleCurrent');
                break;
            case ERuleMode.occupancySingleSite:
                result = vue._('w_RuleAndActions_RuleStatusOccupancySingleSite');
                break;
            case ERuleMode.occupancyMultipleSite:
                result = vue._('w_RuleAndActions_RuleStatusOccupancyMultipleSite');
                break;
            case ERuleMode.vipVip:
                result = vue._('w_RuleAndActions_RuleStatusVip');
                break;
            case ERuleMode.vipBlacklist:
                result = vue._('w_RuleAndActions_RuleStatusBlacklist');
                break;
        }
        return result;
    }

    equalModeText(vue: any, equalMode: EEqualMode): string {
        let result: string = '';
        switch (equalMode) {
            case EEqualMode.more:
                result = vue._('w_RuleAndActions_EqualStatusMore');
                break;
            case EEqualMode.moreEqual:
                result = vue._('w_RuleAndActions_EqualStatusMoreEqual');
                break;
            case EEqualMode.equal:
                result = vue._('w_RuleAndActions_EqualStatusEqual');
                break;
            case EEqualMode.less:
                result = vue._('w_RuleAndActions_EqualStatusLess');
                break;
            case EEqualMode.lessEqual:
                result = vue._('w_RuleAndActions_EqualStatusLessEqual');
                break;
        }
        return result;
    }

    andModeText(vue: any, andMode: EAndMode): string {
        let result: string = '';
        switch (andMode) {
            case EAndMode.and:
                result = vue._('w_RuleAndActions_AndStatusAnd');
                break;
            case EAndMode.or:
                result = vue._('w_RuleAndActions_AndStatusOr');
                break;
        }
        return result;
    }

    thresholdModeText(vue: any, thresholdMode: EThresholdMode): string {
        let result: string = '';
        switch (thresholdMode) {
            case EThresholdMode.high:
                result = vue._('w_RuleAndActions_ThresholdStatusHigh');
                break;
            case EThresholdMode.medium:
                result = vue._('w_RuleAndActions_ThresholdStatusMedium');
                break;
            case EThresholdMode.low:
                result = vue._('w_RuleAndActions_ThresholdStatusLow');
                break;
        }
        return result;
    }
}

export default new RuleActionsService();
