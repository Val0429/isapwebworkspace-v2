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
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import { IWorkPermitAccessGroup } from '.';

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
        startDate: new Date(),
        startTime: new Date(),
        endDate: new Date(),
        endTime: new Date(),
        accessGroups: [],
        approval: false
    };

    // TODO: wait api
    // qrCode: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/QRcode_image.svg/220px-QRcode_image.svg.png';
    qrCode: string = "";
    ptwText: string = "";

    created() {}

    mounted() {
        this.initSelectItem();
        this.initAccessGroupSelectItem();

        this.inputFormData.startDate = this.selectedDetail.startDate;
        this.inputFormData.startTime = this.selectedDetail.startTime;
        this.inputFormData.endDate = this.selectedDetail.endDate;
        this.inputFormData.endTime = this.selectedDetail.endTime;
        this.inputFormData.accessGroups = this.selectedDetail.accessGroups;
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

        // TODO: wait api
        // await this.$server
        //     .R("/")
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(this, response, (response: any) => {
        //             for (const returnValue of response) {
        //                 tempAccessGroupSelectItem[returnValue.objectId] =
        //                     returnValue.name;
        //             }
        //             this.accessGroupSelectItem = tempAccessGroupSelectItem;
        //         });
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(this, e);
        //     });
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
            case "accessGroups":
                this.inputFormData.accessGroups = data.value;
                break;
        }
    }

    changeApproval() {
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
                startDate?: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step3_To")}
                 * @uiType - iv-form-datetime
                 * @uiColumnGroup - date
                 */
                endDate?: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step8_AccessGroup")}
                 */
                accessGroups?:  ${toEnumInterface(
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
