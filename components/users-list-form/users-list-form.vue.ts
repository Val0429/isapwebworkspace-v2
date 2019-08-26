import { EFormQuick, IFormQuick } from '@/../components/form/helpers/form-quick';
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import { toEnumInterface } from '@/../core';

@Component
export class UsersListForm extends Vue implements IFormQuick {

    path: string = "/users";
    tView: string = "_('w_Users_User_List')";
    tAdd: string = "_('wb_Add')";
    tPreview?: string = "_('w_Preview')";
    tEdit?: string = "_('wb_Edit')";
    canAdd?: boolean = true;
    canPreview?: boolean = false;
    canEdit?: boolean = true;
    canDelete?: boolean = true;
    
    inf(type: EFormQuick): string {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {
                    /*
                     * @uiLabel - ${this._('w_User') + this._('w_Name')}
                     */
                    username: string;
                    /*
                     * @uiLabel - ${this._('w_User') + this._('w_Group')}
                     */
                    groups: string;
                    /*
                     * @uiLabel - ${this._('w_Email')}
                     */
                    publicEmailAddress: string;
                }
                `;
            case EFormQuick.Add:
                return `
                interface {
                    /*
                     * @uiLabel - ${this._('w_User') + this._('w_Name')}
                     */
                    username: string;
                    /*
                     * @uiLabel - ${this._('wb_Password')}
                     * @uiType - iv-form-password
                     */
                    password: string;
                    /*
                     * @uiLabel - ${this._('w_Confirm_Password')}
                     * @uiType - iv-form-password
                     */
                    comfirmPassword: string;
                    /*
                     * @uiLabel - ${this._('w_Email')}
                     */
                    publicEmailAddress?: string;
                    /*
                     * @uiLabel - ${this._('w_User') + this._('w_Group')}
                     */
                    groups1?: string;
                    /*
                     * @uiLabel - ${this._('w_User') + this._('w_Group')}
                     */
                    groups2: string;
                }
                `;
            case EFormQuick.Edit:
                    return `
                    interface {
                        /*
                         * @uiLabel - ${this._('w_User') + this._('w_Name')}
                         * @uiDisabled - true
                         */
                        username: string;
                        /*
                         * @uiLabel - ${this._('w_Email')}
                         */
                        publicEmailAddress?: string;
                        /*
                         * @uiLabel - ${this._('w_User') + this._('w_Group')}
                         */
                        groups1?: string;
                        /*
                         * @uiLabel - ${this._('w_User') + this._('w_Group')}
                         */
                        groups2: string;
                    }
                    `;
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

    private updateData(data) {
    }
}
export default UsersListForm;