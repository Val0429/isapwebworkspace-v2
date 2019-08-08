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
                                <tr v-for="(value, index) of tableDatas">
                                    <td>{{ index + 1}}</td>
                                    <td>{{ value.visitorName }}</td>
                                    <td>{{ value.purpose }}</td>
                                    <td>{{ value.kioskName }}</td>
                                    <td>{{ value.result }}</td>
                                    <td>{{ value.event }}</td>
                                    <td>{{ value.eventDateString }}</td>
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

// WebSocket
import { Ws } from "@/services/WebSocket/Ws";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import Datetime from "@/services/Datetime";
import ServerConfig from "@/services/ServerConfig";

// Export PDF
import * as jspdf from "jspdf";
import VueHtml2Canvas from "vue-html2canvas";
Vue.use(VueHtml2Canvas);

interface ITableItem {
    visitorName: string;
    purpose: string;
    kioskName: string;
    result: string;
    event: string;
    eventDate: Date;
    eventDateString: string;
}

enum EWsType {
    none = "none",
    status = "status",
    response = "response",
    event = "event"
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

    tableDatas: ITableItem[] = [];
    eventTimeFormat = "YYYY-MM-DD HH:mm:ss";

    ws: Ws = new Ws({
        url: "",
        OnOpen: async (e: Event): Promise<void> => {
            console.log("WS Alive Open");
        },

        OnMessage: async (e: MessageEvent): Promise<void> => {
            console.log("WS Alive message");
            console.log("e: ", e);
            this.handleWs(e.data);
        },

        OnError: async (e: Event): Promise<void> => {
            console.log("WS Alive Error");
        },

        OnClose: async (e: CloseEvent): Promise<void> => {
            console.log("WS Alive Close");
        }
    });

    created() {
        this.initSelectItemPurpose();
        this.initSelectItemKiosk();
        this.initDate();
    }

    mounted() {}

    beforeDestroy() {
        this.ws.Close();
    }

    initDate() {
        this.inputFilterData.startDate = Datetime.MonthStart(new Date());
        this.inputFilterData.endDate = Datetime.MonthEnd(new Date());
    }

    // Web Socket
    initWS() {
        let url = `ws://${ServerConfig.host}:${ServerConfig.port}/visitors/monitor?sessionId=${this.$user.sessionId}`;
        this.ws.url = url;
        this.ws.Connect();
    }

    handleWs(wsData: string) {
        try {
            let data: any = JSON.parse(wsData);
            let wsType: EWsType = EWsType.none;

            // check webSocket type
            if (data.statusCode != undefined) {
                wsType = EWsType.status;
            } else if (data.results != undefined) {
                wsType = EWsType.response;
            } else {
                wsType = EWsType.event;
            }

            // do something for different type
            switch (wsType) {
                case EWsType.status:
                    if (data.statusCode == 401) {
                        this.$router.push({ path: "/" });
                    }
                    break;
                case EWsType.response:
                    for (let tempResponse of data.results) {
                        this.resolveInvestigationResponse(tempResponse);
                    }
                    break;
                case EWsType.event:
                    this.resolveWsData(data);
                    break;
            }
        } catch (e) {
            console.log("WS handle error: ", e);
        }
    }

    resolveWsData(data: any) {
        let tempItem: ITableItem = {
            visitorName: data.visitor.name,
            purpose: data.invitation.purpose.name,
            kioskName: data.kiosk.data.kioskName,
            result: data.result,
            event: this.resolveEventString(data.action),
            eventDateString: Datetime.DateTime2String(
                data.createdAt,
                this.eventTimeFormat
            ),
            eventDate: new Date(data.createdAt)
        };
        this.tableDatas.push(tempItem);
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
        this.ws.Close();
        this.tableDatas = [];

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
                    for (let result of response.results) {
                        this.resolveInvestigationResponse(result);
                    }
                    this.initWS();
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    resolveInvestigationResponse(data: any) {
        let tempItem: ITableItem = {
            visitorName: data.visitor.name,
            purpose: data.purpose.name,
            kioskName: data.kiosk.data.kioskName,
            result: "",
            event: "",
            eventDateString: "",
            eventDate: new Date()
        };

        if (data.events.length < 1) {
            return false;
        }

        let lastEvent: any = data.events[data.events.length - 1];
        tempItem.result = lastEvent.result;
        tempItem.event = this.resolveEventString(lastEvent.action);
        tempItem.eventDate = new Date(lastEvent.createdAt);
        tempItem.eventDateString = Datetime.DateTime2String(
            new Date(lastEvent.createdAt),
            this.eventTimeFormat
        );
        this.tableDatas.push(tempItem);
    }

    resolveEventString(event: string) {
        let result = "";
        switch (event) {
            case "EventStrictCompareFace":
                result = this._("w_Investigation_EventStrictCompareFace");
                break;
            case "EventStrictCompleteCheckIn":
                result = this._("w_Investigation_EventStrictCompleteCheckIn");
                break;
            case "EventStrictConfirmPhoneNumber":
                result = this._(
                    "w_Investigation_EventStrictConfirmPhoneNumber"
                );
                break;
            case "EventStrictTryCheckIn":
                result = this._("w_Investigation_EventStrictTryCheckIn");
                break;
        }
        return result;
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




