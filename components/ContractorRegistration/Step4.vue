<template>
    <div>
        <iv-form
            :interface="IAddForm()"
            :value="inputFormData"
        >

            <template #checklistTitle>
                <p class="col-md-6 mt-2">{{ _('w_ViewPTW_Step4_Item') }}</p>
                <p class="col-md-2 mb-2 mt-2">{{ _('w_ViewPTW_Step4_Answer') }}</p>
                <p class="col-md-4 mt-2">{{ _('w_ViewPTW_Step4_Remarks') }}</p>
            </template>

            <template #checklist1>
                <p class="col-md-6 mt-2">{{ _('w_ViewPTW_Step4_1') }}</p>
                <b-form-radio-group
                    v-model="inputFormData.checklist1"
                    :options="options"
                    name="checklist1"
                    class="col-md-2 mb-2 mt-2"
                    @input="changeChecklist1"
                ></b-form-radio-group>
                <iv-form-string
                    v-model="inputFormData.checklist1Remarks"
                    class="col-md-4 mt-2"
                    @input="changeChecklist1Remarks"
                >
                </iv-form-string>
                <hr>
            </template>

            <template #checklist2>
                <p class="col-md-6 mt-2">{{ _('w_ViewPTW_Step4_2') }}</p>
                <b-form-radio-group
                    v-model="inputFormData.checklist2"
                    :options="options"
                    name="checklist2"
                    class="col-md-2 mb-2 mt-2"
                    @input="changeChecklist2"
                ></b-form-radio-group>
                <iv-form-string
                    v-model="inputFormData.checklist2Remarks"
                    class="col-md-4 mt-2"
                    @input="changeChecklist2Remarks"
                >
                </iv-form-string>
                <hr>
            </template>

            <template #checklist3>
                <p class="col-md-6 mt-2">{{ _('w_ViewPTW_Step4_3') }}</p>
                <b-form-radio-group
                    v-model="inputFormData.checklist3"
                    :options="options"
                    name="checklist3"
                    class="col-md-2 mb-2 mt-2"
                    @input="changeChecklist3"
                ></b-form-radio-group>
                <iv-form-string
                    v-model="inputFormData.checklist3Remarks"
                    class="col-md-4 mt-2"
                    @input="changeChecklist3Remarks"
                >
                </iv-form-string>
                <hr>
            </template>

            <template #checklist4>
                <p class="col-md-6 mt-2">{{ _('w_ViewPTW_Step4_4') }}</p>
                <b-form-radio-group
                    v-model="inputFormData.checklist4"
                    :options="options"
                    name="checklist4"
                    class="col-md-2 mb-2 mt-2"
                    @input="changeChecklist4"
                ></b-form-radio-group>
                <iv-form-string
                    v-model="inputFormData.checklist4Remarks"
                    class="col-md-4 mt-2"
                    @input="changeChecklist4Remarks"
                >
                </iv-form-string>
                <hr>
            </template>

            <template #checklist5>
                <p class="col-md-6 mt-2">{{ _('w_ViewPTW_Step4_5') }}</p>
                <b-form-radio-group
                    v-model="inputFormData.checklist5"
                    :options="options"
                    name="checklist5"
                    class="col-md-2 mb-2 mt-2"
                    @input="changeChecklist5"
                ></b-form-radio-group>
                <iv-form-string
                    v-model="inputFormData.checklist5Remarks"
                    class="col-md-4 mt-2"
                    @input="changeChecklist5Remarks"
                >
                </iv-form-string>
                <hr>
            </template>

            <template #checklist6>
                <p class="col-md-6 mt-2">{{ _('w_ViewPTW_Step4_6') }}</p>
                <b-form-radio-group
                    v-model="inputFormData.checklist6"
                    :options="options"
                    name="checklist6"
                    class="col-md-2 mb-2 mt-2"
                    @input="changeChecklist6"
                ></b-form-radio-group>
                <iv-form-string
                    v-model="inputFormData.checklist6Remarks"
                    class="col-md-4 mt-2"
                    @input="changeChecklist6Remarks"
                >
                </iv-form-string>
                <hr>
            </template>

            <template #checklist7>
                <p class="col-md-6 mt-2">{{ _('w_ViewPTW_Step4_7') }}</p>
                <b-form-radio-group
                    v-model="inputFormData.checklist7"
                    :options="options"
                    name="checklist7"
                    class="col-md-2 mb-2 mt-2"
                    @input="changeChecklist7"
                ></b-form-radio-group>
                <iv-form-string
                    v-model="inputFormData.checklist1Remarks"
                    class="col-md-4 mt-2"
                    @input="changeChecklist7Remarks"
                >
                </iv-form-string>
                <hr>
            </template>

            <template #checklist8>
                <p class="col-md-10 mt-5">{{ _('w_ViewPTW_Step4_8') }}</p>
                <b-form-radio-group
                    v-model="inputFormData.checklist8"
                    :options="options"
                    name="checklist8"
                    class="col-md-2 mb-2 mt-5"
                    @input="changeChecklist8"
                ></b-form-radio-group>

            </template>

            <template #checklist9>
                <p class="col-md-10 mt-2">
                    <span>{{ _('w_ViewPTW_Step4_9') }}</span> &nbsp;
                    <a
                        :href="path"
                        target="_blank"
                    >{{ _('w_ViewPTW_Step4_91') }}</a>
                    <span>{{ _('w_ViewPTW_Step4_93') }}</span> &nbsp;
                </p>
                <b-form-radio-group
                    v-model="inputFormData.checklist9"
                    :options="options"
                    name="checklist9"
                    class="col-md-2 mb-2 mt-2"
                    @input="changeChecklist9"
                ></b-form-radio-group>
            </template>

        </iv-form>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";


@Component({
    components: {}
})
export class Step4 extends Vue {

    options: any = [];

    inputFormData: any = {
        checklist1: false,
        checklist2: false,
        checklist3: false,
        checklist4: false,
        checklist5: false,
        checklist6: false,
        checklist7: false,
        checklist8: false,
        checklist9: false,

        checklist1Remarks: '',
        checklist2Remarks: '',
        checklist3Remarks: '',
        checklist4Remarks: '',
        checklist5Remarks: '',
        checklist6Remarks: '',
        checklist7Remarks: '',
    };

    // TODO: wait api
    path: string = "https://bootstrap-vue.js.org/docs/components/form-radio";

    created() {
    }

    mounted() {
        this.initSelectItem();
    }

    initSelectItem() {
        this.options = [
            { value: true, text: this._('w_yes') },
            { value: false, text: this._('w_no') },
        ];}

    changeChecklist1() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist2() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist3() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist4() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist5() {
        this.$emit('step4', this.inputFormData);
    }
    changeChecklist6() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist7() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist8() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist9() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist1Remarks() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist2Remarks() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist3Remarks() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist4Remarks() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist5Remarks() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist6Remarks() {
        this.$emit('step4', this.inputFormData);
    }

    changeChecklist7Remarks() {
        this.$emit('step4', this.inputFormData);
    }

    IAddForm() {
        return `
            interface {

                checklistTitle?: any;
                checklist1?: any;
                checklist2?: any;
                checklist3?: any;
                checklist4?: any;
                checklist5?: any;
                checklist6?: any;
                checklist7?: any;
                checklist8?: any;
                checklist9?: any;

            }
        `;
    }
}

export default Step4;
Vue.component("step4", Step4);
</script>

<style lang="scss" scoped>
</style>
