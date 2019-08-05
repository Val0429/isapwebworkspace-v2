<template>
    <div>

        <div class="col-md-12 mt-3"> {{ _('w_ViewPTW_Step1_content') }} </div>

        <div class="row justify-content-center align-items-center mt-3 font-weight-bold" >
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
export class Step1 extends Vue {
    // Prop

    isAccepted:string = 'not_accepted';

    created() {}

    mounted() {}

    changeStatus() {
        this.$emit('step1', this.isAccepted)
    }

}

export default Step1;
Vue.component("step1", Step1);
</script>

<style lang="scss" scoped>
</style>
