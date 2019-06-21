<template>
    <div class="animated fadeIn">
        <iv-card
            v-show="pageStep === ePageStep.list"
            :label="_('w_Member_List')"
        >
            <template #toolbox>
                <iv-toolbox-add @click="pageToAdd()" />
            </template>

            <iv-table
                ref="listTable"
                :interface="ITableList()"
                :multiple="tableMultiple"
                :server="{ path: '/acs/member' }"
                @selected="selectedItem($event)"
            >

                <template #CardNumber="{$attrs}">
                    {{ anysisTableColumn($attrs.row, "CardNumber") }}
                </template>

                <template #StartDate="{$attrs}">
                    {{ dateToYYYY_MM_DD($attrs.value) }}
                </template>

                <template #EndDate="{$attrs}">
                    {{ dateToYYYY_MM_DD($attrs.value) }}
                </template>

                <template #Department="{$attrs}">
                    {{ anysisTableColumn($attrs.row, "Department") }}
                </template>

                <template #CostCenter="{$attrs}">
                    {{ anysisTableColumn($attrs.row, "CostCenter") }}
                </template>

                <template #Actions="{$attrs, $listeners}">

                    <iv-toolbox-more
                        size="sm"
                        :disabled="isSelected.length !== 1"
                    >
                        <iv-toolbox-view @click="pageToView" />
                        <iv-toolbox-edit @click="pageToEdit(ePageStep.edit)" />
                        <iv-toolbox-delete @click="doDelete" />
                    </iv-toolbox-more>
                </template>

            </iv-table>
        </iv-card>

        <!-- add -->
        <iv-auto-card
            v-show="pageStep === ePageStep.add"
            :visible="true"
            :label="pageStep === ePageStep.add ? _('w_Member_Add') :  _('w_Member_Edit')"
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList()" />
            </template>

            <iv-form
                :interface="IAddAndEditForm()"
                :value="inputFormData"
                @update:*="tempSaveInputData($event)"
                @submit="saveAddOrEdit($event)"
            >

                <!-- Morris -->
                <template #premissionList>
                    <iv-sort-select
                        v-if="premissionOptions.length > 0"
                        v-model="inputFormData.premissionSelected"
                        class="col-md-12"
                        :options="premissionOptions"
                    ></iv-sort-select>
                </template>

                <template #tabItem>

                    <iv-tab
                        class="col-md-12"
                        ref="tab"
                        :active="1"
                        @mounted="doTabMount"
                    >

                        <template #1-title>{{ _('w_Member_PersonInfo') }}</template>
                        <template #1>
                            <iv-form
                                :interface="ITabForm1()"
                                :value="inputFormData"
                            >
                            </iv-form>
                        </template>

                        <template #2-title>{{ _('w_Member_General') }}</template>
                        <template #2>
                            <iv-form
                                :interface="ITabForm2()"
                                :value="inputFormData"
                            >
                            </iv-form>
                        </template>

                        <template #3-title>{{ _('w_Member_CardRecord') }}</template>
                        <template #3>
                            <iv-form
                                :interface="ITabForm3()"
                                :value="inputFormData"
                            >
                            </iv-form>
                        </template>

                        <template #4-title>{{ _('w_Member_Other') }}</template>
                        <template #4>
                            <iv-form
                                :interface="ITabForm4()"
                                :value="inputFormData"
                            >
                            </iv-form>
                        </template>

                    </iv-tab>

                </template>

                <!-- Morris -->

                <template #test="{ $attrs, $listeners }">
                    <div class="mt-2 ml-3 mb-3">
                        <b-button @click="pageToEmailTest($event)">{{ _('w_User_TestEmail') }}
                        </b-button>
                    </div>
                </template>

            </iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToList()"
                >{{ _('w_Back') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- view -->
        <iv-auto-card
            v-show="pageStep === ePageStep.view"
            :visible="true"
            :label="_('w_User_ViewUser') "
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList()" />
            </template>

            <iv-form
                :interface="IViewForm()"
                :value="inputFormData"
            >

            </iv-form>

            <template #footer>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToList()"
                >{{ _('w_Back') }}
                </b-button>
            </template>

        </iv-auto-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import ResponseFilter from "@/services/ResponseFilter";
import { ToolboxBack } from "@/components/Toolbox/toolbox-back.vue";
import Dialog from "@/services/Dialog/Dialog";
import Datetime from "@/services/Datetime";

// Sort Select
import { ISortSelectOption } from "@/components/SortSelect";
import SortSelect from "@/components/SortSelect/SortSelect.vue";

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    none = "none"
}

@Component({
    components: {
        ToolboxBack,
        SortSelect
    }
})
export default class MemberForm1 extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

    isSelected: any = [];
    tableMultiple: boolean = true;

    selectedDetail: any = [];

    workGroupSelectItem: any = {};
    userGroupSelectItem: any = {};

    inputTestEmail: string = "";

    inputFormData: any = {};

    // Morris //
    premissionOptions: ISortSelectOption[] = [];
    tabMounted: boolean = false;
    doTabMount() {
        this.tabMounted = true;
    }
    // Morris //

    created() {
        // Morris //
        this.pageToAdd();
        // Morris //
    }

    mounted() {
        this.initSelectItemWorkGroup();
        this.initDepartment();
    }

    async initSelectItemWorkGroup() {
        this.workGroupSelectItem = {};

        await this.$server
            .R("/acs/workgroup")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response.results) {
                        // 自定義 sitesSelectItem 的 key 的方式
                        this.workGroupSelectItem[returnValue.objectId] =
                            returnValue.groupname;
                    }
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    async initDepartment() {
        await this.$server
            .R("/acs/member")
            .then((response: any) => {
                // console.log('returnValue - ', response.results.CustomFields);
                if (response != undefined) {
                    for (const returnValue of response.results.CustomFields) {
                        console.log("returnValue - ", returnValue);
                    }
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    clearInputData() {
        // Morris //
        this.premissionOptions = [];
        // Morris //

        this.inputFormData = {
            objectId: "",
            // Morris //
            premissionSelected: []
            // Morris //
        };
    }

    selectedItem(data) {
        console.log(data);
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    getInputData() {
        this.clearInputData();

        // for (const param of this.selectedDetail) {
        //     this.inputFormData = {
        //         objectId: param.objectId,
        //         employeeId: param.employeeId,
        //         username: param.username,
        //         role: param.role,
        //         name: param.name,
        //         email: param.email,
        //         phone: param.phone,
        //         siteIdsText: this.idsToText(param.sites),
        //         groupIdsText: this.idsToText(param.groups),
        //         siteIds: param.sites,
        //         groupIds: param.groups,
        //         type: ""
        //     };
        // }
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "account":
                this.inputFormData.username = data.value;
                break;
            case "password":
                this.inputFormData.password = data.value;
                break;
            case "confirmPassword":
                this.inputFormData.confirmPassword = data.value;
                break;
            case "employeeId":
                this.inputFormData.employeeId = data.value;
                break;
            case "name":
                this.inputFormData.name = data.value;
                break;
            case "email":
                this.inputFormData.email = data.value;
                break;
            case "phone":
                this.inputFormData.phone = data.value;
                break;
            case "siteIds":
                this.inputFormData.siteIds = data.value;
                break;
            case "groupIds":
                this.inputFormData.groupIds = data.value;
                break;
            case "role":
                this.inputFormData.role = data.value;
                break;
        }
    }

    async pageToAdd() {
        this.clearInputData();
        this.initSelectItemWorkGroup();

        // Morris //
        this.initPremission();
        // Morris //

        this.pageStep = EPageStep.add;
    }

    // Morris //
    async initPremission() {
        let param: {
            paging: {
                page: number;
                pageSize: number;
            };
        } = {
            paging: {
                page: 1,
                pageSize: 10000
            }
        };
        await this.$server
            .R("/acs/permissiontable", param)
            .then((response: any) => {
                if (response != undefined) {
                    for (let content of response.results) {
                        if (
                            content.objectId != undefined &&
                            content.tablename != undefined
                        ) {
                            let tempOption: ISortSelectOption = {
                                value: content.objectId,
                                text: content.tablename
                            };
                            this.premissionOptions.push(tempOption);
                        }
                    }
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }
    // Morris //

    async pageToEdit(type: string) {
        this.pageStep = EPageStep.edit;
        this.getInputData();

        this.inputFormData.type = type;

        this.inputFormData.siteIds = JSON.parse(
            JSON.stringify(
                this.inputFormData.siteIds.map(item => item.objectId)
            )
        );
        this.inputFormData.groupIds = JSON.parse(
            JSON.stringify(
                this.inputFormData.groupIds.map(item => item.objectId)
            )
        );
    }

    pageToView() {
        this.pageStep = EPageStep.view;
        this.getInputData();
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        (this.$refs.listTable as any).reload();
    }

    saveAddOrEdit() {}

    async saveAdd(data) {
        const datas: any[] = [
            {
                username: data.username,
                role: data.role,
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
                employeeId: data.employeeId,
                siteIds: data.siteIds !== undefined ? data.siteIds : [],
                groupIds: data.groupIds !== undefined ? data.groupIds : []
            }
        ];

        const addParam = {
            datas
        };

        await this.$server
            .C("/acs/member", addParam)
            .then((response: any) => {
                for (const returnValue of response) {
                    if (returnValue.statusCode === 200) {
                        Dialog.success(this._("w_User_AddUserSuccess"));
                        this.pageToList();
                    }
                    if (returnValue.statusCode === 500) {
                        Dialog.error(this._("w_User_AddUserFailed"));
                        return false;
                    }
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                if (e.res.statusCode == 500) {
                    Dialog.error(this._("w_User_AddUserFailed"));
                    return false;
                }
                console.log(e);
                return false;
            });
    }

    async saveEdit(data) {
        const datas: any[] = [
            {
                role: data.role,
                name: data.name,
                email: data.email,
                phone: data.phone,
                siteIds: data.siteIds !== undefined ? data.siteIds : [],
                groupIds: data.groupIds !== undefined ? data.groupIds : [],
                objectId: data.objectId
            }
        ];

        const editParam = {
            datas
        };

        await this.$server
            .U("/acs/member", editParam)
            .then((response: any) => {
                for (const returnValue of response) {
                    if (returnValue.statusCode === 200) {
                        Dialog.success(this._("w_User_EditUserSuccess"));
                        this.pageToList();
                    }
                    if (returnValue.statusCode === 500) {
                        Dialog.error(this._("w_User_EditUserFailed"));
                        return false;
                    }
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                if (e.res.statusCode == 500) {
                    Dialog.error(this._("w_User_EditUserFailed"));
                    return false;
                }
                console.log(e);
                return false;
            });
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_User_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const param of this.selectedDetail) {
                    const deleteParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    this.$server
                        .D("/acs/member", deleteParam)
                        .then((response: any) => {
                            for (const returnValue of response) {
                                if (returnValue.statusCode === 200) {
                                    this.pageToList();
                                }
                                if (returnValue.statusCode === 500) {
                                    Dialog.error(this._("w_DeleteFailed"));
                                    return false;
                                }
                            }
                        })
                        .catch((e: any) => {
                            if (
                                e.res &&
                                e.res.statusCode &&
                                e.res.statusCode == 401
                            ) {
                                return ResponseFilter.base(this, e);
                            }

                            console.log(e);
                        });
                }
            }
        );
    }

    showFirst(value): string {
        if (value.length >= 2) {
            return value.map(item => item.name)[0] + "...";
        }
        if (value.length === 1) {
            return value.map(item => item.name)[0];
        }
        if (value.length == 0) {
            return "";
        }
    }

    show30Words(
        value: any,
        startWord: number = 0,
        endWord: number = 30
    ): string {
        return value.length < endWord
            ? value.substring(startWord, endWord)
            : value.substring(startWord, endWord) + "...";
    }

    idsToText(value: any): string {
        let result = "";
        for (let val of value) {
            result += val.name + ", ";
        }
        result = result.substring(0, result.length - 2);
        return result;
    }

    cardSearch(search: string) {
        // TODO: finished search
        // console.log('search - ', search)
        this.searchKeywords(search);
    }

    searchKeywords(search: string) {
        // TODO: finished search
        if (search != "") {
            const accountText = this.inputFormData.username.toLocaleLowerCase();
            const nameText = this.inputFormData.name.toLocaleLowerCase();
            const searchText = search.toLowerCase();
            const searchResult =
                accountText.match(searchText) || nameText.match(searchText);
            return searchResult;
        }
    }

    dateToYYYY_MM_DD(value) {
        return Datetime.DateTime2String(new Date(value), "YYYY-MM-DD");
    }

    // CardNumber: CustomTextBoxControl1__CF
    // Department: CustomTextBoxControl5__CF_CF_CF
    // CostCenter: CustomTextBoxControl5__CF_CF_CF_CF
    anysisTableColumn(row: any, key: string): string {
        let result: string = "";
        if (key == "CardNumber") {
            if (
                row.Credentials != undefined &&
                row.Credentials[0] != undefined &&
                row.Credentials[0].CardNumber != undefined
            ) {
                result = row.Credentials[0].CardNumber;
            }
        } else {
            if (row.CustomFields != undefined) {
                for (let fidled of row.CustomFields) {
                    if (
                        key == "Department" &&
                        fidled.FiledName != undefined &&
                        fidled.FiledName == "CustomTextBoxControl5__CF_CF_CF"
                    ) {
                        if (fidled.FieldValue != undefined) {
                            result = fidled.FieldValue;
                        }
                    }

                    if (
                        key == "CostCenter" &&
                        fidled.FiledName != undefined &&
                        fidled.FiledName == "CustomTextBoxControl5__CF_CF_CF_CF"
                    ) {
                        if (fidled.FieldValue != undefined) {
                            result = fidled.FieldValue;
                        }
                    }
                }
            }
        }

        return result;
    }

    ITableList() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Member_EmployeeNumber1")}
                 */
                EmployeeNumber: string;

                /**
                 * @uiLabel - ${this._("w_Member_CardNumber1")}
                 */
                CardNumber: string;

                /**
                 * @uiLabel - ${this._("w_Member_PersonType1")}
                 */
                PrimaryWorkgroupName: string;

                /**
                 * @uiLabel - ${this._("w_Member_ChineseName1")}
                 */
                LastName: string;

                /**
                 * @uiLabel - ${this._("w_Member_EnglishName1")}
                 */
                FirstName: string;

                /**
                 * @uiLabel - ${this._("w_Member_Department1")}
                 */
                Department: string;
               
                /**
                 * @uiLabel - ${this._("w_Member_CostCenter1")}
                 */
                CostCenter: string;
                
                /**
                 * @uiLabel - ${this._("w_Member_StartDate1")}
                 */
                StartDate: string;

                /**
                 * @uiLabel - ${this._("w_Member_EndDate1")}
                 */
                EndDate: string;

                /**
                 * @uiLabel - ${this._("w_Member_Actions")}
                 */
                Actions?: any;
            }
        `;
    }

    IAddAndEditForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Member_CompanyName")}
                 * @uiColumnGroup - row1
                 */
                companyName?: string;

                /**
                 * @uiLabel - ${this._("w_Member_PersonType")}
                 * @uiColumnGroup - row1
                 */
                personType?: ${toEnumInterface(
                    this.workGroupSelectItem as any,
                    false
                )};

                /**
                 * @uiLabel - ${this._("w_Member_EmployeeNumber")}
                 * @uiColumnGroup - row1
                 */
                employeeNumber?: string;

                /**
                 * @uiLabel - ${this._("w_Member_ChineseName")}
                 * @uiColumnGroup - row2
                 */
                chineseName?: string;


                /**
                 * @uiLabel - ${this._("w_Member_EnglishName")}
                 * @uiColumnGroup - row2
                 */
                englishName?: string;


                /**
                 * @uiLabel - ${this._("w_Member_ChineseName")}
                 * @uiColumnGroup - row2
                 */
                chineseName?: string;


                /**
                 * @uiLabel - ${this._("w_Member_CardType")}
                 * @uiColumnGroup - row3
                 */
                personType1?: ${toEnumInterface(
                    this.workGroupSelectItem as any,
                    false
                )};

                /**
                 * @uiLabel - ${this._("w_Member_CardAllNumber")}
                 * @uiColumnGroup - row3
                 */
                cardAllNumber?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CardCustodian")}
                 * @uiColumnGroup - row3
                 */
                cardCustodian?: string;


            
                email: string;

                test?: any;

                /**
                 * @uiLabel - ${this._("w_Phone")}
                 * @uiPlaceHolder - ${this._("w_Phone_Placeholder")}
                 */
                 phone?: string;

                /**
                 * @uiLabel - ${this._("w_User_Role")}
                 */
                role: ${toEnumInterface({
                    Admin: this._("w_User_UserGroup_Admin"),
                    User: this._("w_User_UserGroup_User")
                })};

                /**
                 * @uiLabel - ${this._("w_User_UserGroup")}
                 */
                groupIds?: ${toEnumInterface(
                    this.userGroupSelectItem as any,
                    true
                )};

                selectTree?: any;

                premissionList?: any;

                tabItem?: any;

            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Account")}
                 * @uiType - iv-form-label
                 */
                username?: string;


                /**
                 * @uiLabel - ${this._("w_Name")}
                 * @uiType - iv-form-label
                 */
                name?: string;


                /**
                 * @uiLabel - ${this._("w_User_ID")}
                 * @uiType - iv-form-label
                 */
                employeeId?: string;


                /**
                 * @uiLabel - ${this._("w_Email")}
                 * @uiType - iv-form-label
                 */
                email?: string;


                /**
                 * @uiLabel - ${this._("w_Phone")}
                 * @uiType - iv-form-label
                 */
                phone?: string;


                /**
                 * @uiLabel - ${this._("w_User_Role")}
                 * @uiType - iv-form-label
                 */
                role?: string;


                /**
                 * @uiLabel - ${this._("w_User_UserGroup")}
                 * @uiType - iv-form-label
                 */
                groupIdsText?: string;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiType - iv-form-label
                 */
                siteIdsText: string;

            }
        `;
    }

    // Morris //
    ITabForm1() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_User_FullName")}
                 * @uiPlaceHolder - ${this._("w_User_FullName")}
                 */
                name: string;
            }
        `;
    }

    ITabForm2() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_User_FullName")}
                 * @uiPlaceHolder - ${this._("w_User_FullName")}
                 */
                name: string;
            }
        `;
    }

    ITabForm3() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_User_FullName")}
                 * @uiPlaceHolder - ${this._("w_User_FullName")}
                 */
                name: string;
            }
        `;
    }

    ITabForm4() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_User_FullName")}
                 * @uiPlaceHolder - ${this._("w_User_FullName")}
                 */
                name: string;
            }
        `;
    }
    // Morris //
}
</script>

<style lang="scss" scoped>
</style>
