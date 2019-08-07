<template>
    <div>

        <div class="col-md-12 mt-3"> {{ _('w_ViewPTW_Step6_TermsConditionsInfo') }} </div>
        <div class="col-md-12 mt-3"> {{ _('w_ViewPTW_Step6_1') }} </div>
        <div class="col-md-12 mt-3"> {{ _('w_ViewPTW_Step6_2') }} </div>
        <div class="col-md-12 mt-3"> {{ _('w_ViewPTW_Step6_3') }} </div>
        <div class="col-md-12 mt-3"> {{ _('w_ViewPTW_Step6_4') }} </div>
        <div class="col-md-12 mt-3"> {{ _('w_ViewPTW_Step6_5') }} </div>
        <div class="col-md-12 mt-3"> {{ _('w_ViewPTW_Step6_6') }} </div>
        <div class="col-md-12 mt-3"> {{ _('w_ViewPTW_Step6_7') }} </div>

        <div class="row justify-content-center align-items-center mt-3 font-weight-bold">
            <b-form-checkbox
                v-model="isAccepted"
                name="status"
                value="accepted"
                unchecked-value="not_accepted"
                @input="changeStatus"
            >
                {{ _('w_ViewPTW_Step1_agreement') }}
            </b-form-checkbox>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

@Component({
    components: {}
})
export class Step6 extends Vue {
    // Prop

    isAccepted: string = "not_accepted";

    created() {}

    mounted() {}

    changeStatus() {
        this.$emit("step6", this.isAccepted);
    }
}

export default Step6;
Vue.component("step6", Step6);
</script>

<style lang="scss" scoped>
.font-red {
    color: red;
}
</style>
