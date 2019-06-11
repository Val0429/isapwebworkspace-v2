<template>
    <div class="animated fadeIn">
        <iv-card
            v-show="pageStep === ePageStep.list"
            :label="_('w_User_UserList')"
        >
            <template #toolbox>

                <iv-toolbox-search @keyup="cardSearch"></iv-toolbox-search>

                <iv-toolbox-view
                    :disabled="isSelected.length !== 1"
                    @click="pageToView"
                />
                <iv-toolbox-edit
                    :disabled="isSelected.length !== 1"
                    @click="pageToEdit(ePageStep.edit)"
                />
                <iv-toolbox-delete
                    :disabled="isSelected.length === 0"
                    @click="doDelete"
                />
                <iv-toolbox-divider />
                <iv-toolbox-add @click="pageToAdd(ePageStep.add)" />

            </template>

            <iv-table
                ref="userTable"
                :interface="ITableList()"
                :multiple="tableMultiple"
                :server="{ path: '/user/user' }"
                @selected="selectedItem($event)"
            >
                <template #email="{$attrs}">
                    <!--                {{ $attrs.value.map((item, index) => item.name)[0] + '...'}}-->
                    {{ show30Words($attrs.value) }}
                </template>

                <template #sites="{$attrs}">
                    <!--                {{ $attrs.value.map((item, index) => item.name)[0] + '...'}}-->
                    {{ showFirst($attrs.value) }}
                </template>

                <template #groups="{$attrs}">
                    <!--                {{ $attrs.value.map(item => item.name).join(', ')}}-->
                    {{ showFirst($attrs.value) }}
                </template>

                <template #Actions="{$attrs, $listeners}">

                    <iv-toolbox-more :disabled="isSelected.length !== 1">
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
            :label="_('w_User_AddUser')"
        >
            <template #toolbox>

                <iv-toolbox-back @click="pageToList()" />

            </template>

            <iv-form
                :interface="IAddForm()"
                :value="inputUserData"
                @update:*="tempSaveInputData($event)"
                @submit="saveAdd($event)"
            >
                <template #test="{ $attrs, $listeners }">

                    <div class="mt-2 ml-3 mb-3">
                        <b-button @click="pageToEmailTest($event)">{{ _('w_User_TestEmail') }}
                        </b-button>
                    </div>

                </template>

                <template #selectTree="{ $attrs, $listeners }">

                    <div class="mt-2 ml-3">
                        <b-button @click="pageToChooseTree">
                            {{ _('w_SelectSiteTree') }}
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

        <!-- edit -->
        <iv-auto-card
            v-show="pageStep === ePageStep.edit"
            :visible="true"
            :label="_('w_User_EditUser') "
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList()" />
            </template>

            <iv-form
                :interface="IEditForm()"
                :value="inputUserData"
                @update:*="tempSaveInputData($event)"
                @submit="saveEdit($event)"
            >
                <template #test="{ $attrs, $listeners }">

                    <div class="mt-2 ml-3 mb-3">
                        <b-button @click="pageToEmailTest($event)">{{ _('w_User_TestEmail') }}
                        </b-button>
                    </div>

                </template>

                <template #selectTree="{ $atrs, $listeners }">

                    <div class="m-3">

                        <b-button @click="pageToChooseTree">
                            {{ _('w_SelectSiteTree') }}
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
                :value="inputUserData"
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

        <region-tree-select
            v-show="pageStep === ePageStep.chooseTree"
            :regionTreeItem="regionTreeItem"
            :selectType="selectType"
            :selecteds="selecteds"
            v-on:click-back="pageToShowResult"
        >
        </region-tree-select>

        <!-- 點擊彈出測試輸入框 -->
        <b-modal
            hide-footer
            size="md"
            :title="_('w_MailServer_Test')"
            v-model="modalShow"
        >

            <div class="card-content">
                <b-form-group
                    :label="_('w_MailServer_Email')"
                    :label-cols="3"
                >
                    <b-row>
                        <b-col>
                            <b-form-input
                                v-model="inputTestEmail"
                                :placeholder="_('w_Email_Placeholder')"
                            ></b-form-input>
                        </b-col>
                    </b-row>
                </b-form-group>
            </div>

            <hr>

            <b-row>
                <!-- 送出email按鈕 -->
                <b-col
                    cols="3"
                    offset="6"
                >
                    <b-button
                        class="button button-full"
                        variant="success"
                        type="button"
                        @click="sendEmailTest()"
                    >{{ _('w_Send') }}
                    </b-button>
                </b-col>
                <!-- 離開按鈕 -->
                <b-col cols="3">
                    <b-button
                        class="button button-full"
                        variant="secondary"
                        type="button"
                        @click="modalShow = !modalShow"
                    >{{ _('w_Cancel') }}
                    </b-button>
                </b-col>
            </b-row>

        </b-modal>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import { IUserAddData, IUserEditData } from "@/config/default/api/interfaces";
import {
    ERegionType,
    IRegionItem,
    RegionTreeItem,
    IRegionTreeSelected
} from "@/components/RegionTree/models";
import { RegionTreeSelect } from "@/components/RegionTree/RegionTreeSelect.vue";

import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog/Dialog";

interface InputUserData extends IUserAddData, IUserEditData {
    siteIdsText: string;
    groupIdsText: string;
    confirmPassword?: string;
    type?: string;
    tempSiteIds?: any;
}

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    none = "none",
    showResult = "showResult",
    chooseTree = "chooseTree"
}

@Component({
    components: {}
})
export default class User extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

    isSelected: any = [];
    tableMultiple: boolean = true;

    userDetail: any = [];

    sitesSelectItem: any = {};
    userGroupSelectItem: any = {};

    inputTestEmail: string = "";

    modalShow: boolean = false;

    // tree 相關
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    inputUserData: InputUserData = {
        objectId: "",
        account: "",
        role: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        employeeId: "",
        siteIdsText: "",
        groupIdsText: "",
        type: "add",
        siteIds: [],
        groupIds: []
    };

    created() {}

    mounted() {
        this.initSelectItem();
        this.initRegionTreeSelect();
    }

    clearInputData() {
        this.inputUserData = {
            objectId: "",
            account: "",
            role: "User",
            name: "",
            email: "",
            phone: "",
            password: "",
            employeeId: "",
            siteIdsText: "",
            groupIdsText: "",
            type: "add",
            siteIds: [],
            groupIds: []
        };
    }

    initRegionTreeSelect() {
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    }

    async initSelectItem() {
        // 取得sites
        const readAllSiteParam: {
            type: string;
        } = {
            type: "all"
        };

        await this.$server
            .R("/location/site/all", readAllSiteParam)
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 sitesSelectItem 的 key 的方式
                        this.sitesSelectItem[returnValue.objectId] =
                            returnValue.name;
                        this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                            returnValue
                        );
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

        // 取得 tree
        await this.$server
            .R("/location/tree")
            .then((response: any) => {
                if (response != undefined) {
                    this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                        response
                    );
                    this.regionTreeItem.region = this.regionTreeItem.tree;
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });

        // 取得UserGroup
        await this.$server
            .R("/user/group/all")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 sitesSelectItem 的 key 的方式
                        this.userGroupSelectItem[returnValue.objectId] =
                            returnValue.name;
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

    cardSearch(search: string) {
        // TODO: finished search
        // console.log('search - ', search)
        this.searchKeywords(search);
    }

    searchKeywords(search: string) {
        // TODO: finished search
        if (search != "") {
            const accountText = this.inputUserData.account.toLocaleLowerCase();
            const nameText = this.inputUserData.name.toLocaleLowerCase();
            const searchText = search.toLowerCase();
            const searchResult =
                accountText.match(searchText) || nameText.match(searchText);

            return searchResult;
        }
    }

    selectedItem(data) {
        this.isSelected = data;
        this.userDetail = [];
        this.userDetail = data;
    }

    getInputData() {
        this.clearInputData();
        for (const param of this.userDetail) {
            this.inputUserData = {
                objectId: param.objectId,
                employeeId: param.employeeId,
                account: param.account,
                role: param.role,
                name: param.name,
                email: param.email,
                phone: param.phone,
                siteIdsText: this.idsToText(param.sites),
                groupIdsText: this.idsToText(param.groups),
                siteIds: param.sites,
                groupIds: param.groups,
                type: ""
            };
        }
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "account":
                this.inputUserData.account = data.value;
                break;
            case "password":
                this.inputUserData.password = data.value;
                break;
            case "confirmPassword":
                this.inputUserData.confirmPassword = data.value;
                break;
            case "employeeId":
                this.inputUserData.employeeId = data.value;
                break;
            case "name":
                this.inputUserData.name = data.value;
                break;
            case "email":
                this.inputUserData.email = data.value;
                break;
            case "phone":
                this.inputUserData.phone = data.value;
                break;
            case "siteIds":
                this.inputUserData.siteIds = data.value;
                break;
            case "groupIds":
                this.inputUserData.groupIds = data.value;
                break;
        }

        this.selecteds = [];

        for (const id of this.inputUserData.siteIds) {
            for (const detail in this.sitesSelectItem) {
                if (id === detail) {
                    let selectedsObject: IRegionTreeSelected = {
                        objectId: detail,
                        type: ERegionType.site,
                        name: this.sitesSelectItem[detail]
                    };
                    this.selecteds.push(selectedsObject);
                }
            }
        }
    }

    idsToText(value: any): string {
        let result = "";
        for (let val of value) {
            result += val.name + ", ";
        }
        result = result.substring(0, result.length - 2);
        return result;
    }

    pageToView() {
        this.pageStep = EPageStep.view;
        this.getInputData();
    }

    pageToEdit(type: string) {
        this.pageStep = EPageStep.edit;
        this.getInputData();
        this.selecteds = [];

        this.inputUserData.type = type;

        this.inputUserData.tempSiteIds = JSON.parse(
            JSON.stringify(this.inputUserData.siteIds)
        );

        this.inputUserData.siteIds = JSON.parse(
            JSON.stringify(
                this.inputUserData.siteIds.map(item => item.objectId)
            )
        );
        this.inputUserData.groupIds = JSON.parse(
            JSON.stringify(
                this.inputUserData.groupIds.map(item => item.objectId)
            )
        );
    }

    pageToAdd(type: string) {
        this.pageStep = EPageStep.add;
        if (type === EPageStep.add) {
            this.clearInputData();
            this.selecteds = [];
            this.inputUserData.type = type;
        }
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        (this.$refs.userTable as any).reload();
        this.selecteds = [];
    }

    pageToEmailTest() {
        this.inputTestEmail = "";
        this.modalShow = !this.modalShow;
    }

    pageToShowResult() {
        if (this.inputUserData.type === EPageStep.edit) {
            this.pageStep = EPageStep.edit;
            // siteIds clear
            this.inputUserData.siteIds = [];

            // from selecteds push siteIds
            for (const item of this.selecteds) {
                this.inputUserData.siteIds.push(item.objectId);
            }
        }

        if (this.inputUserData.type === EPageStep.add) {
            this.pageStep = EPageStep.add;

            // siteIds clear
            this.inputUserData.siteIds = [];

            // from selecteds push siteIds
            for (const item of this.selecteds) {
                this.inputUserData.siteIds.push(item.objectId);
            }
        }
    }

    pageToChooseTree() {
        this.pageStep = EPageStep.chooseTree;
        this.selecteds = [];
        for (const id of this.inputUserData.siteIds) {
            for (const detail in this.sitesSelectItem) {
                if (id === detail) {
                    let selectedsObject: IRegionTreeSelected = {
                        objectId: detail,
                        type: ERegionType.site,
                        name: this.sitesSelectItem[detail]
                    };
                    this.selecteds.push(selectedsObject);
                }
            }
        }
    }

    async sendEmailTest() {
        const mailServerObject: {
            email: string;
        } = {
            email: this.inputTestEmail
        };

        await this.$server
            .C("/setting/smtp/test", mailServerObject)
            .then((response: any) => {
                if (response != undefined) {
                    Dialog.success(this._("w_MailServer_Setting_Success"));
                    this.modalShow = !this.modalShow;
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                this.modalShow = !this.modalShow;
                Dialog.error(this._("w_MailServer_Test_Fail"));
                return false;
            });
    }

    async saveAdd(data) {
        const datas: IUserAddData[] = [
            {
                account: data.account,
                role: data.role,
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
                employeeId: data.employeeId,
                siteIds: data.siteIds,
                //siteIds: ArrayHelper.addTreeArray(data.siteIds, this.selecteds),
                groupIds: data.groupIds
            }
        ];

        const addParam = {
            datas
        };

        await this.$server
            .C("/user/user", addParam)
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
        const datas: IUserEditData[] = [
            {
                role: data.role,
                name: data.name,
                email: data.email,
                phone: data.phone,
                siteIds: data.siteIds,
                //siteIds: ArrayHelper.addTreeArray(data.siteIds, this.selecteds),
                groupIds: data.groupIds,
                objectId: data.objectId
            }
        ];

        const editParam = {
            datas
        };

        await this.$server
            .U("/user/user", editParam)
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
                for (const param of this.userDetail) {
                    const deleteParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    this.$server
                        .D("/user/user", deleteParam)
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

    showFirst(value) {
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

    ITableList() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;


                /**
                 * @uiLabel - ${this._("w_Account")}
                 */
                account: string;


                /**
                 * @uiLabel - ${this._("w_User_FullName")}
                 */
                name: string;


                /**
                 * @uiLabel - ${this._("w_User_Role")}
                 */
                role: string;


                /**
                 * @uiLabel - ${this._("w_Email")}
                 */
                email: string;


                /**
                 * @uiLabel - ${this._("w_User_Group")}
                 */
                groups: string;


                /**
                 * @uiLabel - ${this._("w_ManagedSites")}
                 */
                sites: string;


                /**
                 * @uiLabel - ${this._("w_User_AppInstalled")}
                 */
                isAppBinding: string;

                Actions?: any;

            }
        `;
    }

    IAddForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Account")}
                 * @uiPlaceHolder - ${this._("w_Account")}
                 */
                account: string;


                /**
                 * @uiLabel - ${this._("w_Password")}
                 * @uiPlaceHolder - ${this._("w_Password")}
                 * @uiType - iv-form-password
                 * @uiColumnGroup - password
                 */
                password: string;


                /**
                 * @uiLabel - ${this._("w_PasswordConfirm")}
                 * @uiPlaceHolder - ${this._("w_PasswordConfirm")}
                 * @uiType - iv-form-password
                 * @uiColumnGroup - password
                 * @uiValidation - (value, all) => value === all.password
                 * @uiInvalidMessage - ${this._("w_Error_Password")}
                 */
                confirmPassword: string;


                /**
                 * @uiLabel - ${this._("w_User_FullName")}
                 * @uiPlaceHolder - ${this._("w_User_FullName")}
                 */
                name: string;


                /**
                 * @uiLabel - ${this._("w_User_ID")}
                 * @uiPlaceHolder - ${this._("w_User_ID")}
                 */
                employeeId: string;


                /**
                 * @uiLabel - ${this._("w_Email")}
                 * @uiPlaceHolder - ${this._("w_Email_Placeholder")}
                 */
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


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                siteIds?: ${toEnumInterface(this.sitesSelectItem as any, true)};

                selectTree?: any;

            }
        `;
    }

    IEditForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Account")}
                 * @uiPlaceHolder - ${this._("w_Account")}
                 * @uiType - iv-form-label
                 */
                account: string;


                /**
                 * @uiLabel - ${this._("w_User_FullName")}
                 * @uiPlaceHolder - ${this._("w_User_FullName")}
                 */
                name: string;


                /**
                 * @uiLabel - ${this._("w_User_ID")}
                 * @uiPlaceHolder - ${this._("w_User_ID")}
                 * @uiType - iv-form-label
                 */
                employeeId: string;


                /**
                 * @uiLabel - ${this._("w_Email")}
                 * @uiPlaceHolder - ${this._("w_Email_Placeholder")}
                 */
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


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                siteIds?: ${toEnumInterface(this.sitesSelectItem as any, true)};

                selectTree?: any;

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
                account?: string;


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
}
</script>

<style lang="scss" scoped>
</style>
