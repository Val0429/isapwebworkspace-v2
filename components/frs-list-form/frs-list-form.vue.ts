import { EFormQuick, IFormQuick } from '@/../components/form/helpers/form-quick';
import { Vue, Component, Prop, Model } from 'vue-property-decorator';
import { toEnumInterface } from '@/../core';
// Custom
import { EUserRole } from '@/services/Role';

// Service
import Dialog from '@/services/Dialog';
import RoleService from '@/services/Role/RoleService';
import ResponseFilter from '@/services/ResponseFilter';
import Loading from '@/services/Loading';
import RegexServices from '@/services/RegexServices';

@Component
export class FrsListForm extends Vue implements IFormQuick {
    path: string = '/client/frs';
    tView: string = "_('w_Frs_FrList')";
    tAdd: string = "_('w_Frs_AddFr')";
    tPreview?: string = "_('w_Frs_ViewFr')";
    tEdit?: string = "_('w_Frs_EditFr')";
    canAdd?: boolean = true;
    canPreview?: boolean = true;
    canEdit?: boolean = true;
    canDelete?: boolean = true;

    @Prop()
    params: any;

    inf(type: EFormQuick): string {
        switch (type) {
            case EFormQuick.View:
                return `
                    interface {                        
                        /**
                         * @uiLabel - ${this._('w_No')}
                         * @uiType - iv-cell-auto-index
                         */
                        no: string;

                        /**
                         * @uiLabel - ${this._('w_Account_Account')}
                         */
                        username: string;

                        /**
                         * @uiLabel - ${this._('w_Frs_IPAddress')}
                         */
                        ip: string;

                        /**
                         * @uiLabel - ${this._('w_Frs_HTTPPort')}
                         */
                        port: string;

                        /**
                         * @uiLabel - ${this._('w_Frs_Device_Name')}
                         */
                        deviceName: string;

                        /**
                         * @uiLabel - ${this._('w_Frs_Position')}
                         */
                        devicePostion: string;

                        /**
                         * @uiLabel - ${this._('w_Frs_Status')}
                         */
                        status?: string;

                        /**
                         * @uiLabel - ${this._('w_Frs_Endpoint')}
                         */
                        endpointName?: string;
                    }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
            case EFormQuick.Preview:
                return `
                    interface {
                        /**
                         * @uiLabel - ${this._('w_Account_Account')}
                         * @uiType - iv-form-string
                         */
                        username: string;

                        /**
                         * @uiLabel - ${this._('w_Account_Password')}
                         * @uiType - iv-form-password
                         * @uiHidden - ${type !== EFormQuick.Add}
                         * @uiRequired - true
                         * @uiColumnGroup - password
                         */
                        password?: string;

                        /**
                         * @uiLabel - ${this._('w_Account_ConfirmPassword')}
                         * @uiType - iv-form-password
                         * @uiHidden - ${type !== EFormQuick.Add}
                         * @uiRequired - true
                         * @uiValidation - (value, all) => value === all.password
                         * @uiColumnGroup - password
                         */
                        confirmPassword?: string;

                        /**
                         * @uiLabel - ${this._('w_Frs_IPAddress')}
                         * @uiPlaceHolder - ${this._('w_Frs_IPAddress')}
                         * @uiType - iv-form-ip
                         */
                        ip: string;

                        /**
                         * @uiLabel - ${this._('w_Frs_HTTPPort')}
                         * @uiPlaceHolder - ${this._('w_Frs_HTTPPort')}
                         * @uiAttrs - { max: 65535, min: 1}
                         */
                        port: string;

                        /**
                         * @uiLabel - ${this._('w_Frs_Device_Name')}
                         * @uiType - iv-form-string
                         */
                        deviceName: string;

                        /**
                         * @uiLabel - ${this._('w_Frs_Position')}
                         * @uiType - iv-form-string
                         */
                        devicePostion: string;

                        /**
                         * @uiLabel - ${this._('w_Frs_Status')}
                         * @uiHidden - ${type !== EFormQuick.Preview}
                         */
                        status?: string;

                        /**
                         * @uiLabel - ${this._('w_Frs_Endpoint')}
                         * @uiType - iv-form-string
                         */
                        endpointName?: string;
                    }
                `;
        }
    }
    postAdd(row: any) {
        row = { datas: [row] };
        return row;
    }

    // prePreview(row: any) {
    //     row = { ...row, role: row.role, company: row.company.name, floors: row.floors.map((v) => v.name).join(', ') };
    //     return row;
    // }
    // preEdit?(row: any) {
    // }
    postEdit?(row: any) {
        row = { datas: [row] };
        return row;
    }
}
export default FrsListForm;
