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
export class AccountListForm extends Vue implements IFormQuick {
    path: string = '/user/web';
    tView: string = "_('w_Account_AccountList')";
    tAdd: string = "_('w_Account_AddUser')";
    tPreview?: string = "_('w_Account_ViewUser')";
    tEdit?: string = "_('w_Account_EditUser')";
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
                         * @uiLabel - ${this._('w_Account_UserName')}
                         */
                        name: string;

                        /**
                         * @uiLabel - ${this._('w_Account_Roles')}
                         */
                        role: string;

                        /**
                         * @uiLabel - ${this._('w_Account_FloorName')}
                         */
                        floors: string;

                        /**
                         * @uiLabel - ${this._('w_Account_CompanyName')}
                         */
                        company: string;

                        /**
                         * @uiLabel - ${this._('w_Account_Email')}
                         */
                        email: string;
                    }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
            case EFormQuick.Preview:
                return `
                    interface {
                        /**
                         * @uiLabel - ${this._('w_Account_Account')}
                         * @uiType - ${type === EFormQuick.Add ? 'iv-form-string' : ''}
                         * @uiDisabled - ${type !== EFormQuick.Add}
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
                         * @uiLabel - ${this._('w_Account_Roles')}
                         * @uiDisabled - ${type !== EFormQuick.Add}
                         */
                        role: ${type !== EFormQuick.Add ? 'string' : toEnumInterface(this.selectItem.role, false)};

                        /**
                         * @uiLabel - ${this._('w_Account_CompanyName')}
                         * @uiHidden - ${type == EFormQuick.Add && !this.selectedRole}
                         * @uiDisabled - ${type !== EFormQuick.Add}
                         */
                        company: ${type !== EFormQuick.Add ? 'string' : toEnumInterface(this.selectItem.company, false)};

                        /**
                         * @uiLabel - ${this._('w_Account_FloorName')}
                         * @uiHidden - ${type !== EFormQuick.Preview}
                         * @uiDisabled - ${type === EFormQuick.Preview}
                         */
                        floorsText?: ${type == EFormQuick.Preview ? 'string' : toEnumInterface(this.selectItem.floors, true)};

                        /**
                         * @uiLabel - ${this._('w_Account_FloorName')}
                         * @uiHidden - ${type === EFormQuick.Preview || !this.selectedRole}
                         */
                        floors: ${toEnumInterface(this.selectItem.floors, true)};

                        /**
                         * @uiLabel - ${this._('w_Account_UserName')}
                         * @uiType - iv-form-string
                         * @uiDisabled - ${type === EFormQuick.Preview}
                         */
                        name: string;

                        /**
                         * @uiLabel - ${this._('w_Account_UserTitles')}
                         * @uiDisabled - ${type === EFormQuick.Preview}
                         */
                        titles?: string;

                        /**
                         * @uiLabel - ${this._('w_Account_Phone')}
                         * @uiValidation - ${RegexServices.regexItem.phoneNumber}
                         * @uiDisabled - ${type === EFormQuick.Preview}
                         */
                        phone?: string;

                        /**
                         * @uiLabel - ${this._('w_Account_Email')}
                         * @uiValidation - ${RegexServices.regexItem.email}
                         * @uiInvalidMessage - ${this._('w_Error_Email')}
                         * @uiDisabled - ${type === EFormQuick.Preview}
                         */
                        email: string;

                        /**
                         * @uiLabel - Remark
                         * @uiType - iv-form-textarea
                         * @uiDisabled - ${type === EFormQuick.Preview}
                         */
                        remark?: string;
                    }
                `;
        }
    }
    postAdd(row: any) {
        row = { datas: [{ ...row, companyId: row.company, floorIds: row.floors }] };
        return row;
    }
    prePreview(row: any) {
        row = { ...row, role: row.role, company: row.company.name, floorsText: row.floors.map((v) => v.name).join(', '), floors: row.floors.map((v) => v.name) };
        return row;
    }
    postEdit?(row: any) {
        row = { datas: [{ ...row, floorIds: row.floors }] };
        return row;
    }

    selectedRole: boolean = false;
    selectItem: {
        role: any;
        company: any;
        floors: any;
    } = {
        role: {},
        company: {},
        floors: {},
    };
    companiesData: any = {};
    private async doMounted() {
        this.initSelectItemRole();
        this.initSelectItemCompanyWithAPI();
    }

    updateData(datas: any) {
        if (datas.key == 'role') {
            this.selectedRole = true;
        }
        if (datas.key == 'company') {
            this.initSelectItemFloorWithCompany(datas.value);
        }
    }

    initSelectItemRole() {
        this.selectItem.role = {};
        let settingRole = {
            SystemAdministrator: false,
            Administrator: false,
            TenantAdministrator: false,
        };

        // check role can setting
        if (RoleService.haveSystemAdministrator(this)) {
            settingRole.Administrator = true;
        }

        if (RoleService.haveAdministrator(this)) {
            settingRole.TenantAdministrator = true;
        }

        // set setting
        if (settingRole.SystemAdministrator) {
            this.selectItem.role[EUserRole.SystemAdministrator] = this._('w_Role_SystemAdministrator');
        }
        if (settingRole.Administrator) {
            this.selectItem.role[EUserRole.Administrator] = this._('w_Role_Administrator');
        }
        if (settingRole.TenantAdministrator) {
            this.selectItem.role[EUserRole.TenantAdministrator] = this._('w_Role_TenantAdministrator');
        }
    }
    async initSelectItemCompanyWithAPI() {
        let param: any = { paging: { all: true } };

        param = RegexServices.trim(param);
        await this.$server
            .R('/location/company', param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (response.results != undefined && response.results.length > 0) {
                        this.companiesData = JSON.parse(JSON.stringify(response.results));
                        for (let ret of response.results) {
                            if (ret.objectId != undefined && ret.name != undefined) {
                                this.$set(this.selectItem.company, ret.objectId, ret.name);
                            }
                        }
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }
    async initSelectItemFloorWithCompany(companyId: string) {
        this.selectItem.floors = {};
        for (let company of this.companiesData) {
            if (companyId == company.objectId) {
                for (let floor of company.floors) {
                    this.$set(this.selectItem.floors, floor.objectId, floor.name);
                }
                break;
            }
        }
    }
}
export default AccountListForm;
