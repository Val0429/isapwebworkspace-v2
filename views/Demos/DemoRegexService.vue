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
import RegexServices from "@/services/RegexServices";

enum ERemeberMe {
    rememberMe = "rememberMe",
    noRemeberMe = "noRemeberMe"
}

@Component({
    components: {}
})
export default class DemoRegexServices extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    created() {
        this.testingRegex();
    }

    mounted() {}

    testingRegex() {
        let testingItem = {
            a: 234234,
            b: true,
            c: "#G$#Gbag wer4 4eg ",
            d: new Date(),
            e: ERemeberMe
        };
        testingItem = RegexServices.trim(testingItem);
        console.log(testingItem);
    }
}
</script>

<style lang="scss" scoped>
</style>




