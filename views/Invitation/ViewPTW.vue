<template>
    <div class="animated fadeIn">

        <iv-auto-card
            :label="_('w_ViewPTW_StepTitle')  "
        >
            <iv-step-progress
                ref="step"
                @mounted="doMounted"
            >

                <template #1-title>{{ _('w_ViewPTW_Step1_PDPAAgreement_Title') }}</template>
                <template #1>

                    <iv-form
                        :interface="IStep1()"
                        :value="inputFormData"
                        @submit="stepTo2($event)"
                    >
                        <template #step1>
                            <step1
                                @isAccepted="receiveAccepted"
                            ></step1>
                        </template>

                    </iv-form>
                </template>


                <template #2-title>{{ _('w_ViewPTW_Step2_ContractorTitle') }}</template>
                <template #2>

                    <iv-form
                        :interface="IStep2()"
                        :value="inputFormData"
                        @submit="stepTo3($event)"
                    >
                        <template #step2>

                        </template>

                    </iv-form>
                </template>


                <template #3-title>{{ _('') }}</template>
                <template #3>

                    <iv-form
                        :interface="IStep3()"
                        :value="inputFormData"
                        @submit="stepTo4($event)"
                    >
                        <template #step3>

                        </template>

                    </iv-form>
                </template>

                <template #4-title>{{ _('') }}</template>
                <template #4>

                    <iv-form
                        :interface="IStep4()"
                        :value="inputFormData"
                        @submit="stepTo5($event)"
                    >
                        <template #step4>

                        </template>

                    </iv-form>
                </template>


                <template #5-title>{{ _('') }}</template>
                <template #5>

                    <iv-form
                        :interface="IStep5()"
                        :value="inputFormData"
                        @submit="stepTo6($event)"
                    >
                        <template #step5>

                        </template>

                    </iv-form>
                </template>


                <template #6-title>{{ _('') }}</template>
                <template #6>

                    <iv-form
                        :interface="IStep6()"
                        :value="inputFormData"
                        @submit="stepTo7($event)"
                    >
                        <template #step6>

                        </template>

                    </iv-form>
                </template>


                <template #7-title>{{ _('') }}</template>
                <template #7>

                    <iv-form
                        :interface="IStep7()"
                        :value="inputFormData"
                        @submit="doSubmit($event)"
                    >
                        <template #step7>

                        </template>

                    </iv-form>
                </template>


            </iv-step-progress>

        </iv-auto-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Step1 from "@/components/ContractorRegistration/Step1.vue";

// Service
import Dialog from "@/services/Dialog";

@Component({
    components: { Step1 }
})
export class ViewPTW extends Vue {

    // step 相關
    isMounted: boolean = false;
    doMounted() {
        this.isMounted = true;
    }

    inputFormData: any = {
        accepted: '',
    };

    created() {}

    mounted() {}

    ////////////////////////////// step 1  //////////////////////////////

    receiveAccepted(accepted) {
        this.inputFormData.accepted = accepted;
        console.log(' ~ ', this.inputFormData.accepted)
    }

    stepTo2() {
        let stepRef: any = this.$refs.step;

        if (!this.inputFormData.accepted) {
            Dialog.error(this._("w_ViewPTW_Step1_ErrorTip"));
            stepRef.currentStep = 0;
            return false;
        }
    }

    IStep1() {
        return `
            interface {
                step1?: any;
            }`;
    }

    ////////////////////////////// step 1  //////////////////////////////


    stepTo3() {}

    stepTo4() {}

    stepTo5() {}

    stepTo6() {}

    stepTo7() {}

    doSubmit() {}

    IStep2() {
        return `
            interface {
                step2?: any;
            }`;
    }

    IStep3() {
        return `
            interface {
                step3?: any;
            }`;
    }

    IStep4() {
        return `
            interface {
                step4?: any;
            }`;
    }

    IStep5() {
        return `
            interface {
                step5?: any;
            }`;
    }

    IStep6() {
        return `
            interface {
                step6?: any;
            }`;
    }

    IStep7() {
        return `
            interface {
                step7?: any;
            }`;
    }
}


export default ViewPTW;
Vue.component("view-ptw", ViewPTW);
</script>

<style lang="scss" scoped>
</style>




