import { EFormQuick, IFormQuick } from '@/../components/form/helpers/form-quick';
import { Vue, Component, Prop, Model } from 'vue-property-decorator';
import { toEnumInterface } from '@/../core';
// Custom
import { EUserRole } from '@/services/Role';

// Service
import ImageBase64 from '@/services/ImageBase64';

@Component
export class BlacklistForm extends Vue implements IFormQuick {
    path: string = '/person/staff-blacklist';
    tView: string = "_('w_Blacklist_Blacklist')";
    tAdd: string = "_('w_Blacklist_AddBlack')";
    tPreview?: string = "_('w_Blacklist_ViewBlack')";
    tEdit?: string = "_('w_Blacklist_EditBlack')";
    canAdd?: boolean = true;
    canPreview?: boolean = false;
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
                 * @uiLabel - ${this._('w_Blacklist_Image')}
                 */
                imageBase64?: string;

                /**
                 * @uiLabel - ${this._('w_Blacklist_NRIC')}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._('w_Blacklist_NRIC')}
                 */
                nric: string;

                /**
                 * @uiLabel - ${this._('w_Blacklist_Company')}
                 */
                organization: any;

                /**
                 * @uiLabel - ${this._('w_Blacklist_Reason')}
                 */
                remark: string;
                    }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
            case EFormQuick.Preview:
                return `
                    interface {                        
                        /**
                 * @uiLabel - ${this._('w_Blacklist_Image')}
                 * @uiType - iv-form-file
                 */
                imageBase64?: string;

                /**
                 * @uiLabel - ${this._('w_Blacklist_Name')}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._('w_Blacklist_NRIC')}
                 */
                nric: string;

                /**
                 * @uiLabel - ${this._('w_Blacklist_Company')}
                 */
                organization?: any;

                /**
                 * @uiLabel - ${this._('w_Blacklist_Reason')}
                 */
                remark: string;
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
    imgToBase64(datas) {
        ImageBase64.fileToBase64(datas, this.getBase);
    }
    getBase() {}
}
export default BlacklistForm;
