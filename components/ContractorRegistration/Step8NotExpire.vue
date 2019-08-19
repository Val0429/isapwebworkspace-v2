<template>
    <div>
        <iv-form
            :interface="IAddForm()"
            :value="inputFormData"
            @update:*="updateInputFormData"
        >

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

            <template #approval>
                <b-form-radio-group
                    v-model="approval"
                    :options="options"
                    name="approval"
                    class="col-md-2 mb-2 mt-2"
                    @input="changeApproval"
                ></b-form-radio-group>
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
import Dialog from "@/services/Dialog";
import Datetime from '@/services/Datetime';

@Component({
    components: {}
})
export class Step8NotExpire extends Vue {
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
        // this.initAccessGroupSelectItem();
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
        this.accessGroupSelectItem = { '123': '123' };
        let tempAccessGroupSelectItem = {};

        await this.$server
            .R("/flow1/crms/access-group")
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
                    !Datetime.checkDateStartToEnd(
                        this.inputFormData.workStartDate,
                        this.inputFormData.workEndDate
                    )
                ) {
                    Dialog.error(this._("w_Invitation_ErrorEndDateGreater"));
                    return false;
                }

                if (
                    Datetime.DateStart(
                        this.inputFormData.workStartDate
                    ).getTime() <
                    Datetime.DateEnd(this.inputFormData.workEndDate).getTime() -
                    Datetime.oneDayTimestamp * 31
                ) {
                    Dialog.error(this._("w_Invitation_ErrorDateLower31Day"));
                    return false;
                }

                // if (
                //     !Datetime.checkTimeStartToEnd(
                //         this.inputFormData.workStartTime,
                //         this.inputFormData.workEndTime
                //     )
                // ) {
                //     Dialog.error(this._("w_Invitation_ErrorEndTimeGreater"));
                //     return false;
                // }

                break;
            case "workEndDate":
                this.inputFormData.workEndDate = data.value;
                this.inputFormData.workEndTime = data.value;
                this.$emit("step8", this.inputFormData);

                if (
                    !Datetime.checkDateStartToEnd(
                        this.inputFormData.workStartDate,
                        this.inputFormData.workEndDate
                    )
                ) {
                    Dialog.error(this._("w_Invitation_ErrorEndDateGreater"));
                    return false;
                }

                if (
                    Datetime.DateStart(
                        this.inputFormData.workStartDate
                    ).getTime() <
                    Datetime.DateEnd(this.inputFormData.workEndDate).getTime() -
                    Datetime.oneDayTimestamp * 31
                ) {
                    Dialog.error(this._("w_Invitation_ErrorDateLower31Day"));
                    return false;
                }

                // if (
                //     !Datetime.checkTimeStartToEnd(
                //         this.inputFormData.workStartTime,
                //         this.inputFormData.workEndTime
                //     )
                // ) {
                //     Dialog.error(this._("w_Invitation_ErrorEndTimeGreater"));
                //     return false;
                // }
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

        this.$emit("step8", this.inputFormData);
    }

    changeApproval() {}

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

            }
        `;
    }
}

export default Step8NotExpire;
Vue.component("step8-not-expire", Step8NotExpire);
</script>

<style lang="scss" scoped>
.font-red {
    color: red;
}
</style>
