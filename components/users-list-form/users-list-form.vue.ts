import { EFormQuick, IFormQuick } from '@/../components/form/helpers/form-quick';
import { Vue, Component, Prop, Model } from 'vue-property-decorator';
import { toEnumInterface } from '@/../core';

@Component
export class UsersListForm extends Vue implements IFormQuick {
    path: string = '/users';
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
                    data['firstname']: string;
                    /*
                     * @uiLabel - ${this._('w_User') + this._('w_Group')}
                     */
                    data: string;
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
                    firstname: string;
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
                     * @uiValidation - (value, all) => value === all.password
                     * @uiInvalidMessage - ${this._('m_Warn_Password')}
                     */
                    comfirmPassword: string;
                    /*
                     * @uiLabel - ${this._('w_Email')}
                     */
                    publicEmailAddress?: string;
                        /*
                        * @uiLabel - ${this._('w_User') + this._('w_Group')}
                        * @uiAttrs - { data: { "always-array": true} }
                        */
                    groups: ${toEnumInterface(this.groupList)};
                    /*
                     * @uiLabel - ${this._('w_User') + this._('w_Role')}
                     * @uiHidden - ${type === EFormQuick.Add ? true : false}
                     * @uiDisabled - ${type === EFormQuick.Edit ? true : false}
                     * @uiAttrs - { data: { "always-array": true} }
                     */
                    roles: ${toEnumInterface(this.groupList)};

                }
                `;
        }
    }
    postAdd(row: any) {
        row = { ...row, username: this.$user.user.username, data: { firstname: row.firstname, groups: row.groups }, roles: row.groups };
        return row;
    }
    // prePreview?(row: any) {
    // throw new Error("Method not implemented.");
    // }

    preEdit?(row: any) {
        row = { ...row, groups: row.data.groups.map((v) => v.name), firstname: row.data.firstname, roles: row.roles.map((v) => v.name) };
        console.log('row', row);
        return row;
    }
    postEdit?(row: any) {
        row = { ...row, username: this.$user.user.username, data: { firstname: row.firstname, groups: row.groups }, roles: row.groups };
        console.log(row);
        return row;
    }

    private groupList: any = {};
    private async doMounted() {
        let data: any = await this.$server.R('/roles');
        this.groupList = data.reduce((final, value) => {
            final[value] = value;
            return final;
        }, {});
    }
}
export default UsersListForm;
