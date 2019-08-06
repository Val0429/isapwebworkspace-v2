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
                <welcome @createWork="pageToStep2"></welcome>
            </div>
            <div
                key="transition_2"
                v-show="transition.step === 2"
            >
                <not-found></not-found>
            </div>
            <div
                key="transition_3"
                v-show="transition.step === 3"
            >
                <add-ptw-by-cr :selectedDetail="selectedDetail"></add-ptw-by-cr>
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
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import Datetime from "@/services/Datetime";

//components
import NotFound from "./NotFound.vue";
import Welcome from "./Welcome.vue";
import AddPTWByCR from "./AddPTWByCR.vue";

// Export
import toExcel from "@/services/Excel/json2excel";

@Component({
    components: { AddPTWByCR, NotFound, Welcome }
})
export default class ContractorRegistration extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    // table相關
    path: string = "";
    isSelected: any = [];
    tableMultiple: boolean = true;
    selectedDetail: any = {};

    // api 回來資料
    responseData: any = {};

    inputFormData: any = {
        objectId: "",
        name: "",
        email: "",
        tenant: "",
        workDescription: ""
    };

    created() {}

    mounted() {}

    pageToStep2() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    dateToYYYY_MM_DD(value) {
        return Datetime.DateTime2String(new Date(value), "YYYY-MM-DD");
    }
}
</script>

<style lang="scss" scoped>
</style>




