import { EFormQuick, IFormQuick } from '@/../components/form/helpers/form-quick';
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import { toEnumInterface } from '@/../core';

@Component
export class UserGroupForm extends Vue implements IFormQuick {

    path: string = "/users/groups";
    tView: string = "_('m_Users_Group_List')";
    tAdd: string = "_('m_Users_Add_Group')";
    tPreview?: string = "";
    tEdit?: string = "_('wb_Edit')";
    canAdd?: boolean = true;
    canPreview?: boolean = false;
    canEdit?: boolean = true;
    canDelete?: boolean = true;
    
    inf(type: EFormQuick): string {
        switch (type) {
            case EFormQuick.View:
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    /*
                     * @uiLabel - ${this._('w_Group') + this._('w_Title')}
                     */
                    groupname: string;
                }`;
        }
    }
    // preAdd() {
    //     return {
    //         title: "Default title"
    //     }
    // }
    // postAdd(row: any) {
    //     row.service = "-";
    //     row.serviceType = "-";
    //     row.description = "-";
    //     return row;
    // }
    // prePreview?(row: any) {
        // throw new Error("Method not implemented.");
    // }
    // preEdit?(row: any) {
    //     throw new Error("Method not implemented.");
    // }
    // postEdit?(row: any) {
    //     throw new Error("Method not implemented.");
    // }
}
export default UserGroupForm;