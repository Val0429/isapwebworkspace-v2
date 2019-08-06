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
                Welcome
            </div>

            <div
                key="transition_2"
                v-show="transition.step === 2"
            >
                PTW Not Found
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
import SearchCondition from "./SearchCondition.vue";
import AddPTW from "./AddPTW.vue";
import EditPTW from "./EditPTW.vue";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import Datetime from "@/services/Datetime";

// Export
import toExcel from "@/services/Excel/json2excel";

@Component({
    components: { SearchCondition, AddPTW, EditPTW }
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

    dateToYYYY_MM_DD(value) {
        return Datetime.DateTime2String(new Date(value), "YYYY-MM-DD");
    }
}
</script>

<style lang="scss" scoped>
</style>




