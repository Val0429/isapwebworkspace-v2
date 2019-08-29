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

                    <choose-metrics
                        :disabled="true"
                        :deviceMode="deviceMode"
                        @name="receiveName"
                        @active="receiveActive"
                        @site-ids="receiveSiteIds"
                        @area-ids="receiveAreaIds"
                        @device-group-ids="receiveDeviceGroupIds"
                        @device-ids="receiveDeviceIds"
                    ></choose-metrics>

                    <iv-form :interface="IConditionForm()">

                        <template #conditionTitle="{ $attrs, $listeners }">
                            <div class="ml-3 mb-2 w-100">{{ _('w_RuleAndActions_Condition') }}</div>
                        </template>

                        <template #conditionContent="{ $attrs, $listeners }">
                            <b-form-group class="col-md-12">

                                <b-row
                                    v-for="(value, index) in inputFormData.conditions"
                                    :key="'condition__' + index"
                                >
                                    <b-col class="col-md-11">{{ conditionText(index) }}</b-col>
                                    <b-col class="col-md-1">
                                    </b-col>
                                </b-row>
                            </b-form-group>
                        </template>
                    </iv-form>

                    <actions
                        class="col-md-12"
                        @email="receiveEmail"
                        @store-manager="receiveStoreManager"
                        @permission-of-store="receivePermissionOfStore"
                        @user-ids="receiveUserIds"
                        @user-group-ids="receiveUserGroupIds"
                        @minutes="receiveMinutes"
                    ></actions>
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
                v-if="transition.step === 3 || transition.step === 4"
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

                            <iv-form
                                :interface="IStep1()"
                                :value="inputFormData"
                                @submit="stepTo2($event)"
                            >
                                <template #step1>
                                    <choose-metrics
                                        :deviceMode="deviceMode"
                                        class="col-md-12"
                                        @name="receiveName"
                                        @active="receiveActive"
                                        @time="receiveTime"
                                        @site-ids="receiveSiteIds"
                                        @area-ids="receiveAreaIds"
                                        @device-group-ids="receiveDeviceGroupIds"
                                        @device-ids="receiveDeviceIds"
                                    ></choose-metrics>
                                </template>

                            </iv-form>
                        </template>

                        <template #2-title>{{ _('w_RuleAndActions_EditStep2') }}</template>
                        <template #2>

                            <iv-form
                                :interface="IConditionForm()"
                                :value="inputFormData"
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
                                        <b-row>
                                            <b-col class="col-md-5">
                                                <iv-form-selection
                                                    v-model="condition.ruleMode"
                                                    :disabled="true"
                                                    :plain="true"
                                                    :options="selectItem.ruleMode"
                                                ></iv-form-selection>
                                            </b-col>

                                            <b-col class="col-md-2">
                                                <iv-form-selection
                                                    v-model="condition.equalMode"
                                                    :disabled="true"
                                                    :plain="true"
                                                    :options="selectItem.equalMode"
                                                ></iv-form-selection>
                                            </b-col>

                                            <b-col class="col-md-2">
                                                <iv-form-selection
                                                    v-if="isConditionItem"
                                                    v-model="condition.thresholdMode"
                                                    :disabled="disabledCondition()"
                                                    :plain="true"
                                                    :options="selectItem.thresholdMode"
                                                ></iv-form-selection>
                                            </b-col>

                                            <b-col class="col-md-2">
                                                <iv-form-selection
                                                    v-model="condition.andMode"
                                                    :disabled="true"
                                                    :plain="true"
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
                                        @email="receiveEmail"
                                        @store-manager="receiveStoreManager"
                                        @permission-of-store="receivePermissionOfStore"
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
    EAndMode,
    EThresholdMode
} from "@/components/RuleAndActions";

// Service
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import RuleActionsService from "@/services/RuleActions";

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
        active: undefined,
        time: undefined,
        siteIds: [],
        areaIds: [],
        deviceGroupIds: [],
        deviceIds: [],

        // conditions
        thresholdHigh: 0,
        thresholdMedium: 0,
        thresholdLow: 0,
        conditions: [],

        // actions
        email: undefined,
        storeManager: undefined,
        permissionOfStore: undefined,
        userIds: [],
        userGroupIds: [],
        minutes: 0
    };

    ////////////////////////////////// Morris Start //////////////////////////////////

    isConditionItem = true;
    condition: ICondition = {
        ruleMode: ERuleMode.occupancySingleSite,
        equalMode: EEqualMode.more,
        andMode: EAndMode.or,
        thresholdMode: EThresholdMode.high
    };

    siteCountMode: ESiteCountMode = ESiteCountMode.single;
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
        this.clearConditions();
    }

    pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.clearConditions();
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
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

    ////////////////////  Tina start  以下資料來自 step1 choose-metrics   ////////////////////
    receiveName(name: string) {
        this.inputFormData.name = name;
    }

    receiveActive(active: string) {
        this.inputFormData.active = active === "true";
    }

    receiveSiteIds(siteIds: string[]) {
        this.inputFormData.siteIds = siteIds;
    }

    receiveAreaIds(areaIds: string[]) {
        this.inputFormData.areaIds = areaIds;
    }

    receiveDeviceGroupIds(deviceGroupIds: string[]) {
        this.inputFormData.deviceGroupIds = deviceGroupIds;
    }

    receiveDeviceIds(deviceIds: string[]) {
        this.inputFormData.deviceIds = deviceIds;
    }

    receiveTime(time: undefined | object) {
        this.inputFormData.time = time;
    }

    ////////////////////  以上資料來自 step1 choose-metrics   ////////////////////

    stepTo2(data) {
        let stepRef: any = this.$refs.step;

        if (
            !this.inputFormData.name ||
            this.inputFormData.active === undefined
        ) {
            Dialog.error(this._("w_RuleAndActions_ErrorTip"));
            stepRef.currentStep = 0;
            return false;
        }

        if (this.inputFormData.siteIds.length === 1) {
            this.siteCountMode = ESiteCountMode.single;
        } else if (this.inputFormData.siteIds.length > 2) {
            this.siteCountMode = ESiteCountMode.multiple;
        } else {
            Dialog.error(this._("w_RuleAndActions_ErrorTip"));
            stepRef.currentStep = 0;
            return false;
        }
        this.clearConditions();
    }

    IStep1() {
        return `
            interface {
                step1?: any;
            }`;
    }

    ////////////////////  以上資料來自 step1 choose-metrics   ////////////////////

    ////////////////////////////////// Step 2 Start //////////////////////////////////

    clearConditions() {
        this.initSelectItem();
        this.inputFormData.thresholdHigh = 0;
        this.inputFormData.thresholdMedium = 0;
        this.inputFormData.thresholdLow = 0;
        this.inputFormData.conditions = [];
        switch (this.siteCountMode) {
            case ESiteCountMode.single:
                this.selectItem.ruleMode = JSON.parse(
                    JSON.stringify(this.selectItem.ruleModeSingle)
                );
                this.condition.ruleMode = ERuleMode.occupancySingleSite;
                break;
            case ESiteCountMode.multiple:
                this.selectItem.ruleMode = JSON.parse(
                    JSON.stringify(this.selectItem.ruleModeMutliple)
                );
                this.condition.ruleMode = ERuleMode.occupancyMultipleSite;
                break;
        }
        this.condition.equalMode = EEqualMode.more;
        this.condition.andMode = EAndMode.or;
        this.condition.thresholdMode = EThresholdMode.high;
    }

    updateCondition(data: any) {
        switch (data.key) {
            case "thresholdHigh":
                this.inputFormData.thresholdHigh = data.value;
                break;
            case "thresholdMedium":
                this.inputFormData.thresholdMedium = data.value;
                break;
            case "thresholdLow":
                this.inputFormData.thresholdLow = data.value;
                break;
        }
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

        if (this.condition.thresholdMode == EThresholdMode.none) {
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
        this.isConditionItem = false;
        let haveHigh = false;
        let haveMedium = false;
        let haveLow = false;
        switch (this.siteCountMode) {
            case ESiteCountMode.single:
                this.condition.ruleMode = ERuleMode.occupancySingleSite;
                break;
            case ESiteCountMode.multiple:
                this.condition.ruleMode = ERuleMode.occupancyMultipleSite;
                break;
        }
        this.condition.equalMode = EEqualMode.more;
        this.condition.andMode = EAndMode.or;
        this.condition.thresholdMode = EThresholdMode.high;
        for (let tempValue of this.inputFormData.conditions) {
            switch (tempValue.thresholdMode) {
                case EThresholdMode.high:
                    haveHigh = true;
                    break;
                case EThresholdMode.medium:
                    haveMedium = true;
                    break;
                case EThresholdMode.low:
                    haveLow = true;
                    break;
            }
        }

        this.selectItem.thresholdMode = [];

        if (!haveHigh) {
            this.selectItem.thresholdMode.push({
                id: EThresholdMode.high,
                text: this._("w_RuleAndActions_ThresholdStatusHigh")
            });
        }

        if (!haveMedium) {
            this.selectItem.thresholdMode.push({
                id: EThresholdMode.medium,
                text: this._("w_RuleAndActions_ThresholdStatusMedium")
            });
        }

        if (!haveLow) {
            this.selectItem.thresholdMode.push({
                id: EThresholdMode.low,
                text: this._("w_RuleAndActions_ThresholdStatusLow")
            });
        }

        if (this.selectItem.thresholdMode[0] != undefined) {
            switch (this.selectItem.thresholdMode[0].id) {
                case "high":
                    this.condition.thresholdMode = EThresholdMode.high;
                    break;
                case "medium":
                    this.condition.thresholdMode = EThresholdMode.medium;
                    break;
                case "low":
                    this.condition.thresholdMode = EThresholdMode.low;
                    break;
            }
        }

        // Morris: Need reset selection in Vue
        setTimeout(() => {
            this.isConditionItem = true;
        }, 10);
    }

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
        result += RuleActionsService.thresholdModeText(
            this,
            this.inputFormData.conditions[index].thresholdMode
        );
        result += " ";
        result += RuleActionsService.andModeText(
            this,
            this.inputFormData.conditions[index].andMode
        );
        return result;
    }

    disabledCondition(): boolean {
        let result = false;
        if (this.inputFormData.conditions.length > 2) {
            result = true;
        }
        return result;
    }

    stepTo3(event: any) {
        console.log(this.inputFormData.conditions);
    }

    ////////////////////////////////// Step 2 End //////////////////////////////////

    ////////////////////  以下資料來自 step3 Actions   ////////////////////
    receiveEmail(email: boolean) {
        this.inputFormData.email = email;
    }

    receiveStoreManager(storeManager: boolean) {
        this.inputFormData.storeManager = storeManager;
    }

    receivePermissionOfStore(permissionOfStore: boolean) {
        this.inputFormData.permissionOfStore = permissionOfStore;
    }

    receiveUserIds(userIds: object) {
        this.inputFormData.userIds = userIds;
    }

    receiveUserGroupIds(userGroupIds: object) {
        this.inputFormData.userGroupIds = userGroupIds;
    }

    receiveMinutes(minutes: number) {
        this.inputFormData.minutes = minutes;
    }

    IStep3() {
        return `
            interface {
                step3?: any;
            }`;
    }

    //////////////////// Tina end 以上資料來自 step3 Actions   ////////////////////

    doSubmit(data) {

        let param = JSON.parse(JSON.stringify(this.inputFormData));

        this.pageToList();
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

    IConditionForm() {
        return `
            interface {

                thresholdeTitle?: any;

                /**
                 * @uiLabel - ${this._(
                     "w_RuleAndActions_OccupancyThresholdHigh"
                 )}
                 * @uiAttrs - { min: 0 }
                 * @uiDisabled - ${this.transition.step === 2}
                 */
                thresholdHigh: number;

                /**
                 * @uiLabel - ${this._(
                     "w_RuleAndActions_OccupancyThresholdMedium"
                 )}
                 * @uiAttrs - { min: 0 }
                 * @uiDisabled - ${this.transition.step === 2}
                 */
                thresholdMedium: number;

                /**
                 * @uiLabel - ${this._(
                     "w_RuleAndActions_OccupancyThresholdLow"
                 )}
                 * @uiAttrs - { min: 0 }
                 * @uiDisabled - ${this.transition.step === 2}
                 */
                thresholdLow: number;

                conditionTitle?: any;

                conditionContent?: any;
            }`;
    }
}
</script>

<style lang="scss" scoped>
</style>




