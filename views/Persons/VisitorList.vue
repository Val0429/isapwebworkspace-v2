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
                :label=" _('w_Visitor_PersonList') "
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
                    :server="{ path: '/person/visitor' }"
                    @selected="selectedItem($event)"
                >

                    <template #imageBase64="{ $attrs }">
                        <img
                            :src="newImgSrc"
                            style="margin-left: 30px;"
                        />
                    </template>

                    <template #floors="{$attrs, $listeners}">
                        <ul>
                            <li v-for="floor in $attrs.row.floors">
                                {{floor.name}}
                            </li>
                        </ul>
                    </template>

                    <template #actions$>
                        <iv-toolbox-more :disabled="selectedDetail.length !== 1">
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
                :label=" _('w_Account_ViewUser') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IViewForm()"
                    :value="inputFormData"
                >
                    <template #imageBase64="{$attrs}">
                        <img
                            :src="$attrs.value"
                            alt=""
                        >
                    </template>

                    <template #image>
                        <img
                            class="form-image"
                            :src="newImgSrc"
                        />
                    </template>

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
import personProgress from "@/views/Persons/PersonProgress.vue";

// Custom
import { EUserRole } from "@/services/Role";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import RegexServices from "@/services/RegexServices";
import ImageBase64 from "@/services/ImageBase64";
import RoleService from "@/services/Role/RoleService";
import Datetime from "@/services/Datetime";
import ServerConfig from "@/services/ServerConfig";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

@Component({
    components: { personProgress }
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
        email: "",
        phone: "",
        remark: "",
        companiesText: "",
        floorsText: "",
        name: "",
        companyId: "",
        floorIds: [],
        imageBase64: "",
        nric: "",
        realRoles: [],
        useCompany: false,
        useFloor: false,
        startDateString: "",
        endDateString: "",
        organization: ""
    };

    selectItem: {
        role: any;
        company: any;
        floor: any;
    } = {
        role: {},
        company: {},
        floor: {}
    };

    companies = [];

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
        this.getInputData();
    }

    clearInputData() {
        this.newImgSrc = ImageBase64.pngEmpty;
        this.inputFormData = {
            objectId: "",
            email: "",
            phone: "",
            remark: "",
            companiesText: "",
            floorsText: "",
            name: "",
            companyId: "",
            floorIds: [],
            imageBase64: "",
            nric: "",
            realRoles: [],
            useCompany: false,
            useFloor: false,
            startDateString: "",
            endDateString: "",
            organization: ""
        };
    }

    selectedItem(data) {
        this.selectedDetail = data;
    }

    async getInputData() {
        for (const param of this.selectedDetail) {
            let floors = [];
            for (let tempFloor of param.floors) {
                floors.push(tempFloor.objectId);
            }
            this.newImgSrc = param.imageBase64;
            this.inputFormData = {
                objectId: param.objectId,
                name: param.name,
                email: param.email,
                imageBase64: param.imageBase64,
                nric: param.nric,
                companyId: param.company.objectId,
                floorIds: floors,
                phone: param.phone,
                position: param.position,
                remark: param.remark,
                unitNumber: param.unitNumber,
                card: param.card,
                startDate: new Date(param.startDate),
                endDate: new Date(param.endDate),
                startDateString: Datetime.DateTime2String(
                    new Date(param.startDate),
                    "YYYY-MM-DD"
                ),
                endDateString: param.endDate
                    ? Datetime.DateTime2String(
                          new Date(param.endDate),
                          "YYYY-MM-DD"
                      )
                    : "",
                organization: param.organization
            };
        }
    }

    async initSelectItemCompanyWithAPI() {
        let param: any = { paging: { all: true } };
        param = RegexServices.trim(param);
        await this.$server
            .R("/location/company", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.results != undefined &&
                        response.results.length > 0
                    ) {
                        this.companies = JSON.parse(
                            JSON.stringify(response.results)
                        );
                        for (let ret of response.results) {
                            if (
                                ret.objectId != undefined &&
                                ret.name != undefined
                            ) {
                                this.$set(
                                    this.selectItem.company,
                                    ret.objectId,
                                    ret.name
                                );
                            }
                        }
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemCompanyWithStorage() {
        this.selectItem.company = {};
        this.selectItem.company[
            this.$user.user.company.objectId
        ] = this.$user.user.company.name;
    }

    async initSelectItemFloorWithAPI() {
        for (let ret of this.$user.user.floors) {
            if (ret.objectId != undefined && ret.name != undefined) {
                this.$set(this.selectItem.floor, ret.objectId, ret.name);
            }
        }
    }

    async initSelectItemFloorWithCompany(companyId: string) {
        this.selectItem.floor = {};
        for (let company of this.companies) {
            if (companyId == company.objectId) {
                for (let floor of company.floors) {
                    this.$set(
                        this.selectItem.floor,
                        floor.objectId,
                        floor.name
                    );
                }
                break;
            }
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
                 * @uiLabel - ${this._("w_Person_Name")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Person_Floor")}
                 */
                floors: any;

                /**
                 * @uiLabel - ${this._("w_Person_Enable_Permission")}
                 */
                startDate: Date;

                /**
                 * @uiLabel - ${this._("w_Person_Disable_Permission")}
                 */
                endDate: Date;

                /**
                 * @uiLabel - ${this._("w_Person_createdAt")}
                 */
                createdAt: Date;

                /**
                 * @uiLabel - ${this._("w_Person_createdUser")}
                 */
                createdUser: string;

                /**
                 * @uiLabel - ${this._("w_Person_updateAt")}
                 */
                updateAt: Date;

                /**
                 * @uiLabel - ${this._("w_Person_updateUser")}
                 */
                updateUser: string;
            }
        `;
    }

    IViewForm() {
        return `
            interface {

                image?: any;

                /**
                 * @uiLabel - ${this._("w_Person_Name")}
                 * @uiType - iv-form-label
                 */
                name: string;               

                /**
                 * @uiLabel - ${this._("w_Person_Company")}
                 * @uiType - iv-form-label
                 * @uiHidden - ${!this.inputFormData.useCompany}
                 */
                companyId: any;

                /**
                 * @uiLabel - ${this._("w_Person_Floor")}
                 * @uiType - iv-form-label
                 * @uiHidden - ${!this.inputFormData.useFloor}
                 */
                floorIds: string;

                /**
                 * @uiLabel - ${this._("w_Person_Email")}
                 * @uiType - iv-form-label
                 */
                email: string;

                /**
                 * @uiLabel - ${this._("w_Person_Remark")}
                 * @uiType - iv-form-label
                 */
                remark?: string;

                /**
                 * @uiLabel - ${this._("w_Person_Enable_Permission")}
                 * @uiColumnGroup - date-group
                 * @uiType - iv-form-label
                 */
                startDateString: string;

                /**
                 * @uiLabel - ${this._("w_Person_Disable_Permission")}
                 * @uiColumnGroup - date-group
                 * @uiType - iv-form-label
                 */
                endDateString?: string;

                /**
                 * @uiLabel - ${this._("w_Person_NRIC")}
                 * @uiType - iv-form-label
                 */
                nric?: string;

                /**
                 * @uiLabel - ${this._("w_Visitor_Organization")}
                 * @uiType - iv-form-label
                 */
                organization?: string;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
.form-image {
    max-width: 100px;
    max-height: 100px;
    margin-left: 30px;
}
</style>
