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
                        :server="{ path: '/rule/humanDetecation' }"
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
            <!-- <div
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
            </div> -->

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
                                :interface="IStep2()"
                                :value="step2Item"
                                @submit="stepTo3($event)"
                                @update:*="updateCondition"
                            >

                                <template #thresholdeTitle="{ $attrs, $listeners }">
                                    <div class="ml-3 mb-2 w-100">{{ _('w_RuleAndActions_OccupancyThreshold') }}</div>
                                </template>

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
                                                    :disabled="true"
                                                    :plain="true"
                                                    :options="selectItem.ruleMode"
                                                ></iv-form-selection>
                                            </b-col>

                                            <b-col class="col-md-2">
                                                <iv-form-selection
                                                    v-model="conditions[index].equalMode"
                                                    :disabled="true"
                                                    :plain="true"
                                                    :options="selectItem.equalMode"
                                                ></iv-form-selection>
                                            </b-col>

                                            <b-col class="col-md-2">
                                                <iv-form-selection
                                                    v-model="conditions[index].thresholdMode"
                                                    :plain="true"
                                                    :options="selectItem.thresholdMode"
                                                ></iv-form-selection>
                                            </b-col>

                                            <b-col class="col-md-2">
                                                <iv-form-selection
                                                    v-model="conditions[index].andMode"
                                                    :disabled="true"
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
    EAndMode,
    EThresholdMode
} from "@/components/RuleAndActions";

// Service
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";

interface ICondition {
    ruleMode: ERuleMode;
    equalMode: EEqualMode;
    andMode: EAndMode;
    thresholdMode: EThresholdMode;
}

@Component({
    components: {}
})
export default class RuleAndActionsOccupancy extends Vue {
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
    deviceMode: string = EDeviceMode.humanDetection;

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
        thresholdHigh: 0,
        thresholdMedium: 0,
        thresholdLow: 0,
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
        thresholdMode: IValSelectItem[];
    } = {
        ruleMode: [],
        ruleModeSingle: [],
        ruleModeMutliple: [],
        equalMode: [],
        andMode: [],
        thresholdMode: []
    };

    clearConditions() {
        this.step2Item.thresholdHigh = 0;
        this.step2Item.thresholdMedium = 0;
        this.step2Item.thresholdLow = 0;
        this.conditions = [];
        this.addCondition();
    }

    updateCondition(data: any) {
        switch (data.key) {
            case "thresholdHigh":
                this.step2Item.thresholdHigh = data.value;
                break;
            case "thresholdMedium":
                this.step2Item.thresholdMedium = data.value;
                break;
            case "thresholdLow":
                this.step2Item.thresholdLow = data.value;
                break;
        }
    }

    addCondition() {
        let tempCondition: ICondition = {
            ruleMode: ERuleMode.occupancySingleSite,
            equalMode: EEqualMode.more,
            andMode: EAndMode.or,
            thresholdMode: EThresholdMode.high
        };

        switch (this.siteCountMode) {
            case ESiteCountMode.single:
                tempCondition.ruleMode = ERuleMode.occupancySingleSite;
                break;
            case ESiteCountMode.multiple:
                tempCondition.ruleMode = ERuleMode.occupancyMultipleSite;
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
                id: ERuleMode.occupancySingleSite,
                text: this._("w_RuleAndActions_RuleStatusOccupancySingleSite")
            }
        ];

        this.selectItem.ruleModeMutliple = [
            {
                id: ERuleMode.occupancyMultipleSite,
                text: this._("w_RuleAndActions_RuleStatusOccupancyMultipleSite")
            }
        ];

        this.selectItem.equalMode = [
            {
                id: EEqualMode.more,
                text: this._("w_RuleAndActions_EqualStatusMore")
            }
        ];

        this.selectItem.thresholdMode = [
            {
                id: EThresholdMode.high,
                text: this._("w_RuleAndActions_ThresholdStatusHigh")
            },
            {
                id: EThresholdMode.medium,
                text: this._("w_RuleAndActions_ThresholdStatusMedium")
            },
            {
                id: EThresholdMode.low,
                text: this._("w_RuleAndActions_ThresholdStatusLow")
            }
        ];

        this.selectItem.andMode = [
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

                thresholdeTitle?: any;

                /**
                 * @uiLabel - ${this._(
                     "w_RuleAndActions_OccupancyThresholdHigh"
                 )}
                 * @uiAttrs - { min: 0 }
                 */
                thresholdHigh: number;

                /**
                 * @uiLabel - ${this._(
                     "w_RuleAndActions_OccupancyThresholdMedium"
                 )}
                 * @uiAttrs - { min: 0 }
                 */
                thresholdMedium: number;

                /**
                 * @uiLabel - ${this._(
                     "w_RuleAndActions_OccupancyThresholdLow"
                 )}
                 * @uiAttrs - { min: 0 }
                 */
                thresholdLow: number;

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
}
</script>

<style lang="scss" scoped>
</style>




