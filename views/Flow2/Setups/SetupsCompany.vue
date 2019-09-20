<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <!-- List -->
            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label=" _('w_Company_List') "
            >
                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="selectedDetail.length !== 1"
                        @click="pageToView"
                    />

                </template>

                <iv-table
                    ref="listTable"
                    :interface="ITableList()"
                    :multiple="tableMultiple"
                    :server="{ path: '/flow2/companies' }"
                    @selected="selectedItem($event)"
                >
                    <template #floor="{$attrs}">
                        <div v-html="tableFloorString($attrs.value)"></div>
                    </template>

                    <template #contactNumber="{$attrs}">
                        <div v-html="tablePhoneString($attrs.value)"></div>
                    </template>

                </iv-table>
            </iv-card>

            <!-- view -->
            <iv-card
                key="transition_2"
                v-show="transition.step === 2"
                :visible="true"
                :label=" _('w_Company_View') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IViewForm()"
                    :value="inputFormData"
                >

                </iv-form>

                <template #footer>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

            </iv-card>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

@Component({
    components: {}
})
export default class SetupsCompany extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    tableMultiple: boolean = true;
    selectedDetail: any = [];

    inputFormData: any = {
        objectId: "",
        name: "",
        contactPerson: "",
        unitNumber: "",
        contactNumber: "",
        contactNumbers: [],
        floor: [],
        floorView: "",
        contactNumberView: ""
    };

    created() {}

    mounted() {}

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        this.clearInputData();
        (this.$refs.listTable as any).reload();
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.clearInputData();
        this.getInputData();
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            name: "",
            contactPerson: "",
            unitNumber: "",
            contactNumber: "",
            contactNumbers: [],
            floor: [],

            floorView: "",
            contactNumberView: ""
        };
    }

    selectedItem(data) {
        this.selectedDetail = data;
    }

    getInputData() {
        for (const param of this.selectedDetail) {
            this.inputFormData = {
                objectId: param.objectId,
                name: param.name,
                contactPerson: param.contactPerson,
                unitNumber: param.unitNumber,
                contactNumbers: param.contactNumber,
                floor: param.floor,

                floorView: this.ViewFloorString(param.floor),
                contactNumberView: this.ViewPhoneString(param.contactNumber)
            };
        }
    }

    tableFloorString(datas: any): string {
        let result: string = "";
        result += "<ul>";
        if (datas != undefined) {
            for (let loopData of datas) {
                let tempText = loopData.name;
                result += `<li>${tempText}</li>`;
            }
        }
        result += "</ul>";
        return result;
    }

    tablePhoneString(datas: any): string {
        let result: string = "";
        result += "<ul>";
        if (datas != undefined) {
            for (let loopData of datas) {
                let tempText = loopData;
                result += `<li>${tempText}</li>`;
            }
        }
        result += "</ul>";
        return result;
    }

    ViewFloorString(value: any): string {
        let result = "";
        for (let val of value) {
            result += val.name + ", ";
        }
        result = result.substring(0, result.length - 2);
        return result;
    }

    ViewPhoneString(value: any): string {
        let result = "";
        for (let val of value) {
            result += val + ", ";
        }
        result = result.substring(0, result.length - 2);
        return result;
    }

    ITableList() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;

                /**
                 * @uiLabel - ${this._("w_Company_Name")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Company_Floor")}
                 */
                floor: string;

                /**
                 * @uiLabel - ${this._("w_Company_ContactPerson")}
                 */
                contactPerson: string;

                /**
                 * @uiLabel - ${this._("w_Company_UnitNumber")}
                 */
                unitNumber: string;

                /**
                 * @uiLabel - ${this._("w_Company_ContactNumber")}
                 */
                contactNumber: string;
            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Company_Name")}
                 * @uiType - iv-form-label
                 */
                name?: string;

                /**
                 * @uiLabel - ${this._("w_Company_UnitNumber")}
                 * @uiType - iv-form-label
                 */
                unitNumber?: string;

                /**
                 * @uiLabel - ${this._("w_Company_ContactPerson")}
                 * @uiType - iv-form-label
                 */
                contactPerson?: string;

                /**
                 * @uiLabel - ${this._("w_Company_ContactNumber")}
                 * @uiType - iv-form-label
                 */
                contactNumberView?: string;

                /**
                 * @uiLabel - ${this._("w_Company_Floor")}
                 * @uiType - iv-form-label
                 */
                floorView?: string;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>
