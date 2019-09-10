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

    @Prop()
    params: any;

    inf(type: EFormQuick): string {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {
                    data: interface {
                        /*
                        * @uiLabel - ${this._('w_User') + this._('w_Name')}
                        */
                        firstname: string;
                    };

                    /*
                    * @uiLabel - ${this._('w_User') + this._('w_Title')}
                    * @uiDisabled - true
                    */
                    username: string;

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
                     * @uiValidation - (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                     * @uiInvalidMessage - ${this._('m_Warn_Email')}
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
                    roles: ${toEnumInterface(this.roleList)};
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
        return row;
    }
    postEdit?(row: any) {
        row = { ...row, username: this.$user.user.username, data: { firstname: row.firstname, groups: row.groups }, roles: row.groups };
        return row;
    }

    private roleList: any = {};
    private groupList: any = {};
    private async doMounted() {
        let rolesData: any = await this.$server.R('/roles');
        let groupsData: any = await this.$server.R('/users/groups');
        this.roleList = rolesData.reduce((final, value) => {
            final[value] = value;
            return final;
        }, {});
        this.groupList = groupsData.results
            .map((value) => {
                return value.name;
            })
            .filter((value) => {
                if (value !== undefined) {
                    return value;
                }
            })
            .reduce((final, value) => {
                final[value] = value;
                return final;
            }, {});
    }
}
export default UsersListForm;
