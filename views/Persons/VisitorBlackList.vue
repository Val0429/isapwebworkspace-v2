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
                :label=" _('w_Visitor_Blacklist_Blacklist') "
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
                    :server="{ path: '/person/staff-blacklist' }"
                    @selected="selectedItem($event)"
                >

                    <template #imageBase64="{ $attrs }">
                        <img :src="$attrs.value" />
                    </template>

                    <template #actions$>
                        <iv-toolbox-more>
                            <iv-toolbox-view @click="pageToView" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>

            <!-- view -->
            <iv-card
                key="transition_2"
                v-show="transition.step === 2"
                :visible="true"
                :label=" _('w_Blacklist_ViewBlack') "
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
import { Ws } from "@/services/WebSocket/Ws";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import RegexServices from "@/services/RegexServices";
import ImageBase64 from "@/services/ImageBase64";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";
import ServerConfig from "@/services/ServerConfig";

@Component({
    components: {}
})
export default class SetupsFloor extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    tableMultiple: boolean = true;

    selectedDetail: any = [];

    newImg = new Image();
    newImgSrc = ImageBase64.pngEmpty;

    inputFormData: any = {
        objectId: "",
        imageBase64: "",
        name: "",
        nric: "",
        remark: "",
        organization: ""
    };

    async created() {}

    mounted() {}

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        (this.$refs.listTable as any).reload();
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.clearInputData();
        this.getInputData();
    }

    clearInputData() {
        this.newImgSrc = ImageBase64.pngEmpty;
        this.inputFormData = {
            objectId: "",
            imageBase64: "",
            name: "",
            nric: "",
            remark: "",
            organization: ""
        };
    }

    selectedItem(data) {
        this.selectedDetail = data;
    }

    getInputData() {
        this.clearInputData();
        for (const param of this.selectedDetail) {
            this.newImgSrc = param.imageBase64;
            this.inputFormData = {
                objectId: param.objectId,
                name: param.name,
                nric: param.nric,
                remark: param.remark,
                organization: param.organization
            };
        }
    }

    tableStatus(values: any) {
        let result = "";
        for (const value of values) {
            value;
        }
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
                 * @uiLabel - ${this._("w_Blacklist_Image")}
                 */
                imageBase64?: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Name")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_NRIC")}
                 */
                nric: string;

                /**
                 * @uiLabel - ${this._("w_Visitor_Organization")}
                 */
                organization: any;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Reason")}
                 */
                remark: string;
            }
        `;
    }

    IViewForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Blacklist_Image")}
                 * @uiType - iv-form-file
                 */
                imageBase64?: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Name")}
                 * @uiType - iv-form-label
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_NRIC")}
                 * @uiType - iv-form-label
                 */
                nric: string;

                /**
                 * @uiLabel - ${this._("w_Visitor_Organization")}
                 * @uiType - iv-form-label
                 */
                organization?: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Reason")}
                 * @uiType - iv-form-label
                 */
                remark: string;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>
