import Datetime from '@/services/Datetime';
import Dialog from '@/services/Dialog';

class RegistrationServices {
    checkWorkDate(vue: any, inputFormData: any) {
        let nowDate = new Date();

        if (nowDate.getTime() > inputFormData.workStartDate.getTime() || nowDate.getTime() > inputFormData.workEndDate.getTime()) {
            Dialog.error(vue._('w_Invitation_ErrorWorkDateEarlierToday'));
            return false;
        }

        if (!Datetime.checkDateStartToEnd(inputFormData.workStartDate, inputFormData.workEndDate)) {
            Dialog.error(vue._('w_Invitation_ErrorEndDateGreater'));
            return false;
        }

        if (Datetime.DateStart(inputFormData.workStartDate).getTime() < Datetime.DateEnd(inputFormData.workEndDate).getTime() - Datetime.oneDayTimestamp * 31) {
            Dialog.error(vue._('w_Invitation_ErrorDateLower31Day'));
            return false;
        }

        // if (
        //     !Datetime.checkTimeStartToEnd(
        //         inputFormData.workStartTime,
        //         inputFormData.workEndTime
        //     )
        // ) {
        //     Dialog.error(vue._("w_Invitation_ErrorEndTimeGreater"));
        //     return false;
        // }

        return true;
    }
}

export default new RegistrationServices();
