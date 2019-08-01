import { ERuleMode, EEqualMode, EAndMode } from '@/components/RuleAndActions';

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
}

export default new RuleActionsService();
