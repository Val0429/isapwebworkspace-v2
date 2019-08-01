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
                v-show="transition.step === 3 || transition.step === 4"
            >
                <iv-auto-card
                    :visible="true"
                    :label="transition.step === 3  ?_('w_RuleAndActions_RuleAdd') : _('w_RuleAndActions_RuleEdit')  "
                >

                    <template #toolbox>
                        <iv-toolbox-back @click="pageToList()" />
                    </template>

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
                                :interface="IConditionForm()"
                                @submit="stepTo3($event)"
                            >

                                <template #conditionTitle="{ $attrs, $listeners }">
                                    <div class="ml-3 mb-2 w-100">{{ _('w_RuleAndActions_Condition') }}</div>
                                </template>

                                <template #conditionContent="{ $attrs, $listeners }">
                                    <b-form-group class="col-md-12">
                                        <b-row>
                                            <b-col class="col-md-5">
                                                <iv-form-selection
                                                    v-model="condition.ruleMode"
                                                    :plain="true"
                                                    :disabled="disableConditionRuleMode()"
                                                    :options="selectItem.ruleMode"
                                                ></iv-form-selection>
                                            </b-col>

                                            <b-col class="col-md-2">
                                                <iv-form-selection
                                                    v-model="condition.equalMode"
                                                    :plain="true"
                                                    :disabled="disabledCondition()"
                                                    :options="selectItem.equalMode"
                                                ></iv-form-selection>
                                            </b-col>

                                            <b-col class="col-md-2">
                                                <iv-form-number
                                                    v-model="condition.fillValue"
                                                    min="0"
                                                    :plain="true"
                                                    :disabled="disabledCondition()"
                                                ></iv-form-number>
                                            </b-col>

                                            <b-col class="col-md-2">
                                                <iv-form-selection
                                                    v-model="condition.andMode"
                                                    :plain="true"
                                                    :disabled="disabledCondition()"
                                                    :options="selectItem.andMode"
                                                ></iv-form-selection>
                                            </b-col>

                                            <b-col class="col-md-1">
                                                <b-button
                                                    v-if="!disabledCondition()"
                                                    class="button addButton"
                                                    variant="success"
                                                    type="button"
                                                    @click="addCondition()"
                                                >
                                                    <i class="fa fa-plus"></i>
                                                </b-button>
                                            </b-col>
                                        </b-row>

                                        <b-row
                                            v-for="(value, index) in inputFormData.conditions"
                                            :key="'condition__' + index"
                                        >
                                            <b-col class="col-md-11">{{ conditionText(index) }}</b-col>
                                            <b-col class="col-md-1">
                                                <b-button
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

                            <iv-form
                                :interface="IStep3()"
                                :value="inputFormData"
                                @submit="doSubmit($event)"
                            >
                                <template #step3>
                                    <actions
                                        class="col-md-12"
                                        @notify-method="receiveNotifyMethod"
                                        @notify-target="receiveNotifyTarget"
                                        @user-ids="receiveUserIds"
                                        @user-group-ids="receiveUserGroupIds"
                                        @minutes="receiveMinutes"
                                    ></actions>
                                </template>

                            </iv-form>

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
import RuleActionsService from "@/services/RuleActions";

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

    isSelected: any = [];
    tableMultiple: boolean = true;
    selectedDetail: any = [];

    // choose-metrics 使用
    deviceMode: string = EDeviceMode.peopleCounting;

    inputFormData: any = {
        // choose-metrics
        name: "",
        active: "",
        siteIds: [],
        areaIds: [],
        deviceGroupIds: [],
        deviceIds: [],

        // conditions
        conditions: [],

        // actions
        notifyMethod: [],
        notifyTarget: [],
        userIds: [],
        userGroupIds: [],
        minutes: 0
    };

    ////////////////////////////////// Morris Start //////////////////////////////////

    condition: ICondition = {
        fillValue: 0,
        ruleMode: ERuleMode.trafficSingleSiteToday,
        equalMode: EEqualMode.more,
        andMode: EAndMode.and
    };

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

    conditionText(index: number): string {
        let result: string = "";
        result += RuleActionsService.ruleModeText(
            this,
            this.inputFormData.conditions[index].ruleMode
        );
        result += " ";
        result += RuleActionsService.equalModeText(
            this,
            this.inputFormData.conditions[index].equalMode
        );
        result += " ";
        result += this.inputFormData.conditions[index].fillValue.toString();
        result += " ";
        result += RuleActionsService.andModeText(
            this,
            this.inputFormData.conditions[index].andMode
        );
        return result;
    }

    clearConditions() {
        this.inputFormData.conditions = [];
         switch (this.siteCountMode) {
            case ESiteCountMode.single:
                this.selectItem.ruleMode = JSON.parse(
                    JSON.stringify(this.selectItem.ruleModeSingle)
                );
                this.condition.ruleMode = ERuleMode.trafficSingleSiteToday;
                break;
            case ESiteCountMode.multiple:
                this.selectItem.ruleMode = JSON.parse(
                    JSON.stringify(this.selectItem.ruleModeMutliple)
                );
                this.condition.ruleMode = ERuleMode.trafficMultipleSiteToday;
                break;
        }
        this.condition.equalMode = EEqualMode.more;
        this.condition.fillValue = 0;
        this.condition.andMode = EAndMode.and;
    }

    addCondition() {
        if (this.condition.ruleMode == ERuleMode.none) {
            return false;
        }

        if (this.condition.equalMode == EEqualMode.none) {
            return false;
        }

        if (this.condition.andMode == EAndMode.none) {
            return false;
        }

        let tempCondition: ICondition = JSON.parse(
            JSON.stringify(this.condition)
        );
        this.inputFormData.conditions.push(tempCondition);
        this.resetCondition();
    }

    removeCondition(index: number) {
        this.inputFormData.conditions.splice(index, 1);
        this.resetCondition();
    }

    resetCondition() {
        for (let tempCondition of this.inputFormData.conditions) {
            switch (tempCondition.ruleMode) {
                case ERuleMode.trafficSingleSiteToday:
                    this.condition.ruleMode = ERuleMode.trafficSingleSiteCurrent;
                    break;
                case ERuleMode.trafficSingleSiteCurrent:
                    this.condition.ruleMode = ERuleMode.trafficSingleSiteToday;
                    break;
                case ERuleMode.trafficMultipleSiteToday:
                    this.condition.ruleMode = ERuleMode.trafficMultipleSiteCurrent;
                    break;
                case ERuleMode.trafficMultipleSiteCurrent:
                    this.condition.ruleMode = ERuleMode.trafficMultipleSiteToday;
                    break;
            }
        }
        this.condition.equalMode = EEqualMode.more;
        this.condition.fillValue = 0;
        this.condition.andMode = EAndMode.and;
    }

    stepTo3(event: any) {
        console.log(this.inputFormData.conditions);
    }

    disableConditionRuleMode(): boolean {
        let result = false;
        if (this.inputFormData.conditions.length > 0) {
            result = true;
        }
        return result;
    }

    disabledCondition(): boolean {
        let result = false;
        if (this.inputFormData.conditions.length > 1) {
            result = true;
        }
        return result;
    }

    ////////////////////////////////// Morris End //////////////////////////////////

    created() {
        this.initSelectItem();
    }

    mounted() {}

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        (this.$refs.listTable as any).reload();
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;

        // TODO: ESiteCountMode from step 1
        this.siteCountMode = ESiteCountMode.single;
        this.clearConditions();
    }

    pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;

        // TODO: ESiteCountMode from step 1
        this.siteCountMode = ESiteCountMode.single;
        this.clearConditions();
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

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    ////////////////////  Tina start  以下資料來自 step1 choose-metrics   ////////////////////
    receiveName(name: string) {
        this.inputFormData.name = name;
        console.log("name ~ ", this.inputFormData.name);
    }

    receiveActive(active: string) {
        this.inputFormData.active = active;
        console.log("active ~ ", this.inputFormData.active);
    }

    receiveSiteIds(siteIds: object) {
        this.inputFormData.siteIds = siteIds;
        console.log("siteIds ~ ", this.inputFormData.siteIds);
    }

    receiveAreaIds(areaIds: object) {
        this.inputFormData.areaIds = areaIds;
        console.log("areaIds ~ ", this.inputFormData.areaIds);
    }

    receiveDeviceGroupIds(deviceGroupIds: object) {
        this.inputFormData.deviceGroupIds = deviceGroupIds;
        console.log("deviceGroupIds ~ ", this.inputFormData.deviceGroupIds);
    }

    receiveDeviceIds(deviceIds: object) {
        this.inputFormData.deviceIds = deviceIds;
        console.log("deviceIds ~ ", this.inputFormData.deviceIds);
    }
    ////////////////////  以上資料來自 step1 choose-metrics   ////////////////////

    ////////////////////  以下資料來自 step3 Actions   ////////////////////
    receiveNotifyMethod(notifyMethod: string) {
        this.inputFormData.notifyMethod = notifyMethod;
        console.log("notifyMethod ~ ", this.inputFormData.notifyMethod);
    }

    receiveNotifyTarget(notifyTarget: object) {
        this.inputFormData.notifyTarget = notifyTarget;
        console.log("notifyTarget ~ ", this.inputFormData.notifyTarget);
    }

    receiveUserIds(userIds: object) {
        this.inputFormData.userIds = userIds;
        console.log("userIds ~ ", this.inputFormData.userIds);
    }

    receiveUserGroupIds(userGroupIds: object) {
        this.inputFormData.userGroupIds = userGroupIds;
        console.log("userGroupIds ~ ", this.inputFormData.userGroupIds);
    }

    receiveMinutes(minutes: number) {
        this.inputFormData.minutes = minutes;
        console.log("minutes ~ ", this.inputFormData.minutes);
    }

    IStep3() {
        return `
            interface {
                step3?: any;
            }`;
    }

    //////////////////// Tina end 以上資料來自 step3 Actions   ////////////////////

    doSubmit(data) {
        console.log('data ~ ', data);
        console.log('this.inputFormData ~ ', this.inputFormData);
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {

                let deleteParam: {
                    objectId: any;
                } = {
                    objectId: []
                };

                for (const param of this.selectedDetail) {
                    deleteParam.objectId.push(param.objectId);
                }

                Loading.show();

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

    IConditionForm() {
        return `
            interface {
                conditionTitle?: any;
                conditionContent?: any;
            }`;
    }
}
</script>

<style lang="scss" scoped>
</style>




