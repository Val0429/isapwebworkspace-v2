<template>
    <div>

        <div class="col-md-12 mt-3"> {{ _('w_ViewPTW_Step1_content') }} </div>

        <div class="row justify-content-center align-items-center mt-3 font-weight-bold" >
            <b-form-checkbox
                v-model="pdpaAccepted"
                name="status"
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
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";

@Component({
    components: {}
})
export class Step1 extends Vue {
    // Prop
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {}
    })
    selectedDetail: any;

    pdpaAccepted: boolean = this.selectedDetail.pdpaAccepted ? this.selectedDetail.pdpaAccepted : false;

    created() {
    }

    mounted() {
    }

    @Watch("selectedDetail", { deep: true })
    private ptwIdChanged(newVal, oldVal) {
        this.initInputFormData();
    }

    initInputFormData() {
        this.pdpaAccepted = this.selectedDetail.pdpaAccepted;
        console.log('Step1', this.pdpaAccepted)
    }

    changeStatus() {
        this.$emit('step1', this.pdpaAccepted)
    }

}

export default Step1;
Vue.component("step1", Step1);
</script>

<style lang="scss" scoped>
</style>
