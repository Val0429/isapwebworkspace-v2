<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label="_('w_Tenants_InvitationList')"
            >
                <template
                    #toolbox
                    v-if="showModifyTool()"
                >
                    <iv-toolbox-view
                        :disabled="selectedDetail.length !== 1"
                        @click="pageToView"
                    />
                    <iv-toolbox-delete
                        :disabled="selectedDetail.length === 0"
                        @click="doDelete"
                    />
                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToAdd()" />
                </template>

                <iv-table
                    ref="listTable"
                    :interface="ITableList()"
                    :multiple="tableMultiple"
                    :server="{ path: '/flow2/visitors/invites' }"
                    :selectable="showModifyTool()"
                    @selected="selectedItem($event)"
                >

                    <template #phone="{$attrs}">
                        <div>{{$attrs.row.visitors[0] != undefined && $attrs.row.visitors[0].phone != undefined ? $attrs.row.visitors[0].phone : ''}}</div>
                    </template>

                    <template #name="{$attrs}">
                        <div>{{$attrs.row.visitors[0] != undefined && $attrs.row.visitors[0].name != undefined ? $attrs.row.visitors[0].name : ''}}</div>
                    </template>

                    <template #email="{$attrs}">
                        <div>{{$attrs.row.visitors[0] != undefined && $attrs.row.visitors[0].email != undefined ? $attrs.row.visitors[0].email : ''}}</div>
                    </template>

                    <template #status="{$attrs}">
                        <div>{{$attrs.row.cancelled ? _('w_Cancelled') : $attrs.row.visitors[0].status}}</div>
                    </template>

                    <template #startDate="{$attrs}">
                        <div>{{ resolveDatetimeStart($attrs.row.dates) }}</div>
                    </template>

                    <template #endDate="{$attrs}">
                        <div>{{ resolveDatetimeEnd($attrs.row.dates) }}</div>
                    </template>

                    <template
                        #Actions="{$attrs, $listeners}"
                        v-if="showModifyTool()"
                    >
                        <iv-toolbox-more
                            size="sm"
                            :disabled="selectedDetail.length !== 1"
                        >
                            <iv-toolbox-view @click="pageToView" />
                            <iv-toolbox-delete @click="doDelete" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>

            <!-- view -->
            <iv-auto-card
                key="transition_2"
                v-show="transition.step === 2"
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

            <!-- Modify -->
            <iv-auto-card
                key="transition_3"
                v-show="transition.step === 3"
                :visible="true"
                :label="inputFormData.objectId == '' ? _('w_Tenants_AddInvitation') : _('w_Tenants_EditInvitation') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IModifyForm()"
                    :value="inputFormData"
                    @update:*="updateModifyForm"
                    @submit="saveModifyForm($event)"
                >

                    <template #purpose="{ $attrs, $listeners }">

                        <iv-form-selection
                            v-on="$listeners"
                            v-bind="$attrs"
                            :options="selectItem.purposes"
                            :multiple="false"
                        >
                        </iv-form-selection>
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

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import ResponseFilter from "@/services/ResponseFilter";
import RoleService from "../../../services/Role/RoleService";

@Component({
    components: {}
})
export default class TenantsInvitation extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    tableMultiple: boolean = true;
    selectedDetail: any = [];

    inputFormData: any = {
        objectId: "",
        mobile: "",
        name: "",
        email: "",
        status: "",
        startDate: new Date(),
        endDate: new Date(),
        purpose: "",
        startString: "",
        endString: ""
    };

    selectItem: {
        purposes: any;
    } = {
        purposes: []
    };

    created() {}

    mounted() {
        this.initSelectItemPurpose();
    }

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        this.clearInputData();
        (this.$refs.listTable as any).reload();
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.clearInputData();
        this.getInputData();
    }

    pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    showModifyTool(): boolean {
        let result = false;
        result = RoleService.haveTenantUser(this);
        console.log("!!! showModifyTool");
        return result;
    }

    async initSelectItemPurpose() {
        const readParam: {} = {};

        await this.$server
            .R("/flow2/purposes", readParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        let item = {
                            id: returnValue.objectId,
                            text: returnValue.name
                        };
                        this.selectItem.purposes.push(item);
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async doDelete() {
        for (let item of this.selectedDetail) {
            const deleteParam = {
                objectId: item.objectId,
                cancelled: true
            };

            await this.$server
                .U("/flow2/visitors/invites", deleteParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {}
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }

        this.pageToList();
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            mobile: "",
            name: "",
            email: "",
            status: "",
            startDate: new Date(),
            endDate: new Date(),
            purpose: "",
            startString: "",
            endString: ""
        };
    }

    selectedItem(datas: any) {
        this.selectedDetail = datas;
    }

    resolveDatetimeStartDate(dateStringList: any): Date {
        let result = new Date();
        let dataIndex = 0;
        if (
            dateStringList[dataIndex] != undefined &&
            dateStringList[dataIndex].start != undefined
        ) {
            result = new Date(dateStringList[dataIndex].start);
        }
        return result;
    }

    resolveDatetimeEndDate(dateStringList: any): Date {
        let result = new Date();
        let dataIndex = dateStringList.length - 1;
        if (
            dateStringList[dataIndex] != undefined &&
            dateStringList[dataIndex].end != undefined
        ) {
            result = new Date(dateStringList[dataIndex].end);
        }
        return result;
    }

    resolveDatetimeStart(dateStringList: any): string {
        let result = "";
        let dataIndex = 0;
        if (
            dateStringList[dataIndex] != undefined &&
            dateStringList[dataIndex].start != undefined
        ) {
            result = Datetime.DateTime2String(
                new Date(dateStringList[dataIndex].start),
                "YYYY-MM-DD"
            );
        }
        return result;
    }

    resolveDatetimeEnd(dateStringList: any): string {
        let result = "";
        let dataIndex = dateStringList.length - 1;
        if (
            dateStringList[dataIndex] != undefined &&
            dateStringList[dataIndex].end != undefined
        ) {
            result = Datetime.DateTime2String(
                new Date(dateStringList[dataIndex].end),
                "YYYY-MM-DD"
            );
        }
        return result;
    }

    getInputData() {
        for (const param of this.selectedDetail) {
            let visitorMobile =
                param.visitors != undefined &&
                param.visitors[0] != undefined &&
                param.visitors[0].phone != undefined
                    ? param.visitors[0].phone
                    : "";
            let visitorName =
                param.visitors != undefined &&
                param.visitors[0] != undefined &&
                param.visitors[0].name != undefined
                    ? param.visitors[0].name
                    : "";
            let visitorEmail =
                param.visitors != undefined &&
                param.visitors[0] != undefined &&
                param.visitors[0].email != undefined
                    ? param.visitors[0].email
                    : "";
            let visitorStatus =
                param.visitors != undefined &&
                param.visitors[0] != undefined &&
                param.visitors[0].status != undefined
                    ? param.visitors[0].status
                    : "";

            this.inputFormData = {
                objectId: param.objectId,
                mobile: visitorMobile,
                name: visitorName,
                email: visitorEmail,
                status: visitorStatus,
                startDate: this.resolveDatetimeStartDate(param.dates),
                endDate: this.resolveDatetimeEndDate(param.dates),
                purpose: param.purpose.name,
                startString: this.resolveDatetimeStart(param.dates),
                endString: this.resolveDatetimeEnd(param.dates)
            };
        }
    }

    updateModifyForm(datas: any) {
        this.inputFormData[datas.key] = datas.value;
    }

    async saveModifyForm() {
        //dates
        let dates = [
            {
                start: Datetime.DateStart(this.inputFormData.startDate),
                end: Datetime.DateEnd(this.inputFormData.endDate)
            }
        ];

        //post api
        const createParam = {
            visitors: [
                {
                    name: this.inputFormData.name,
                    phone: this.inputFormData.mobile,
                    email: this.inputFormData.email
                }
            ],
            purpose: this.inputFormData.purpose,
            dates: dates
        };

        await this.$server
            .C("/flow2/visitors/invites", createParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.pageToList();
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    ////////////////////////// interface //////////////////////////

    ITableList() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_MobileNumber")}
                 */
                phone: any;

                /**
                 * @uiLabel - ${this._("w_Tenants_Name")}
                 */
                name: any;

                /**
                 * @uiLabel - ${this._("w_Tenants_Email")}
                 */
                email: any;

                /**
                 * @uiLabel - ${this._("w_Tenants_Status")}
                 */
                status: any;

                /**
                 * @uiLabel - ${this._("w_Tenants_StartDate")}
                 */
                startDate: any;

                /**
                 * @uiLabel - ${this._("w_Tenants_EndDate")}
                 */
                endDate: any;

                purpose: interface {
                    /**
                     * @uiLabel - ${this._("w_Tenants_Purpose")}
                     */
                    name: string;
                };

                ${this.showModifyTool() ? "Actions: any;" : ""} 
            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Tenants_MobileNumber")}
                 * @uiType - iv-form-label
                 */
                mobile?: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_Name")}
                 * @uiType - iv-form-label
                 */
                name?: string;

                 /**
                 * @uiLabel - ${this._("w_Tenants_Email")}
                 * @uiType - iv-form-label
                 */
                email?: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_Status")}
                 * @uiType - iv-form-label
                 */
                status?: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_StartDate")}
                 * @uiType - iv-form-label
                 * @uiColumnGroup - date
                 */
                startString?: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_EndDate")}
                 * @uiType - iv-form-label
                 * @uiColumnGroup - date
                 */
                endString?: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_Purpose")}
                 * @uiType - iv-form-label
                 */
                purpose?: string;
            }
        `;
    }

    IModifyForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Tenants_MobileNumber")}
                 */
                mobile: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_Name")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_Email")}
                 */
                email: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_StartDate")}
                 * @uiType - iv-form-date
                 * @uiColumnGroup - date
                 */
                startDate: Date;

                /**
                 * @uiLabel - ${this._("w_Tenants_EndDate")}
                 * @uiType - iv-form-date
                 * @uiColumnGroup - date
                 */
                endDate: Date;

        
                /**
                 * @uiLabel - ${this._("w_Tenants_Purpose")}
                 * @uiType - iv-form-selection
                 */
                purpose?: ${toEnumInterface(
                    this.selectItem.purposes as any,
                    false
                )};
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




