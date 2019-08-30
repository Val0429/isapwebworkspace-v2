<template>
    <div>
        <iv-form :interface="IFilterConditionForm()">
            <template #time="{ $attrs, $listeners }">

                <p class="font-sm col-md-12 ml-1">{{ _("w_Dashboard_SelectTime") }}</p>

                <iv-form-selection
                    v-on="$listeners"
                    v-model="time"
                    class="col-md-12"
                    :options="timeSelectItem"
                    @input="updateTime($event)"
                >
                </iv-form-selection>
            </template>
        </iv-form>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Datetime from "@/services/Datetime";

import { ETime } from "@/components/Dashboard/index";

@Component({
    components: {}
})
export class SelectTime extends Vue {
    // Prop
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {}
    })
    timeParam: any;

    timeSelectItem: any = [];

    time: string = "today";

    created() {
        this.initSelectItem();
    }

    mounted() {}

    initSelectItem() {
        this.timeSelectItem = [
            {
                id: ETime.today,
                text: `${this._(
                    "w_Dashboard_Today"
                )} ( ${Datetime.DateTime2String(
                    new Date(),
                    Datetime.FormatDate
                )} ~ ${Datetime.DateTime2String(
                    new Date(),
                    Datetime.FormatDate
                )} )`
            },
            {
                id: ETime.yesterday,
                text: `${this._(
                    "w_Dashboard_Yesterday"
                )} ( ${Datetime.DateTime2String(
                    Datetime.DatePlus(new Date(), -1),
                    Datetime.FormatDate
                )} ~ ${Datetime.DateTime2String(
                    Datetime.DatePlus(new Date(), -1),
                    Datetime.FormatDate
                )} )`
            },
            {
                id: ETime.last7day,
                text: `${this._(
                    "w_Dashboard_Last7Day"
                )} ( ${Datetime.DateTime2String(
                    Datetime.DatePlus(new Date(), -6),
                    Datetime.FormatDate
                )} ~ ${Datetime.DateTime2String(
                    new Date(),
                    Datetime.FormatDate
                )} )`
            },
            {
                id: ETime.last14day,
                text: `${this._(
                    "w_Dashboard_Last14Day"
                )} ( ${Datetime.DateTime2String(
                    Datetime.DatePlus(new Date(), -13),
                    Datetime.FormatDate
                )} ~ ${Datetime.DateTime2String(
                    new Date(),
                    Datetime.FormatDate
                )} )`
            },
            {
                id: ETime.last28day,
                text: `${this._(
                    "w_Dashboard_Last28Day"
                )} ( ${Datetime.DateTime2String(
                    Datetime.DatePlus(new Date(), -27),
                    Datetime.FormatDate
                )} ~ ${Datetime.DateTime2String(
                    new Date(),
                    Datetime.FormatDate
                )} )`
            },
            {
                id: ETime.last30day,
                text: `${this._(
                    "w_Dashboard_Last30Day"
                )} ( ${Datetime.DateTime2String(
                    Datetime.DatePlus(new Date(), -29),
                    Datetime.FormatDate
                )} ~ ${Datetime.DateTime2String(
                    new Date(),
                    Datetime.FormatDate
                )} )`
            },
            {
                id: ETime.last60day,
                text: `${this._(
                    "w_Dashboard_Last60Day"
                )} ( ${Datetime.DateTime2String(
                    Datetime.DatePlus(new Date(), -59),
                    Datetime.FormatDate
                )} ~ ${Datetime.DateTime2String(
                    new Date(),
                    Datetime.FormatDate
                )} )`
            },
            {
                id: ETime.last90day,
                text: `${this._(
                    "w_Dashboard_Last90Day"
                )} ( ${Datetime.DateTime2String(
                    Datetime.DatePlus(new Date(), -89),
                    Datetime.FormatDate
                )} ~ ${Datetime.DateTime2String(
                    new Date(),
                    Datetime.FormatDate
                )} )`
            },
            {
                id: ETime.last180day,
                text: `${this._(
                    "w_Dashboard_Last180Day"
                )} ( ${Datetime.DateTime2String(
                    Datetime.DatePlus(new Date(), -179),
                    Datetime.FormatDate
                )} ~ ${Datetime.DateTime2String(
                    new Date(),
                    Datetime.FormatDate
                )} )`
            },
            {
                id: ETime.thisYear,
                text: `${this._("w_thisYear")} ( ${Datetime.DateTime2String(
                    Datetime.YearStart(new Date()),
                    Datetime.FormatDate
                )} ~ ${Datetime.DateTime2String(
                    Datetime.YearEnd(new Date()),
                    Datetime.FormatDate
                )} )`
            }
        ];

        this.numberOfDaysDifference(
            this.timeParam.startDate,
            this.timeParam.endDate
        );
    }

    numberOfDaysDifference(start_Date: Date, end_Date: Date) {
        let result = 0;
        let startDate = Datetime.DateStart(new Date(start_Date)).getTime();
        let endDate = Datetime.DateStart(new Date(end_Date)).getTime();
        let today = Datetime.DateStart(new Date()).getTime();

        if (startDate && endDate) {
            result = (endDate - startDate) / (1000 * 60 * 60 * 24);
        }

        switch (result) {
            case 0:
                if (startDate === today && endDate === today) {
                    this.time = ETime.today;
                } else {
                    this.time = ETime.yesterday;
                }
                break;
            case 6:
                this.time = ETime.last7day;
                break;
            case 13:
                this.time = ETime.last14day;
                break;
            case 27:
                this.time = ETime.last28day;
                break;
            case 29:
                this.time = ETime.last30day;
                break;
            case 59:
                this.time = ETime.last60day;
                break;
            case 89:
                this.time = ETime.last90day;
                break;
            case 179:
                this.time = ETime.last180day;
                break;
            case 364:
                this.time = ETime.thisYear;
                break;
        }

        return result;
    }

    updateTime(data) {
        let submitParam: {
            startDate: Date;
            endDate: Date;
        } = {
            startDate: Datetime.DateStart(new Date()),
            endDate: Datetime.DateStart(new Date())
        };

        switch (data) {
            case ETime.today:
                submitParam.startDate = Datetime.DateStart(new Date());
                submitParam.endDate = Datetime.DateStart(new Date());
                break;
            case ETime.yesterday:
                submitParam.startDate = Datetime.DatePlus(new Date(), -1);
                submitParam.endDate = Datetime.DatePlus(new Date(), -1);
                break;
            case ETime.last7day:
                submitParam.startDate = Datetime.DatePlus(new Date(), -6);
                submitParam.endDate = Datetime.DateStart(new Date());
                break;
            case ETime.last14day:
                submitParam.startDate = Datetime.DatePlus(new Date(), -13);
                submitParam.endDate = Datetime.DateStart(new Date());
                break;
            case ETime.last28day:
                submitParam.startDate = Datetime.DatePlus(new Date(), -27);
                submitParam.endDate = Datetime.DateStart(new Date());
                break;
            case ETime.last30day:
                submitParam.startDate = Datetime.DatePlus(new Date(), -29);
                submitParam.endDate = Datetime.DateStart(new Date());
                break;
            case ETime.last60day:
                submitParam.startDate = Datetime.DatePlus(new Date(), -59);
                submitParam.endDate = Datetime.DateStart(new Date());
                break;
            case ETime.last90day:
                submitParam.startDate = Datetime.DatePlus(new Date(), -89);
                submitParam.endDate = Datetime.DateStart(new Date());
                break;
            case ETime.last180day:
                submitParam.startDate = Datetime.DatePlus(new Date(), -179);
                submitParam.endDate = Datetime.DateStart(new Date());
                break;
            case ETime.thisYear:
                submitParam.startDate = Datetime.YearStart(new Date());
                submitParam.endDate = Datetime.YearEnd(new Date());
                break;
        }

        this.$emit("updateTime", submitParam);
    }

    IFilterConditionForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Dashboard_SelectTime")}
                 */
                time?: any;

            }
        `;
    }
}

export default SelectTime;
Vue.component("select-time", SelectTime);
</script>

<style lang="scss" scoped>
</style>
