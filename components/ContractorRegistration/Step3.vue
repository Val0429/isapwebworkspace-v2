<template>
    <div>
        <iv-form
            ref="form"
            :interface="IAddForm()"
            :value="inputFormData"
            @update:*="updateInputFormData"
        >
            <template #workType>
                <div class="mb-3 mt-2">
                    <p class="cpl-md-12 mb-2 ml-3">* {{ _('w_ViewPTW_Step3_TypesOfWorkInvolved') }}</p>

                    <b-form-checkbox
                        class="col-md-12 ml-4 mb-1"
                        v-model="inputFormData.workType1"
                        name="status"
                        :value="true"
                        :unchecked-value="false"
                        @input="changeWorkType1"
                    >
                        {{ _('w_ViewPTW_Step3_TypesOfWorkInvolved1') }}
                    </b-form-checkbox>

                    <b-form-checkbox
                        class="col-md-12 ml-4 mb-1"
                        v-model="inputFormData.workType2"
                        name="status"
                        :value="true"
                        :unchecked-value="false"
                        @input="changeWorkType2"
                    >
                        {{ _('w_ViewPTW_Step3_TypesOfWorkInvolved2') }}
                    </b-form-checkbox>

                    <b-form-checkbox
                        class="col-md-12 ml-4 mb-1"
                        v-model="inputFormData.workType3"
                        name="status"
                        :value="true"
                        :unchecked-value="false"
                        @input="changeWorkType3"
                    >
                        {{ _('w_ViewPTW_Step3_TypesOfWorkInvolved3') }}
                    </b-form-checkbox>

                    <b-form-checkbox
                        class="col-md-12 ml-4 mb-1"
                        v-model="inputFormData.workType4"
                        name="status"
                        :value="true"
                        :unchecked-value="false"
                        @input="changeWorkType4"
                    >
                        {{ _('w_ViewPTW_Step3_TypesOfWorkInvolved4') }}
                    </b-form-checkbox>

                    <b-form-checkbox
                        class="col-md-12 ml-4 mb-1"
                        v-model="inputFormData.workType5"
                        name="status"
                        :value="true"
                        :unchecked-value="false"
                        @input="changeWorkType5"
                    >
                        {{ _('w_ViewPTW_Step3_TypesOfWorkInvolved5') }}
                    </b-form-checkbox>

                    <b-form-checkbox
                        class="col-md-12 ml-4 mb-1"
                        v-model="inputFormData.workType6"
                        name="status"
                        :value="true"
                        :unchecked-value="false"
                        @input="changeWorkType6"
                    >
                        {{ _('w_ViewPTW_Step3_TypesOfWorkInvolved6') }}
                    </b-form-checkbox>

                    <b-form-checkbox
                        class="col-md-12 ml-4 mb-1"
                        v-model="inputFormData.workType7"
                        name="status"
                        :value="true"
                        :unchecked-value="false"
                        @input="changeWorkType7"
                    >
                        {{ _('w_ViewPTW_Step3_TypesOfWorkInvolved7') }}
                    </b-form-checkbox>

                    <b-form-checkbox
                        class="col-md-12 ml-4 mb-1"
                        v-model="inputFormData.workType8"
                        name="status"
                        :value="true"
                        :unchecked-value="false"
                        @input="changeWorkType8"
                    >
                        {{ _('w_ViewPTW_Step3_TypesOfWorkInvolved8') }}
                    </b-form-checkbox>
                </div>
            </template>

            <template #contractorIsRequired>
                <span class="font-red col-md-12 mb-3 mt-5">* {{ _('w_ViewPTW_Step_AsteriskIsRequired') }}</span>
            </template>

        </iv-form>
    </div>
</template>

<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Emit,
    Model,
    Watch
} from "vue-property-decorator";
import { IStep3 } from ".";
import Dialog from "@/services/Dialog";
import RegexService from "@/services/RegexServices";
import Datetime from "@/services/Datetime";

@Component({
    components: {}
})
export class Step3 extends Vue {
    // Prop
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {}
    })
    selectedDetail: any;

    typeOfWorkSelectItem: any = [];

    inputFormData: IStep3 = {
        workPremisesUnit: this.selectedDetail.workPremisesUnit
            ? this.selectedDetail.workPremisesUnit
            : "",
        workLocation: this.selectedDetail.workLocation
            ? this.selectedDetail.workLocation
            : "",
        workDescription: this.selectedDetail.workDescription
            ? this.selectedDetail.workDescription
            : "",
        workType1:
            this.selectedDetail.workType1 != undefined
                ? this.selectedDetail.workType1
                : false,
        workType2:
            this.selectedDetail.workType2 != undefined
                ? this.selectedDetail.workType2
                : false,
        workType3:
            this.selectedDetail.workType3 != undefined
                ? this.selectedDetail.workType3
                : false,
        workType4:
            this.selectedDetail.workType4 != undefined
                ? this.selectedDetail.workType4
                : false,
        workType5:
            this.selectedDetail.workType5 != undefined
                ? this.selectedDetail.workType5
                : false,
        workType6:
            this.selectedDetail.workType6 != undefined
                ? this.selectedDetail.workType6
                : false,
        workType7:
            this.selectedDetail.workType7 != undefined
                ? this.selectedDetail.workType7
                : false,
        workType8:
            this.selectedDetail.workType8 != undefined
                ? this.selectedDetail.workType8
                : false,
        workStartDate: new Date(this.selectedDetail.workStartDate)
            ? new Date(this.selectedDetail.workStartDate)
            : new Date(),
        workStartTime: new Date(this.selectedDetail.workStartDate)
            ? new Date(this.selectedDetail.workStartDate)
            : new Date(),
        workEndDate: new Date(this.selectedDetail.workEndDate)
            ? new Date(this.selectedDetail.workEndDate)
            : new Date(),
        workEndTime: new Date(this.selectedDetail.workEndDate)
            ? new Date(this.selectedDetail.workEndDate)
            : new Date(),
        workContact: this.selectedDetail.workContact
            ? this.selectedDetail.workContact
            : "",
        workContactPhone: this.selectedDetail.workContactPhone
            ? this.selectedDetail.workContactPhone
            : ""
    };

    created() {}

    mounted() {
        this.initSelectItem();
    }

    @Watch("selectedDetail", { deep: true })
    private ptwIdChanged(newVal, oldVal) {
        this.initInputFormData();
    }

    initInputFormData() {
        this.inputFormData.workPremisesUnit = this.selectedDetail.workPremisesUnit;
        this.inputFormData.workLocation = this.selectedDetail.workLocation;
        this.inputFormData.workDescription = this.selectedDetail.workDescription;
        this.inputFormData.workType1 = this.selectedDetail.workType1;
        this.inputFormData.workType2 = this.selectedDetail.workType2;
        this.inputFormData.workType3 = this.selectedDetail.workType3;
        this.inputFormData.workType4 = this.selectedDetail.workType4;
        this.inputFormData.workType5 = this.selectedDetail.workType5;
        this.inputFormData.workType6 = this.selectedDetail.workType6;
        this.inputFormData.workType7 = this.selectedDetail.workType7;
        this.inputFormData.workType8 = this.selectedDetail.workType8;
        this.inputFormData.workStartDate = new Date(
            this.selectedDetail.workStartDate
        );
        this.inputFormData.workStartTime = new Date(
            this.selectedDetail.workStartDate
        );
        this.inputFormData.workEndDate = new Date(
            this.selectedDetail.workEndDate
        );
        this.inputFormData.workEndTime = new Date(
            this.selectedDetail.workEndDate
        );
        this.inputFormData.workContact = this.selectedDetail.workContact;
        this.inputFormData.workContactPhone = this.selectedDetail.workContactPhone;
    }

    initSelectItem() {
        this.typeOfWorkSelectItem = [
            {
                value: 1,
                text: this._("w_ViewPTW_Step3_TypesOfWorkInvolved1")
            },
            {
                value: 2,
                text: this._("w_ViewPTW_Step3_TypesOfWorkInvolved2")
            },
            {
                value: 3,
                text: this._("w_ViewPTW_Step3_TypesOfWorkInvolved3")
            },
            {
                value: 4,
                text: this._("w_ViewPTW_Step3_TypesOfWorkInvolved4")
            },
            {
                value: 5,
                text: this._("w_ViewPTW_Step3_TypesOfWorkInvolved5")
            },
            {
                value: 6,
                text: this._("w_ViewPTW_Step3_TypesOfWorkInvolved6")
            },
            {
                value: 7,
                text: this._("w_ViewPTW_Step3_TypesOfWorkInvolved7")
            },
            { value: 8, text: this._("w_ViewPTW_Step3_TypesOfWorkInvolved8") }
        ];
    }

    updateInputFormData(data) {
        switch (data.key) {
            case "workPremisesUnit":
                this.inputFormData.workPremisesUnit = data.value;
                break;
            case "workLocation":
                this.inputFormData.workLocation = data.value;
                break;
            case "workDescription":
                this.inputFormData.workDescription = data.value;
                break;
            case "workStartDate":
                this.inputFormData.workStartDate = data.value;
                this.inputFormData.workStartTime = data.value;
                if (
                    !Datetime.checkDateStartToEnd(
                        data.value,
                        this.inputFormData.workEndDate
                    )
                ) {
                    Dialog.error(this._("w_Invitation_ErrorEndDateGreater"));
                    return false;
                }

                if (
                    !Datetime.checkTimeStartToEnd(
                        data.value,
                        this.inputFormData.workEndTime
                    )
                ) {
                    Dialog.error(this._("w_Invitation_ErrorEndTimeGreater"));
                    return false;
                }

                if (
                    Datetime.DateStart(data.value).getTime() <
                    Datetime.DateEnd(this.inputFormData.workEndDate).getTime() -
                        Datetime.oneDayTimestamp * 31
                ) {
                    Dialog.error(this._("w_Invitation_ErrorDateLower31Day"));
                    return false;
                }
                break;
            case "workEndDate":
                this.inputFormData.workEndDate = data.value;
                this.inputFormData.workEndTime = data.value;
                if (
                    !Datetime.checkDateStartToEnd(
                        this.inputFormData.workStartDate,
                        data.value
                    )
                ) {
                    Dialog.error(this._("w_Invitation_ErrorEndDateGreater"));
                    return false;
                }

                if (
                    !Datetime.checkTimeStartToEnd(
                        this.inputFormData.workStartTime,
                        data.value
                    )
                ) {
                    Dialog.error(this._("w_Invitation_ErrorEndTimeGreater"));
                    return false;
                }

                if (
                    Datetime.DateStart(
                        this.inputFormData.workStartDate
                    ).getTime() <
                    Datetime.DateEnd(data.value).getTime() -
                        Datetime.oneDayTimestamp * 31
                ) {
                    Dialog.error(this._("w_Invitation_ErrorDateLower31Day"));
                    return false;
                }
                break;
            case "workContact":
                this.inputFormData.workContact = data.value;
                break;
            case "workContactPhone":
                if (!RegexService.number(data.value)) {
                    Dialog.error(this._("w_ViewPTW_Step_ErrorPhone"));
                    return false;
                }

                this.inputFormData.workContactPhone = data.value;
                break;
        }

        this.$emit("step3", this.inputFormData);
    }

    changeWorkType1() {
        this.$emit("step3", this.inputFormData);
    }

    changeWorkType2() {
        this.$emit("step3", this.inputFormData);
    }

    changeWorkType3() {
        this.$emit("step3", this.inputFormData);
    }

    changeWorkType4() {
        this.$emit("step3", this.inputFormData);
    }

    changeWorkType5() {
        this.$emit("step3", this.inputFormData);
    }

    changeWorkType6() {
        this.$emit("step3", this.inputFormData);
    }

    changeWorkType7() {
        this.$emit("step3", this.inputFormData);
    }

    changeWorkType8() {
        this.$emit("step3", this.inputFormData);
    }

    IAddForm() {
        return `
            interface {


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_WorkPremisesUnit")}
                 * @uiPlaceHolder - ${this._("w_Invitation_Unit")}
                 */
                workPremisesUnit: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_ExactLocation")}
                 * @uiPlaceHolder - ${this._(
                     "w_ViewPTW_Step3_ExactLocation_PlaceHolder"
                 )}
                 */
                workLocation: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_Description")}
                 * @uiPlaceHolder - ${this._(
                     "w_ViewPTW_Step3_Description_PlaceHolder"
                 )}
                 * @uiType - iv-form-textarea
                 */
                workDescription: string;


                workType?: any;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_From")}
                 * @uiType - iv-form-datetime
                 * @uiColumnGroup - date
                 */
                workStartDate: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_To")}
                 * @uiType - iv-form-datetime
                 * @uiColumnGroup - date
                 */
                workEndDate: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_NameOfApplicant")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step3_NameOfApplicant")}
                 */
                workContact: string;


                /**
                 * @uiLabel - ${this._(
                     "w_ViewPTW_Step3_HandPhoneContactNumber"
                 )}
                 * @uiPlaceHolder - ${this._(
                     "w_ViewPTW_Step3_HandPhoneContactNumber"
                 )}
                 */
                workContactPhone: string;

                contractorIsRequired?: any;


            }
        `;
    }
}

export default Step3;
Vue.component("step3", Step3);
</script>

<style lang="scss" scoped>
.font-red {
    color: red;
}
</style>
