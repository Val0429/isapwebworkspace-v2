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
                    v-model="inputFormData.checklistRemark1"
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
                    v-model="inputFormData.checklistRemark2"
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
                    v-model="inputFormData.checklistRemark3"
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
                    v-model="inputFormData.checklistRemark4"
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
                    v-model="inputFormData.checklistRemark5"
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
                    v-model="inputFormData.checklistRemark6"
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
                    v-model="inputFormData.checklistRemark7"
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
                        href="/Briefing_Of_HSE_ORL_CLM.pdf"
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
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
import { IStep4 } from ".";

@Component({
    components: {}
})
export class Step4 extends Vue {
    // Prop
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {}
    })
    selectedDetail: any;

    options: any = [];

    inputFormData: IStep4 = {
        checklist1: false,
        checklist2: false,
        checklist3: false,
        checklist4: false,
        checklist5: false,
        checklist6: false,
        checklist7: false,
        checklist8: false,
        checklist9: false,

        checklistRemark1: "",
        checklistRemark2: "",
        checklistRemark3: "",
        checklistRemark4: "",
        checklistRemark5: "",
        checklistRemark6: "",
        checklistRemark7: ""
    };

    // TODO: wait api
    // path: string = require('@/assets/pdf/Briefing_Of_HSE_ORL_CLM.pdf');
    path: string = "";

    created() {}

    mounted() {
        this.initSelectItem();

    }

    @Watch("selectedDetail", { deep: true })
    private ptwIdChanged(newVal, oldVal) {
        this.initInputFormData();
    }

    initInputFormData() {

        this.inputFormData.checklist1 = this.selectedDetail.checklist1;
        this.inputFormData.checklist2 = this.selectedDetail.checklist2;
        this.inputFormData.checklist3 = this.selectedDetail.checklist3;
        this.inputFormData.checklist4 = this.selectedDetail.checklist4;
        this.inputFormData.checklist5 = this.selectedDetail.checklist5;
        this.inputFormData.checklist6 = this.selectedDetail.checklist6;
        this.inputFormData.checklist7 = this.selectedDetail.checklist7;
        this.inputFormData.checklist8 = this.selectedDetail.checklist8;
        this.inputFormData.checklist9 = this.selectedDetail.checklist9;

        this.inputFormData.checklistRemark1 = this.selectedDetail.checklistRemark;
        this.inputFormData.checklistRemark2 = this.selectedDetail.checklistRemark;
        this.inputFormData.checklistRemark3 = this.selectedDetail.checklistRemark;
        this.inputFormData.checklistRemark4 = this.selectedDetail.checklistRemark;
        this.inputFormData.checklistRemark5 = this.selectedDetail.checklistRemark;
        this.inputFormData.checklistRemark6 = this.selectedDetail.checklistRemark;
        this.inputFormData.checklistRemark7 = this.selectedDetail.checklistRemark;
    }

    initSelectItem() {
        this.options = [
            { value: true, text: this._("w_yes") },
            { value: false, text: this._("w_no") }
        ];
    }

    changeChecklist1() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist2() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist3() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist4() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist5() {
        this.$emit("step4", this.inputFormData);
    }
    changeChecklist6() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist7() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist8() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist9() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist1Remarks() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist2Remarks() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist3Remarks() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist4Remarks() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist5Remarks() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist6Remarks() {
        this.$emit("step4", this.inputFormData);
    }

    changeChecklist7Remarks() {
        this.$emit("step4", this.inputFormData);
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
.font-red {
    color: red;
}
</style>
