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
                    >
                    <p class="mt-3">{{ ptwText }}</p>
                </div>
            </template>

            <template #approval>
                <b-form-radio-group
                    v-model="inputFormData.approval"
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
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import { IWorkPermitAccessGroup } from '.';
import ResponseFilter from '@/services/ResponseFilter';

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
        workStartDate: new Date(this.selectedDetail.workStartDate) ? new Date(this.selectedDetail.workStartDate) : new Date(),
        workStartTime: new Date(this.selectedDetail.workStartTime) ? new Date(this.selectedDetail.workStartTime) : new Date(),
        workEndDate: new Date(this.selectedDetail.workEndDate) ? new Date(this.selectedDetail.workEndDate) : new Date(),
        workEndTime: new Date(this.selectedDetail.workEndTime) ? new Date(this.selectedDetail.workEndTime) : new Date(),
        accessGroups: [],
        accessGroupsForm: [],
        approval: false
    };

    // TODO: wait api
    // qrCode: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/QRcode_image.svg/220px-QRcode_image.svg.png';
    qrCode: string = "";
    ptwText: string = "";

    created() {
        this.initInputFormData()
    }

    mounted() {
        this.initSelectItem();
        this.initAccessGroupSelectItem();
    }

    @Watch("selectedDetail", { deep: true })
    private ptwIdChanged(newVal, oldVal) {
        this.initInputFormData();
    }

    initInputFormData() {

        this.inputFormData.workStartDate = new Date(this.selectedDetail.workStartDate);
        this.inputFormData.workStartTime = new Date(this.selectedDetail.workStartTime);
        this.inputFormData.workEndDate = new Date(this.selectedDetail.workEndDate);
        this.inputFormData.workEndTime = new Date(this.selectedDetail.workEndTime);

        if (this.selectedDetail.accessGroups) {
            for (const detail in this.accessGroupSelectItem) {
                for (const id of this.selectedDetail.accessGroups) {
                    if (detail === id) {
                        // let door = { doorId: detail, doorName: this.accessGroupSelectItem[detail] };
                        this.inputFormData.accessGroupsForm.push(id.doorId);
                    }
                }
            }
        }

        // this.inputFormData.accessGroups = this.selectedDetail.accessGroups;
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

        await this.$server
            .R("/flow1/crms/access-group")
            .then((response: any) => {
                console.log('response ~ ', response);
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
            case "startDate":
                this.inputFormData.startDate = data.value;
                this.inputFormData.startTime = data.value;
                break;
            case "endDate":
                this.inputFormData.endDate = data.value;
                this.inputFormData.endTime = data.value;
                break;
            case "accessGroupsForm":
                this.inputFormData.accessGroupsForm = data.value;
                break;
        }

    }

    changeApproval() {

        for (const detail in this.accessGroupSelectItem) {
            for (const id of this.inputFormData.accessGroupsForm) {
                if (detail === id) {
                    let door = { doorId: detail, doorName: this.accessGroupSelectItem[detail] };
                    this.inputFormData.accessGroups.push(door);
                }
            }
        }

        this.$emit("step8", this.inputFormData);
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
                 */
                accessGroupsForm?:  ${toEnumInterface(
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
