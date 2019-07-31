<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <div
                key="transition_1"
                v-show="transition.step === 1"
                :label="'Empty 1'"
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

            <iv-step-progress
                ref="step"
                key="transition_2"
                v-show="transition.step === 2"
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
                    Step 2
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

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import { EDeviceMode } from '@/components/Reports';

@Component({
    components: {}
})
export default class RuleAndActionsOccupancy extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    isSelected: any = [];
    tableMultiple: boolean = true;
    selectedDetail: any = [];

    isMounted: boolean = false;

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

    doMounted() {
        this.isMounted = true;
    }

    created() {}

    mounted() {}

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
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
}
</script>

<style lang="scss" scoped>
</style>




