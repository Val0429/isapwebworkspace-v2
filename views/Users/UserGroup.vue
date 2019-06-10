<template>
    <div class="animated fadeIn">
        <iv-card
            v-show="pageStep === ePageStep.list"
            :label="_('w_UserGroup_UserGroupList')"
        >
            <template #toolbox>

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
                ref="userGroupTable"
                :interface="ITableList()"
                :multiple="tableMultiple"
                :server="{ path: '/user/group' }"
                @selected="selectedItem($event)"
            >
                <template #description="{$attrs}">
                    <!--                {{ $attrs.value.map((item, index) => item.name)[0] + '...'}}-->
                    {{ show30Words($attrs.value) }}
                </template>

                <template #sites="{$attrs}">
                    <!--                {{ $attrs.value.map((item, index) => item.name)[0] + '...'}}-->
                    {{ showFirst($attrs.value) }}
                </template>

                <template #users="{$attrs}">
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
            :label="_('w_UserGroup_AddGroup')"
        >
            <template #toolbox>

                <iv-toolbox-back @click="pageToList()" />

            </template>

            <iv-form
                :interface="IAddForm()"
                :value="inputUserGroupData"
                @update:*="tempSaveInputData($event)"
                @submit="saveAdd($event)"
            >
                <template #selectTree="{ $attrs, $listeners }">

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

        <!-- edit -->
        <iv-auto-card
            v-show="pageStep === ePageStep.edit"
            :visible="true"
            :label="_('w_UserGroup_EditGroup')"
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList()" />
            </template>

            <iv-form
                :interface="IEditForm()"
                :value="inputUserGroupData"
                @update:*="tempSaveInputData($event)"
                @submit="saveEdit($event)"
            >
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
        <iv-card
            v-show="pageStep === ePageStep.view"
            :visible="true"
            :label="_('w_UserGroup_ViewGroup')"
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList()" />
            </template>

            <iv-form
                :interface="IViewForm()"
                :value="inputUserGroupData"
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

        </iv-card>

        <region-tree-select
            v-show="pageStep === ePageStep.chooseTree"
            :regionTreeItem="regionTreeItem"
            :selectType="selectType"
            :selecteds="selecteds"
            v-on:click-back="pageToShowResult"
        >
        </region-tree-select>

    </div>
</template>

<script lang="ts">
    import { Vue, Component, Watch } from "vue-property-decorator";
    import { toEnumInterface } from "@/../core";
    import {
        ERegionType,
        IRegionItem,
        RegionTreeItem,
        IRegionTreeSelected
    } from "@/components/RegionTree/models";
    import { RegionTreeSelect } from "@/components/RegionTree/RegionTreeSelect.vue";
    import { IUserGroupAdd, IUserGroupEdit } from '@/config/default/api/interfaces'

    import RegionAPI from "@/services/RegionAPI";
    import ServerConfig from "@/services/ServerConfig";
    import ResponseFilter from "@/services/ResponseFilter";
    import Dialog from "@/services/Dialog.vue";

    interface InputUserGroupData extends IUserGroupAdd, IUserGroupEdit{
        users: any;
        siteIdsText?: string;
        groupIdsText?: string;
        tempSiteIds?: any;
        type?: string;
    }

    enum EPageStep {
        list = 'list',
        add = 'add',
        edit = 'edit',
        view = 'view',
        none = 'none',
        showResult = 'showResult',
        chooseTree = 'chooseTree',
    }

    enum EType {
        add = "add",
        edit = "edit"
    }

    @Component({
        components: { }
    })
    export default class UserGroup extends Vue {

        ePageStep = EPageStep;
        pageStep: EPageStep = EPageStep.list;

        isSelected: any = [];
        tableMultiple: boolean = true;

        userGroupDetail: any = [];

        sitesSelectItem: any = {};
        userGroupSelectItem: any = {};

        // tree 相關
        selectType = ERegionType.site;
        regionTreeItem = new RegionTreeItem();
        selecteds: IRegionTreeSelected[] = [];

        inputUserGroupData: InputUserGroupData = {
            objectId: "",
            name: "",
            description: "",
            siteIdsText: "",
            groupIdsText: "",
            type: "",
            siteIds: [],
            users: [],
        };

        created() {}

        mounted() {
            this.initSelectItem();
            this.initRegionTreeSelect();
        }

        clearInputData() {
            this.inputUserGroupData = {
                objectId: "",
                name: "",
                description: "",
                siteIdsText: "",
                groupIdsText: "",
                siteIds: [],
                users: [],
                type: "",
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

            await this.$server.R("/location/site/all", readAllSiteParam)
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
            await this.$server.R("/location/tree")
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
            await this.$server.R("/user/group/all")
                .then((response: any) => {
                    if (response != undefined) {
                        for (const returnValue of response) {
                            // 自定義 userGroupSelectItem 的 key 的方式
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

        selectedItem(data) {
            this.isSelected = data;
            this.userGroupDetail = [];
            this.userGroupDetail = data;
        }

        getInputData() {
            this.clearInputData();
            for (const param of this.userGroupDetail) {
                this.inputUserGroupData = {
                    objectId: param.objectId,
                    name: param.name,
                    description: param.description,
                    siteIdsText: this.idsToText(param.sites),
                    groupIdsText: this.idsToText(param.users),
                    siteIds: param.sites,
                    users: param.users,
                    type: "",
                };
            }
        }

        tempSaveInputData(data) {
            switch (data.key) {
                case "name":
                    this.inputUserGroupData.name = data.value;
                    break;
                case "description":
                    this.inputUserGroupData.description = data.value;
                    break;
                case "siteIds":
                    this.inputUserGroupData.siteIds = data.value;
                    break;

            }


            for (const id of this.inputUserGroupData.siteIds) {
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

            // console.log('this.selecteds - ', this.selecteds)
            // this.tempSaveData = JSON.parse(JSON.stringify(this.inputUserGroupData));
        }

        idsToText(value: any): string {
            let result = "";
            for (const val of value) {
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

            this.inputUserGroupData.type = type;

            this.inputUserGroupData.tempSiteIds = JSON.parse(
                JSON.stringify(this.inputUserGroupData.siteIds)
            );

            this.inputUserGroupData.siteIds = JSON.parse(
                JSON.stringify(
                    this.inputUserGroupData.siteIds.map(item => item.objectId)
                )
            );

        }

        pageToAdd(type: string) {
            this.pageStep = EPageStep.add;
            if (type === EType.add) {
                this.clearInputData();
                this.selecteds = [];
                this.inputUserGroupData.type = type;
            }
        }

        pageToList() {
            this.pageStep = EPageStep.list;
            (this.$refs.userGroupTable as any).reload();
            this.selecteds = [];
        }


        pageToShowResult() {
            if (this.inputUserGroupData.type === EType.edit) {
                this.pageStep = EPageStep.edit;
                // siteIds clear
                this.inputUserGroupData.siteIds = [];

                // from selecteds push siteIds
                for (const item of this.selecteds) {
                    this.inputUserGroupData.siteIds.push(item.objectId);
                }

            }

            if (this.inputUserGroupData.type === EType.add) {
                this.pageStep = EPageStep.add;

                // siteIds clear
                this.inputUserGroupData.siteIds = [];

                // from selecteds push siteIds
                for (const item of this.selecteds) {
                    this.inputUserGroupData.siteIds.push(item.objectId);
                }

            }
        }

        pageToChooseTree() {
            this.pageStep = EPageStep.chooseTree;
            this.selecteds = [];
            for (const id of this.inputUserGroupData.siteIds) {
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

        async saveAdd(data) {

            const datas: IUserGroupAdd[] = [
                {
                    name: data.name,
                    description: data.description,
                    siteIds: data.siteIds !== undefined ? data.siteIds : [],
                }
            ];

            const addUserParam = {
                datas
            };

            await this.$server.C("/user/group", addUserParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            new Dialog({
                                propsData: {
                                    label: this._("w_Error"),
                                    value: this._("w_UserGroup_AddUserGroupFailed")
                                }
                            }).$modal();
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        new Dialog({
                            propsData: {
                                label: this._("w_Error"),
                                value: this._("w_UserGroup_AddUserGroupFailed")
                            }
                        }).$modal();
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }

        async saveEdit(data) {
            const datas: IUserGroupEdit[] = [
                {

                    // siteIds: data.siteIds,
                    siteIds: data.siteIds !== undefined ? data.siteIds : [],
                    description: data.description,
                    objectId: data.objectId
                }
            ];

            const editUserParam = {
                datas
            };

            await this.$server.U("/user/group", editUserParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            new Dialog({
                                propsData: {
                                    label: this._("w_Error"),
                                    value: this._("w_UserGroup_EditUserGroupFailed")
                                }
                            }).$modal();
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        new Dialog({
                            propsData: {
                                label: this._("w_Error"),
                                value: this._("w_UserGroup_EditUserGroupFailed")
                            }
                        }).$modal();
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }

        async doDelete() {
            // await Dialog.Question(this._("w_DeleteConfirm"))
            //     .then(result => {
            //         if (result.value) {
                        for (const param of this.userGroupDetail) {
                            const deleteUserParam: {
                                objectId: string;
                            } = {
                                objectId: param.objectId
                            };

                            await this.$server.D("/user/group", deleteUserParam)
                                .then((response: any) => {
                                    for (const returnValue of response) {
                                        if (returnValue.statusCode === 200) {
                                            this.pageToList();
                                        }
                                        if (returnValue.statusCode === 500) {
                                            new Dialog({
                                                propsData: {
                                                    label: this._("w_Error"),
                                                    value: this._("w_DeleteFailed")
                                                }
                                            }).$modal();
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
                //     }
                // })
                // .catch((e: any) => console.log(e));
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
                         * @uiLabel - ${this._("w_UserGroup_GroupName")}
                         */
                        name: string;


                        /**
                         * @uiLabel - ${this._("w_Description")}
                         */
                        description: string;


                        /**
                         * @uiLabel - ${this._("w_Sites")}
                         */
                        sites: string;


                        /**
                         * @uiLabel - ${this._("w_UserGroup_Users")}
                         */
                        users: string;

                        Actions?: any;
 }
                `;
        }

        IAddForm() {
            return `
                        interface {

                        /**
                         * @uiLabel - ${this._("w_UserGroup_GroupName")}
                         * @uiPlaceHolder - ${this._("w_UserGroup_GroupName")}
                         */
                        name: string;


                        /**
                         * @uiLabel - ${this._("w_Description")}
                         * @uiPlaceHolder - ${this._("w_Description")}
                         */
                        description: string;


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
                         * @uiLabel - ${this._("w_UserGroup_GroupName")}
                         * @uiType - iv-form-label
                         */
                        name?: string;


                        /**
                         * @uiLabel - ${this._("w_Description")}
                         * @uiPlaceHolder - ${this._("w_Description")}
                         */
                        description?: string;


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
                         * @uiLabel - ${this._("w_UserGroup_GroupName")}
                         * @uiType - iv-form-label
                         */
                        name?: string;


                        /**
                         * @uiLabel - ${this._("w_Description")}
                         * @uiType - iv-form-label
                         */
                        description?: string;


                        /**
                         * @uiLabel - ${this._("w_Sites")}
                         * @uiType - iv-form-label
                         */
                        siteIdsText?: string;


                        /**
                         * @uiLabel - ${this._("w_UserGroup_Users")}
                         * @uiType - iv-form-label
                         */
                        groupIdsText?: string;

                    }
                `;
        }
    }
</script>

<style lang="scss" scoped>
</style>
