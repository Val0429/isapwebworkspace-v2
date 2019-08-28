import { EFormQuick, IFormQuick } from '@/../components/form/helpers/form-quick';
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import { toEnumInterface } from '@/../core';

@Component
export class UsersListForm extends Vue implements IFormQuick {

    path: string = "/users";
    tView: string = "_('m_Users_User_List')";
    tAdd: string = "_('m_Users_Add_User')";
    tPreview?: string = "_('w_Preview')";
    tEdit?: string = "_('m_Users_Edit_User')";
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
                    roles: string;
                    /*
                     * @uiLabel - ${this._('w_Email')}
                     */
                    publicEmailAddress: string;
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    /*
                     * @uiLabel - ${this._('w_User') + this._('w_Name')}
                     * @uiDisabled - ${type === EFormQuick.Edit ? true : false}
                     */
                    username: string;
                    /*
                     * @uiLabel - ${this._('wb_Password')}
                     * @uiType - iv-form-password
                     * @uiColumnGroup - pwdGroup
                     * @uiHidden - ${type === EFormQuick.Edit ? true : false}
                     */
                    password: string;
                    /*
                     * @uiLabel - ${this._('w_Confirm_Password')}
                     * @uiType - iv-form-password
                     * @uiColumnGroup - pwdGroup
                     * @uiHidden - ${type === EFormQuick.Edit ? true : false}
                     */
                    comfirmPassword: string;
                    /*
                     * @uiLabel - ${this._('w_Email')}
                     */
                    publicEmailAddress?: string;
                    /*
                     * @uiLabel - ${this._('w_User') + this._('w_Group')}
                     */
                    roles: ${
                        toEnumInterface(this.groupList)
                    };
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

    preEdit?(row: any) {
        row = { ...row, roles: row.roles[0].name };
        return row;
    }
    postEdit?(row: any) {
        row = { ...row, roles: [row.roles] };
        return row;
    } 

    // preEdit?(row: any) {
    //     throw new Error("Method not implemented.");
    // }
    // postEdit?(row: any) {
    //     throw new Error("Method not implemented.");
    // }

    private groupList: any = {};
    private updateData(data) {
        console.log('data')
        console.log(data)
    }
    private async doMounted() {
        let data: any = await this.$server.R('/roles');
        //this.groupList = {...data}
        this.groupList = data.reduce( (final, value) => {
            final[value] = value;
            return final;
        }, {});
        console.log('grouplist', this.groupList);
    }
}
export default UsersListForm;