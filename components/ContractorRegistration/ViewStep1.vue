<template>
    <div>

        <div class="col-md-12 mt-3"> {{ _('w_ViewPTW_Step1_content') }} </div>

        <div class="row justify-content-center align-items-center mt-3 font-weight-bold" >
            <b-form-checkbox
                v-model="pdpaAccepted"
                name="status"
                :disabled="true"
                :value="true"
                :unchecked-value="false"
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
export class ViewStep1 extends Vue {
    // Prop
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {}
    })
    selectedDetail: object;

    pdpaAccepted: boolean = false;

    created() {
    }

    mounted() {}

    changeStatus() {
        this.$emit('step1', this.pdpaAccepted)
    }

}

export default ViewStep1;
Vue.component("view-step1", ViewStep1);
</script>

<style lang="scss" scoped>
</style>
