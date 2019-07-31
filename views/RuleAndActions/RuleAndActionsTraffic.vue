<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <div
                key="transition_1"
                v-show="transition.step === 1"
            >
                <iv-card :label="_('w_RuleAndActions_RuleList')">
                    <template #toolbox>
                        <iv-toolbox-view
                            :disabled="isSelected.length !== 1"
                            @click="pageToView"
                        />
                        <iv-toolbox-edit
                            :disabled="isSelected.length !== 1"
                            @click="pageToEdit"
                        />
                        <iv-toolbox-delete
                            :disabled="isSelected.length === 0"
                            @click="doDelete"
                        />
                        <iv-toolbox-divider />
                        <iv-toolbox-add @click="pageToAdd()" />
                    </template>

                    <iv-table
                        ref="listTable"
                        :interface="ITableList()"
                        :multiple="tableMultiple"
                        :server="{ path: '/rule/peopleCounting' }"
                        @selected="selectedItem($event)"
                    >

                        <template #Actions="{$attrs, $listeners}">
                            <iv-toolbox-more
                                size="sm"
                                :disabled="isSelected.length !== 1"
                            >
                                <iv-toolbox-view @click="pageToView" />
                                <iv-toolbox-edit @click="pageToEdit" />
                                <iv-toolbox-delete @click="doDelete" />
                            </iv-toolbox-more>
                        </template>

                    </iv-table>
                </iv-card>

            </div>

            <!-- view -->
            <div
                key="transition_2"
                v-show="transition.step === 2"
            >
                <iv-auto-card
                    :visible="true"
                    :label="_('w_RuleAndActions_RuleAView') "
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

            <!-- add & edit -->
            <div
                key="transition_3"
                v-show="transition.step === 3"
            >
                <iv-auto-card
                    :visible="true"
                    :label="_('w_User_ViewUser') "
                >

                    <iv-step-progress
                        ref="step"
                        @mounted="doMounted"
                    >

                        <template #1-title>{{ _('w_RuleAndActions_EditStep1') }}</template>
                        <template #1>
                            <choose-metrics
                                :deviceMode="deviceMode"
                                @name="receiveName"
                                @active="receiveActive"
                                @site-ids="receiveSiteIds"
                                @area-ids="receiveAreaIds"
                                @device-group-ids="receiveDeviceGroupIds"
                                @device-ids="receiveDeviceIds"
                            ></choose-metrics>
                        </template>

                        <template #2-title>{{ _('w_RuleAndActions_EditStep2') }}</template>
                        <template #2>

                            <iv-form
                                :interface="IStep2()"
                                :value="step2Item"
                                @submit="stepTo3($event)"
                            >
                                <template #conditionTitle="{ $attrs, $listeners }">
                                    <div class="ml-3 mb-2 w-100">{{ _('w_RuleAndActions_Condition') }}</div>
                                </template>

                                <template #conditionContent="{ $attrs, $listeners }">
                                    <b-form-group class="col-md-12">
                                        <b-row
                                            v-for="(value, index) in conditions"
                                            :key="'condition__' + index"
                                        >
                                            <b-col class="col-md-4">
                                                <iv-form-selection
                                                    v-model="conditions[index].ruleMode"
                                                    :plain="true"
                                                    :options="selectItem.ruleMode"
                                                ></iv-form-selection>
                                            </b-col>

                                            <b-col class="col-md-2">
                                                <iv-form-selection
                                                    v-model="conditions[index].equalMode"
                                                    :plain="true"
                                                    :options="selectItem.equalMode"
                                                ></iv-form-selection>
                                            </b-col>

                                            <b-col class="col-md-2">
                                                <iv-form-number
                                                    v-model="conditions[index].fillValue"
                                                    :plain="true"
                                                    min="0"
                                                ></iv-form-number>
                                            </b-col>

                                            <b-col class="col-md-2">
                                                <iv-form-selection
                                                    v-model="conditions[index].andMode"
                                                    :plain="true"
                                                    :options="selectItem.andMode"
                                                ></iv-form-selection>
                                            </b-col>

                                            <b-col class="col-md-1">
                                                <b-button
                                                    class="button addButton"
                                                    variant="success"
                                                    type="button"
                                                    @click="addCondition()"
                                                >
                                                    <i class="fa fa-plus"></i>
                                                </b-button>
                                            </b-col>

                                            <b-col class="col-md-1">
                                                <b-button
                                                    v-show="conditions.length > 1"
                                                    class="button"
                                                    variant="danger"
                                                    type="button"
                                                    @click="removeCondition(index)"
                                                >
                                                    <i class="fa fa-minus"></i>
                                                </b-button>
                                            </b-col>
                                        </b-row>
                                    </b-form-group>
                                </template>
                            </iv-form>

                        </template>

                        <template #3-title>{{ _('w_RuleAndActions_EditStep3') }}</template>
                        <template #3>
                            <actions
                                @notify-method="receiveNotifyMethod"
                                @notify-target="receiveNotifyTarget"
                                @user-ids="receiveUserIds"
                                @user-group-ids="receiveUserGroupIds"
                                @minutes="receiveMinutes"
                            ></actions>
                        </template>

                    </iv-step-progress>

                </iv-auto-card>
            </div>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// custom
import { EDeviceMode, IValSelectItem } from "@/components/Reports";
import {
    ESiteCountMode,
    ERuleMode,
    EEqualMode,
    EAndMode
} from "@/components/RuleAndActions";

// Service
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";

interface ICondition {
    fillValue: number;
    ruleMode: ERuleMode;
    equalMode: EEqualMode;
    andMode: EAndMode;
}

@Component({
    components: {}
})
export default class RuleAndActionsTraffic extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    isMounted: boolean = false;
    doMounted() {
        this.isMounted = true;
    }

    // choose-metrics 使用
    deviceMode: string = EDeviceMode.peopleCounting;

    isSelected: any = [];
    tableMultiple: boolean = true;
    selectedDetail: any = [];

    inputFormData: any = {
        // choose-metrics
        name: "",
        active: "",
        siteIds: [],
        areaIds: [],
        deviceGroupIds: [],
        deviceIds: [],

        // actions
        notifyMethod: [],
        notifyTarget: [],
        userIds: [],
        userGroupIds: [],
        minutes: 0
    };

    ////////////////////////////////// Morris Start //////////////////////////////////

    step2Item: any = {
        condition: []
    };
    conditions: ICondition[] = [];

    siteCountMode: ESiteCountMode = ESiteCountMode.none;
    selectItem: {
        ruleMode: IValSelectItem[];
        ruleModeSingle: IValSelectItem[];
        ruleModeMutliple: IValSelectItem[];
        equalMode: IValSelectItem[];
        andMode: IValSelectItem[];
    } = {
        ruleMode: [],
        ruleModeSingle: [],
        ruleModeMutliple: [],
        equalMode: [],
        andMode: []
    };

    clearConditions() {
        this.conditions = [];
        this.addCondition();
    }

    addCondition() {
        let tempCondition: ICondition = {
            fillValue: 0,
            ruleMode: ERuleMode.trafficSingleSiteToday,
            equalMode: EEqualMode.equal,
            andMode: EAndMode.and
        };

        switch (this.siteCountMode) {
            case ESiteCountMode.single:
                tempCondition.ruleMode = ERuleMode.trafficSingleSiteToday;
                break;
            case ESiteCountMode.multiple:
                tempCondition.ruleMode = ERuleMode.trafficMultipleSiteToday;
                break;
        }
        this.conditions.push(tempCondition);
    }

    removeCondition(index: number) {
        this.conditions.splice(index, 1);
    }

    initConditionSelectItem() {
        switch (this.siteCountMode) {
            case ESiteCountMode.single:
                this.selectItem.ruleMode = JSON.parse(
                    JSON.stringify(this.selectItem.ruleModeSingle)
                );
                break;
            case ESiteCountMode.multiple:
                this.selectItem.ruleMode = JSON.parse(
                    JSON.stringify(this.selectItem.ruleModeMutliple)
                );
                break;
        }
    }

    initSelectItem() {
        this.selectItem.ruleModeSingle = [
            {
                id: ERuleMode.trafficSingleSiteToday,
                text: this._("w_RuleAndActions_RuleStatusTrafficSingleToday")
            },
            {
                id: ERuleMode.trafficSingleSiteCurrent,
                text: this._("w_RuleAndActions_RuleStatusTrafficSingleCurrent")
            }
        ];

        this.selectItem.ruleModeMutliple = [
            {
                id: ERuleMode.trafficMultipleSiteToday,
                text: this._("w_RuleAndActions_RuleStatusTrafficMultipleToday")
            },
            {
                id: ERuleMode.trafficMultipleSiteCurrent,
                text: this._(
                    "w_RuleAndActions_RuleStatusTrafficMultipleCurrent"
                )
            }
        ];

        this.selectItem.equalMode = [
            {
                id: EEqualMode.more,
                text: this._("w_RuleAndActions_EqualStatusMore")
            },
            {
                id: EEqualMode.moreEqual,
                text: this._("w_RuleAndActions_EqualStatusMoreEqual")
            },
            {
                id: EEqualMode.equal,
                text: this._("w_RuleAndActions_EqualStatusEqual")
            },
            {
                id: EEqualMode.less,
                text: this._("w_RuleAndActions_EqualStatusLess")
            },
            {
                id: EEqualMode.lessEqual,
                text: this._("w_RuleAndActions_EqualStatusLessEqual")
            }
        ];

        this.selectItem.andMode = [
            { id: EAndMode.and, text: this._("w_RuleAndActions_AndStatusAnd") },
            { id: EAndMode.or, text: this._("w_RuleAndActions_AndStatusOr") }
        ];
    }

    pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;

        // TODO: ESiteCountMode from step 1
        this.siteCountMode = ESiteCountMode.single;
        this.initConditionSelectItem();
        this.clearConditions();
    }

    pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;

        // TODO: ESiteCountMode from step 1
        this.siteCountMode = ESiteCountMode.single;
        this.initConditionSelectItem();
        this.clearConditions();
    }

    IStep2() {
        return `
            interface {
                conditionTitle?: any;
                conditionContent?: any;
            }`;
    }

    stepTo3(event: any) {
        console.log(this.conditions);
    }

    ////////////////////////////////// Morris End //////////////////////////////////

    created() {
        this.initSelectItem();
    }

    mounted() {}

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        (this.$refs.listTable as any).reload();
    }

    ////////////////////  Tina start  以下資料來自 step1 choose-metrics   ////////////////////
    receiveName(name: string) {
        console.log("name ~ ", name);
        this.inputFormData.name = name;
    }

    receiveActive(active: string) {
        console.log("active ~ ", active);
        this.inputFormData.active = active;
    }

    receiveSiteIds(siteIds: object) {
        console.log("siteIds ~ ", siteIds);
        this.inputFormData.siteIds = siteIds;
    }

    receiveAreaIds(areaIds: object) {
        console.log("areaIds ~ ", areaIds);
        this.inputFormData.areaIds = areaIds;
    }

    receiveDeviceGroupIds(deviceGroupIds: object) {
        console.log("deviceGroupIds ~ ", deviceGroupIds);
        this.inputFormData.deviceGroupIds = deviceGroupIds;
    }

    receiveDeviceIds(deviceIds: object) {
        console.log("deviceIds ~ ", deviceIds);
        this.inputFormData.deviceIds = deviceIds;
    }
    ////////////////////  以上資料來自 step1 choose-metrics   ////////////////////

    ////////////////////  以下資料來自 step3 Actions   ////////////////////
    receiveNotifyMethod(notifyMethod: string) {
        console.log("notifyMethod ~ ", notifyMethod);
        this.inputFormData.notifyMethod = notifyMethod;
    }

    receiveNotifyTarget(notifyTarget: object) {
        console.log("notifyTarget ~ ", notifyTarget);
        this.inputFormData.notifyTarget = notifyTarget;
    }

    receiveUserIds(userIds: object) {
        console.log("userIds ~ ", userIds);
        this.inputFormData.userIds = userIds;
    }

    receiveUserGroupIds(userGroupIds: object) {
        console.log("userGroupIds ~ ", userGroupIds);
        this.inputFormData.userGroupIds = userGroupIds;
    }

    receiveMinutes(minutes: number) {
        console.log("minutes ~ ", minutes);
        this.inputFormData.minutes = minutes;
    }
    //////////////////// Tina end 以上資料來自 step3 Actions   ////////////////////

    async doDelete() {
        await Dialog.confirm(
            this._("w_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                Loading.show();
                for (const param of this.selectedDetail) {
                    const deleteParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };
                    // DO TO wait API
                    // this.$server
                    //     .D("/rule/peopleCounting", deleteParam)
                    //     .then((response: any) => {
                    //         ResponseFilter.successCheck(
                    //             this,
                    //             response,
                    //             (response: any) => {
                    //                 this.pageToList();
                    //             },
                    //             this._("w_DeleteFailed")
                    //         );
                    //     })
                    //     .catch((e: any) => {
                    //         return ResponseFilter.catchError(this, e);
                    //     });
                }
                Loading.hide();
            }
        );
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
                 * @uiLabel - ${this._("w_RuleAndActions_Traffic_RuleName")}
                 */
                ruleName: string;

                /**
                 * @uiLabel - ${this._(
                     "w_RuleAndActions_Traffic_StoreAreaDevice"
                 )}
                 */
                storeAreaDevice: string;

                /**
                 * @uiLabel - ${this._("w_RuleAndActions_Traffic_Active")}
                 */
                active: string;

                /**
                 * @uiLabel - ${this._("w_RuleAndActions_Traffic_RunTime")}
                 */
                runTime: string;

                /**
                 * @uiLabel - ${this._("w_RuleAndActions_Traffic_Condition")}
                 */
                condition: string;

                Actions?: any;

            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_RuleAndActions_Traffic_RuleName")}
                   * @uiType - iv-form-label
                 */
                ruleName: string;

                /**
                 * @uiLabel - ${this._(
                     "w_RuleAndActions_Traffic_StoreAreaDevice"
                 )}
                 *  @uiType - iv-form-label
                 */
                storeAreaDevice: string;

                /**
                 * @uiLabel - ${this._("w_RuleAndActions_Traffic_Active")}
                 *  @uiType - iv-form-label
                 */
                active: string;

                /**
                 * @uiLabel - ${this._("w_RuleAndActions_Traffic_RunTime")}
                 *  @uiType - iv-form-label
                 */
                runTime: string;

                /**
                 * @uiLabel - ${this._("w_RuleAndActions_Traffic_Condition")}
                 *  @uiType - iv-form-label
                 */
                condition: string;

                Actions?: any;

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




