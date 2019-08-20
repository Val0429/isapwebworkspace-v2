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

                <div>
                    This Year Start : {{ datetimeItem.yearStart }}
                </div>

                <div>
                    This Year End : {{ datetimeItem.yearEnd }}
                </div>

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
import Datetime from "@/services/Datetime";

@Component({
    components: {}
})
export default class DemoDatetimeServices extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    datetimeItem = {
        yearStart: new Date(),
        yearEnd: new Date()
    };

    created() {
        this.initDatetime();
    }

    mounted() {}

    initDatetime() {
        this.datetimeItem.yearStart = Datetime.YearStart(new Date());
        this.datetimeItem.yearEnd = Datetime.YearEnd(new Date());
    }
}
</script>

<style lang="scss" scoped>
</style>




