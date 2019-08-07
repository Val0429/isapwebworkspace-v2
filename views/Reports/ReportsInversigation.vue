<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <div
                key="transition_1"
                v-show="transition.step === 1"
            >

                <iv-auto-card :label="_('w_Investigation_FilterTitle')">
                    <iv-form
                        :interface="IFilterForm()"
                        :value="inputFilterData"
                        @update:*="updateFilterForm"
                        @submit="submitFilterForm($event)"
                    >

                        <template #purpose="{ $attrs, $listeners }">
                            <iv-form-selection
                                v-on="$listeners"
                                v-bind="$attrs"
                                :options="selectItem.purposes"
                            >
                            </iv-form-selection>
                        </template>

                        <template #kiosk="{ $attrs, $listeners }">
                            <iv-form-selection
                                v-on="$listeners"
                                v-bind="$attrs"
                                :options="selectItem.kiosk"
                            >
                            </iv-form-selection>
                        </template>

                    </iv-form>
                </iv-auto-card>

                <iv-card :label="_('w_Investigation_ContentTitle')">

                    <template #toolbox>
                        <iv-toolbox-export-pdf @click="exportPDF()" />
                    </template>

                    <div
                        :id="exportTableId"
                        style="padding: 10px;"
                    >
                        <table class="table table-bordered table-hover datatable dataTable no-footer">
                            <thead>
                                <th>{{ _('w_No') }}</th>
                                <th>{{ _('w_Investigation_VisitorName') }}</th>
                                <th>{{ _('w_Investigation_Purpose') }}</th>
                                <th>{{ _('w_Investigation_KioskName') }}</th>
                                <th>{{ _('w_Investigation_Result') }}</th>
                                <th>{{ _('w_Investigation_Event') }}</th>
                                <th>{{ _('w_Investigation_EventTime') }}</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>No</td>
                                    <td>Visitor Name</td>
                                    <td>Purpose</td>
                                    <td>Kiosk Name</td>
                                    <td>Result</td>
                                    <td>Event</td>
                                    <td>Event Time</td>
                                </tr>
                                <tr>
                                    <td>No</td>
                                    <td>Visitor Name</td>
                                    <td>Purpose</td>
                                    <td>Kiosk Name</td>
                                    <td>Result</td>
                                    <td>Event</td>
                                    <td>Event Time</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </iv-card>

            </div>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";

// Export PDF
import * as jspdf from "jspdf";
import VueHtml2Canvas from "vue-html2canvas";
import Datetime from "../../services/Datetime";
Vue.use(VueHtml2Canvas);

interface ITableItem {
    no: number;
    visitorName: string;
    purpose: string;
    kioskName: string;
    result: string;
    event: string;
    eventTime: string;
    eventDate: Date;
}

@Component({
    components: {}
})
export default class ReportsInversigation extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };
    exportTableId = "exportPDf";

    tableDatas: ITableItem[] = [];

    inputFilterData: any = {
        startDate: new Date(),
        endDate: new Date(),
        purpose: "",
        kiosk: ""
    };

    selectItem = {
        purposes: [],
        kiosk: []
    };

    created() {
        this.initSelectItemPurpose();
        this.initSelectItemKiosk();
        this.initDate();
    }

    mounted() {}

    initDate() {
        this.inputFilterData.startDate = Datetime.MonthStart(new Date());
        this.inputFilterData.endDate = Datetime.MonthEnd(new Date());
    }

    async initSelectItemPurpose() {
        let param: {} = {};

        await this.$server
            .R("/purposes", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        let item = {
                            id: returnValue.objectId,
                            text: returnValue.name
                        };
                        this.selectItem.purposes.push(item);
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemKiosk() {
        let param: {} = {};
        await this.$server
            .R("/kiosks", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        let item = {
                            id: returnValue.objectId,
                            text: returnValue.data.kioskName
                        };
                        this.selectItem.kiosk.push(item);
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    exportPDF() {
        let self: any = this;
        let fileName = `vms_investigation_${Datetime.DateTime2String(
            new Date(),
            "YYYYMMDD_HHmmss"
        )}.pdf`;
        let htmlElement: any = document.getElementById(this.exportTableId);

        Loading.show();
        self.$html2canvas(htmlElement).then(canvas => {
            // Few necessary setting options
            var imgWidth = 210;
            var imgHeight = (canvas.height * imgWidth) / canvas.width;
            const contentDataURL = canvas.toDataURL("image/png");
            let pdf = new jspdf("p", "mm", "a4"); // A4 size page of PDF
            var position = 0;
            pdf.addImage(
                contentDataURL,
                "PNG",
                0,
                position,
                imgWidth,
                imgHeight
            );
            pdf.save(fileName);
            Loading.hide();
        });
    }

    updateFilterForm(datas: any) {
        this.inputFilterData[datas.key] = datas.value;
    }

    async submitFilterForm() {
        let param: any = {
            paging: { all: true },
            start: this.inputFilterData.startDate.toISOString(),
            end: this.inputFilterData.endDate.toISOString()
        };

        if (this.inputFilterData.kiosk != "") {
            param.kiosk = this.inputFilterData.kiosk;
        }

        if (this.inputFilterData.purpose != "") {
            param.purpose = this.inputFilterData.purpose;
        }

        Loading.show();
        await this.$server
            .R("/visitors/investigation", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    console.log("!!! response", response);
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    IFilterForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Investigation_StartDate")}
                 * @uiType - iv-form-date
                 * @uiColumnGroup - date
                 */
                startDate: Date;

                /**
                 * @uiLabel - ${this._("w_Investigation_EndDate")}
                 * @uiType - iv-form-date
                 * @uiColumnGroup - date
                 */
                endDate: Date;

                /**
                 * @uiLabel - ${this._("w_Investigation_Purpose")}
                 */
                purpose?: any;

                /**
                 * @uiLabel - ${this._("w_Investigation_Kiosk")}
                 */
                kiosk?: any;

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




