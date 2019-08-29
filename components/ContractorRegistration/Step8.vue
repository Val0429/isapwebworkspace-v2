<template>
    <div>
        <iv-form
            :interface="IAddForm()"
            :value="inputFormData"
            @update:*="updateInputFormData"
        >

            <template #approval>
                <b-form-radio-group
                    v-model="approval"
                    :options="options"
                    name="approval"
                    class="col-md-12 mb-2 mt-2"
                    @input="changeApproval"
                ></b-form-radio-group>
            </template>

            <template #qrCode>
                <div v-if="qrCode">
                    <img
                        :src="qrCode"
                        alt=""
                        class="col-md-12"
                    >
                    <p class="mt-0 ml-3 col-md-12">{{ _('w_Invitation_PTWID') }} : {{ ptwText }}</p>
                </div>
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
import { toEnumInterface } from "@/../core";
import { IWorkPermitAccessGroup } from ".";
import ResponseFilter from "@/services/ResponseFilter";
import Datetime from "@/services/Datetime";
import Dialog from "@/services/Dialog";
import RegistrationServices from "@/components/ContractorRegistration/RegistrationService";

@Component({
    components: {}
})
export class Step8 extends Vue {
    // Prop
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {}
    })
    selectedDetail: any;

    accessGroupSelectItem: any = {};

    options: any = [];

    inputFormData: any = {
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
        accessGroups:
            this.selectedDetail.accessGroups != undefined
                ? this.selectedDetail.accessGroups
                : [],
        accessGroupsForm: this.selectedDetail.accessGroups
            ? this.selectedDetail.accessGroups.map(item => item.doorId)
            : [],
        approval: false
    };

    approval: boolean = null;

    qrCode: string = this.selectedDetail.qrcode
        ? this.selectedDetail.qrcode
        : "";
    ptwText: string = this.selectedDetail.ptwId
        ? this.selectedDetail.ptwId
        : "";

    async created() {
        this.initInputFormData();
        this.initAccessGroupSelectItem();
    }

    mounted() {
        this.initSelectItem();
    }

    @Watch("selectedDetail", { deep: true })
    private ptwIdChanged(newVal, oldVal) {
        this.initInputFormData();
    }

    initInputFormData() {
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
        this.inputFormData.accessGroups = this.selectedDetail.accessGroups;

        if (this.selectedDetail.accessGroups) {
            for (const detail in this.selectedDetail.accessGroups) {
                this.inputFormData.accessGroupsForm.push(detail);
            }
        }

        this.inputFormData.approval = this.selectedDetail.approval;
    }

    initSelectItem() {
        this.options = [
            { value: true, text: this._("w_Invitation_Approve") },
            { value: false, text: this._("w_Invitation_Reject") }
        ];
    }

    async initAccessGroupSelectItem() {
        this.accessGroupSelectItem = {};
        let tempAccessGroupSelectItem = {};
        let param: any = { paging: { all: true } };

        await this.$server
            .R("/flow1/crms/access-group", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response) {
                        tempAccessGroupSelectItem[returnValue.doorId] =
                            returnValue.doorName;
                    }
                    this.accessGroupSelectItem = tempAccessGroupSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    updateInputFormData(data) {
        switch (data.key) {
            case "workStartDate":
                this.inputFormData.workStartDate = data.value;
                this.inputFormData.workStartTime = data.value;
                this.$emit("step8", this.inputFormData);
                if (
                    !RegistrationServices.checkWorkDate(
                        this,
                        this.inputFormData
                    )
                ) {
                    return false;
                }
                break;
            case "workEndDate":
                this.inputFormData.workEndDate = data.value;
                this.inputFormData.workEndTime = data.value;
                this.$emit("step8", this.inputFormData);
                if (
                    !RegistrationServices.checkWorkDate(
                        this,
                        this.inputFormData
                    )
                ) {
                    return false;
                }
                break;
            case "accessGroupsForm":
                this.inputFormData.accessGroupsForm = data.value;
                break;
        }

        this.inputFormData.accessGroups = [];

        for (const detail in this.accessGroupSelectItem) {
            for (const id of this.inputFormData.accessGroupsForm) {
                if (detail === id) {
                    let door = {
                        doorId: detail,
                        doorName: this.accessGroupSelectItem[detail]
                    };
                    this.inputFormData.accessGroups.push(door);
                }
            }
        }

        // console.log(' ~ ',this.inputFormData.accessGroups )
        this.$emit("step8", this.inputFormData, this.approval);

        // console.log(' ~ ',this.inputFormData.accessGroups )
    }

    changeApproval() {
        this.$emit("step8", this.inputFormData, this.approval);
    }

    IAddForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step8_ValidityOfApproval")}
                 * @uiType - iv-form-datetime
                 * @uiColumnGroup - date
                 */
                workStartDate?: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_To")}
                 * @uiType - iv-form-datetime
                 * @uiColumnGroup - date
                 */
                workEndDate?: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step8_AccessGroup")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_DoorPlaceHolder")}
                 */
                accessGroupsForm:  ${toEnumInterface(
                    this.accessGroupSelectItem as any,
                    true
                )};


                qrCode?: any;

                approval?: any;

            }
        `;
    }
}

export default Step8;
Vue.component("step8", Step8);
</script>

<style lang="scss" scoped>
.font-red {
    color: red;
}
</style>
