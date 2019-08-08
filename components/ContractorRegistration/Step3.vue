<template>
    <div>
        <iv-form
            :interface="IAddForm()"
            :value="inputFormData"
            @update:*="updateInputFormData"
        >
            <template #typeOfWork>
                <div class="mb-3 mt-2">
                    <p class="cpl-md-12 mb-2 ml-3">* {{ _('w_ViewPTW_Step3_TypesOfWorkInvolved') }}</p>
                    <b-form-checkbox
                        v-for="option in typeOfWorkSelectItem"
                        v-model="inputFormData.workType"
                        :key="option.value"
                        :value="option.value"
                        name="typeOfWork"
                        class="col-md-12 ml-4 mb-2"
                        inline
                        @input="selectTypeOfWork"
                    >
                        {{ option.text }}
                    </b-form-checkbox>
                </div>
            </template>

            <template #contractorIsRequired>
                <span class="font-red col-md-12 mb-3 mt-5">{{ _('w_ViewPTW_Step_AsteriskIsRequired') }}</span>
            </template>

        </iv-form>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { IStep3 } from '.';

@Component({
    components: {}
})
export class Step3 extends Vue {
    typeOfWorkSelectItem: any = [];

    inputFormData: IStep3 = {
        workPremisesUnit: "",
        workLocation: "",
        workDescription: "",
        workType: [],
        workStartDate: new Date(),
        workStartTime: new Date(),
        workEndDate: new Date(),
        workEndTime: new Date(),
        workContact: "",
        workContactPhone: ''
    };

    created() {}

    mounted() {
        this.initSelectItem();
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
                break;
            case "workEndDate":
                this.inputFormData.workEndDate = data.value;
                this.inputFormData.workEndTime = data.value;
                break;
            case "workContact":
                this.inputFormData.workContact = data.value;
                break;
            case "workContactPhone":
                this.inputFormData.workContactPhone = data.value;
                break;
        }

        this.$emit("step3", this.inputFormData);
    }

    selectTypeOfWork() {
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
