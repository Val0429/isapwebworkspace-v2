import Datetime from '@/services/Datetime';
import Dialog from '@/services/Dialog';

class RegistrationServices {
    // 1. 不能早於今天
    // 2. form date <= to date
    // 3. if from date == to date, from time < to time
    // 4. 天數差小於 31 天
    checkWorkDate(vue: any, inputFormData: any, checkEarlyTody = true) {
        let nowDate = new Date();

        if (inputFormData.workStartDate == undefined) {
            return true;
        }

        if (inputFormData.workEndDate == undefined) {
            return true;
        }

        // 不能早於今天
        if (checkEarlyTody && (nowDate.getTime() > inputFormData.workStartDate.getTime() || nowDate.getTime() > inputFormData.workEndDate.getTime())) {
            Dialog.error(vue._('w_Invitation_ErrorWorkDateEarlierToday'));
            return false;
        }

        // form date <= to date, if from date == to date, from time < to time
        if (Datetime.mergeDateTime(inputFormData.workStartDate, inputFormData.workStartTime).getTime() > Datetime.mergeDateTime(inputFormData.workEndDate, inputFormData.workEndTime).getTime()) {
            Dialog.error(vue._('w_Invitation_ErrorEndDateGreater'));
            return false;
        }

        // 天數差小於 31 天
        if (Datetime.DateStart(inputFormData.workStartDate).getTime() < Datetime.DateEnd(inputFormData.workEndDate).getTime() - Datetime.oneDayTimestamp * 31) {
            Dialog.error(vue._('w_Invitation_ErrorDateLower31Day'));
            return false;
        }

        return true;
    }
}

export default new RegistrationServices();
