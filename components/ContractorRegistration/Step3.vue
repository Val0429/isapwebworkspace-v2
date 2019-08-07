<template>
    <div>
        <iv-form
            :interface="IAddForm()"
            :value="inputFormData"
            @update:*="updateInputFormData"
        >
            <template #typeOfWork>
                <div class="mb-3 mt-2">
                    <p class="cpl-md-12 mb-2 ml-3">{{ _('w_ViewPTW_Step3_TypesOfWorkInvolved') }}</p>
                    <b-form-checkbox
                        v-for="option in typeOfWorkSelectItem"
                        v-model="inputFormData.typeOfWork"
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

        </iv-form>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

@Component({
    components: {}
})
export class Step3 extends Vue {

    typeOfWorkSelectItem: any = [];

    inputFormData: any = {
        unit: '',
        location: '',
        description: '',
        typeOfWork: [],
        startDate: new Date(),
        startTime: new Date(),
        endDate: new Date(),
        endTime: new Date(),
        nameOfApplicantService:'',
        handPhoneContactNumber: 0
    };

    created() {
    }

    mounted() {
        this.initSelectItem();
    }

    initSelectItem() {

        this.typeOfWorkSelectItem = [
            { value: '1', text: this._('w_ViewPTW_Step3_TypesOfWorkInvolved1') },
            { value: '2', text: this._('w_ViewPTW_Step3_TypesOfWorkInvolved2') },
            { value: '3', text: this._('w_ViewPTW_Step3_TypesOfWorkInvolved3') },
            { value: '4', text: this._('w_ViewPTW_Step3_TypesOfWorkInvolved4') },
            { value: '5', text: this._('w_ViewPTW_Step3_TypesOfWorkInvolved5') },
            { value: '6', text: this._('w_ViewPTW_Step3_TypesOfWorkInvolved6') },
            { value: '7', text: this._('w_ViewPTW_Step3_TypesOfWorkInvolved7') },
            { value: '8', text: this._('w_ViewPTW_Step3_TypesOfWorkInvolved8') },
        ];
    }


    updateInputFormData(data) {
        switch (data.key) {

            case 'unit':
                this.inputFormData.unit = data.value;
                break;
            case 'location':
                this.inputFormData.location = data.value;
                break;
            case 'description':
                this.inputFormData.description = data.value;
                break;
            case 'startDate':
                this.inputFormData.startDate = data.value;
                this.inputFormData.startTime = data.value;
                break;
            case 'endDate':
                this.inputFormData.endDate = data.value;
                this.inputFormData.endTime = data.value;
                break;
            case 'nameOfApplicantService':
                this.inputFormData.nameOfApplicantService = data.value;
                break;
            case 'handPhoneContactNumber':
                this.inputFormData.handPhoneContactNumber = data.value;
                break;
        }

        this.$emit('step3', this.inputFormData)
    }

    selectTypeOfWork() {
        this.$emit('step3', this.inputFormData)
    }

    IAddForm() {
        return `
            interface {


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_WorkPremisesUnit")}
                 * @uiPlaceHolder - ${this._("w_Invitation_Unit")}
                 */
                unit?: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_ExactLocation")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step3_ExactLocation_PlaceHolder")}
                 */
                location?: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_Description")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step3_Description_PlaceHolder")}
                 * @uiType - iv-form-textarea
                 */
                description?: string;


                typeOfWork?: any;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_From")}
                 * @uiType - iv-form-datetime
                 * @uiColumnGroup - date
                 */
                startDate?: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_To")}
                 * @uiType - iv-form-datetime
                 * @uiColumnGroup - date
                 */
                endDate?: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_NameOfApplicant")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step3_NameOfApplicant")}
                 */
                nameOfApplicantService?: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_HandPhoneContactNumber")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step3_HandPhoneContactNumber")}
                 * @uiAttrs - { min: 0 }
                 */
                handPhoneContactNumber?: number;


            }
        `;
    }
}

export default Step3;
Vue.component("step3", Step3);
</script>

<style lang="scss" scoped>
</style>
