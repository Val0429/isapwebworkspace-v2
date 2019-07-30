<template>
    <div class="animated fadeIn">

        <choose-metrics :deviceMode="deviceMode"></choose-metrics>

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

            <!-- add & edit -->
            <div
                key="transition_2"
                v-show="transition.step === 2"
                :label="'Empty 2'"
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
                            <choose-metrics :deviceMode="deviceMode"></choose-metrics>
                        </template>

                        <template #2-title>{{ _('w_RuleAndActions_EditStep2') }}</template>
                        <template #2>
                            Step 2
                        </template>

                        <template #3-title>{{ _('w_RuleAndActions_EditStep3') }}</template>
                        <template #3>
                            Step 3
                        </template>

                    </iv-step-progress>

                </iv-auto-card>
            </div>

            <!-- view -->
            <div
                key="transition_3"
                v-show="transition.step === 3"
                :label="'Empty 3'"
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
import { EDeviceMode } from "@/components/Reports";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";

interface IStep2Data {
    ruleMode: string;
    equalMode: string;
    fillValue: number;
    andMode: string;
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

    deviceMode: string = EDeviceMode.peopleCounting;
    step2Item: any = {
        condition: []
    };
    step2Datas: IStep2Data[] = [];

    isMounted: boolean = false;
    isSelected: any = [];
    tableMultiple: boolean = true;
    selectedDetail: any = [];
    inputFormData: any = {};

    doMounted() {
        this.isMounted = true;
    }

    created() {}

    mounted() {
        // TODO: Developer
        this.transition.step = 2;
        let stepRef: any = this.$refs.step;
        stepRef.currentStep = 2;
    }

    IStep2() {
        return `
            interface {
                title?: any;
                condition?: any;
            }`;
    }

    pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
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
                    //         for (const returnValue of response) {
                    //             if (returnValue.statusCode === 200) {
                    //                 this.pageToList();
                    //             }
                    //             if (returnValue.statusCode === 500) {
                    //                 Dialog.error(this._("w_DeleteFailed"));
                    //                 return false;
                    //             }
                    //         }
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




