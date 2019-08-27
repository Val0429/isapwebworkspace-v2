<template>
    <div>
        <iv-form :interface="IFilterConditionForm()">
            <template #time="{ $attrs, $listeners }">
                <iv-form-selection
                    v-bind="$attrs"
                    v-on="$listeners"
                    v-model="time"
                    @input="updateTime($event)"
                >
                </iv-form-selection>
            </template>
        </iv-form>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { toEnumInterface } from "../../../core";
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

    timeSelectItem: any = {};

    time: string = "today";

    created() {
        this.initSelectItem();
    }

    mounted() {}

    initSelectItem() {
        this.timeSelectItem = {
            today: `${this._("w_Dashboard_Today")} ( ${Datetime.CountDateNumber(
                0
            )} ~ ${Datetime.CountDateNumber(0)} )`,
            yesterday: `${this._(
                "w_Dashboard_Yesterday"
            )} ( ${Datetime.CountDateNumber(-1)} ~ ${Datetime.CountDateNumber(
                -1
            )} )`,
            last7day: `${this._(
                "w_Dashboard_Last7Day"
            )} ( ${Datetime.CountDateNumber(-6)} ~ ${Datetime.CountDateNumber(
                0
            )} )`,
            last14day: `${this._(
                "w_Dashboard_Last14Day"
            )} ( ${Datetime.CountDateNumber(-13)} ~ ${Datetime.CountDateNumber(
                0
            )} )`,
            last28day: `${this._(
                "w_Dashboard_Last28Day"
            )} ( ${Datetime.CountDateNumber(-27)} ~ ${Datetime.CountDateNumber(
                0
            )} )`,
            last30day: `${this._(
                "w_Dashboard_Last30Day"
            )} ( ${Datetime.CountDateNumber(-29)} ~ ${Datetime.CountDateNumber(
                0
            )} )`,
            last60day: `${this._(
                "w_Dashboard_Last60Day"
            )} ( ${Datetime.CountDateNumber(-59)} ~ ${Datetime.CountDateNumber(
                0
            )} )`,
            last90day: `${this._(
                "w_Dashboard_Last90Day"
            )} ( ${Datetime.CountDateNumber(-89)} ~ ${Datetime.CountDateNumber(
                0
            )} )`,
            last180day: `${this._(
                "w_Dashboard_Last180Day"
            )} ( ${Datetime.CountDateNumber(-179)} ~ ${Datetime.CountDateNumber(
                0
            )} )`,
            thisYear: `${this._(
                "w_thisYear"
            )} ( ${Datetime.ThisYearStartDate()} ~ ${Datetime.ThisYearEndDate()} )`
        };
        this.numberOfDaysDifference(
            this.timeParam.startDate,
            this.timeParam.endDate
        );
    }

    numberOfDaysDifference(start_Date: Date, end_Date: Date) {
        let result = 0;
        let startDate = Datetime.DateToZero(new Date(start_Date)).getTime();
        let endDate = Datetime.DateToZero(new Date(end_Date)).getTime();
        let today = Datetime.DateToZero(new Date()).getTime();

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
            startDate: Datetime.DateToZero(new Date()),
            endDate: Datetime.DateToZero(new Date())
        };

        switch (data) {
            case ETime.today:
                submitParam.startDate = Datetime.DateToZero(new Date());
                submitParam.endDate = Datetime.DateToZero(new Date());
                break;
            case ETime.yesterday:
                submitParam.startDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(-1))
                );
                submitParam.endDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(-1))
                );
                break;
            case ETime.last7day:
                submitParam.startDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(-6))
                );
                submitParam.endDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(0))
                );
                break;
            case ETime.last14day:
                submitParam.startDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(-13))
                );
                submitParam.endDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(0))
                );
                break;
            case ETime.last28day:
                submitParam.startDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(-27))
                );
                submitParam.endDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(0))
                );
                break;
            case ETime.last30day:
                submitParam.startDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(-29))
                );
                submitParam.endDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(0))
                );
                break;
            case ETime.last60day:
                submitParam.startDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(-59))
                );
                submitParam.endDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(0))
                );
                break;
            case ETime.last90day:
                submitParam.startDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(-89))
                );
                submitParam.endDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(0))
                );
                break;
            case ETime.last180day:
                submitParam.startDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(-179))
                );
                submitParam.endDate = Datetime.DateToZero(
                    new Date(Datetime.CountDateNumber(0))
                );
                break;
            case ETime.thisYear:
                submitParam.startDate = Datetime.DateToZero(
                    new Date(Datetime.ThisYearStartDate())
                );
                submitParam.endDate = Datetime.DateToZero(
                    new Date(Datetime.ThisYearEndDate())
                );
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
                time?: ${toEnumInterface(this.timeSelectItem as any, false)};

            }
        `;
    }
}

export default SelectTime;
Vue.component("select-time", SelectTime);
</script>

<style lang="scss" scoped>
</style>
