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
                Rule and Action Traffic 1
            </div>

            <iv-step-progress
                ref="step"
                key="transition_2"
                v-show="transition.step === 2"
                @mounted="doMounted"
            >

                <template #1-title>{{ _('w_RuleAndActions_EditStep1') }}</template>
                <template #1>
                    Step 1
                </template>

                <template #2-title>{{ _('w_RuleAndActions_EditStep2') }}</template>
                <template #2>

                    <iv-form
                        :interface="IStep2()"
                        :value="step2Item"
                        @submit="stepTo3($event)"
                    >

                        <template #title="{ $attrs, $listeners }">
                            <div class="ml-3 mb-2 w-100">{{ _('w_OfficeHour') }}</div>
                        </template>

                        <template #condition="{ $attrs, $listeners }">
                            <b-form-group class="ml-3">
                                <b-row
                                    v-for="(value, index) in step2Datas"
                                    :key="'officeHourTime__' + index"
                                >
                                    <b-col>
                                        <div>test</div>
                                    </b-col>
                                </b-row>
                            </b-form-group>
                        </template>

                    </iv-form>

                </template>

                <template #3-title>{{ _('w_RuleAndActions_EditStep3') }}</template>
                <template #3>
                    Step 3
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

    step2Item: any = {
        condition: []
    };
    step2Datas: IStep2Data[] = [];

    isMounted: boolean = false;
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
                condition?: any
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




