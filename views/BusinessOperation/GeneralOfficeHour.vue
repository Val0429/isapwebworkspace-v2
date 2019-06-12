<template>
    <div class="animated fadeIn">
        <iv-card
            v-show="pageStep === ePageStep.list"
            :label="_('w_OfficeHour_List')"
        >
            <template #toolbox>

                <iv-toolbox-view
                    :disabled="isSelected.length !== 1"
                    @click="pageToView"
                />
                <iv-toolbox-edit
                    :disabled="isSelected.length !== 1"
                    @click="pageToEdit(ePageStep.edit)"
                />
                <iv-toolbox-delete
                    :disabled="isSelected.length === 0"
                    @click="doDelete"
                />
                <iv-toolbox-divider />
                <iv-toolbox-add @click="pageToAdd(ePageStep.add)" />

            </template>

            <iv-table
                ref="officeHourTable"
                :interface="ITableList()"
                :multiple="tableMultiple"
                :server="{ path: '/office-hour' }"
                @selected="selectedItem($event)"
            >
                <template #dayRanges="{$attrs}">
                    <div v-html="sortOutTableDataFromApi($attrs)"></div>
                </template>

                <template #sites="{$attrs}">
                    <!--                {{ $attrs.value.map((item, index) => item.name)[0] + '...'}}-->
                    {{ showFirst($attrs.value) }}
                </template>

                <template #Actions="{$attrs, $listeners}">
                    <iv-toolbox-more :disabled="isSelected.length !== 1">
                        <iv-toolbox-view @click="pageToView" />
                        <iv-toolbox-edit @click="pageToEdit(ePageStep.edit)" />
                        <iv-toolbox-delete @click="doDelete" />
                    </iv-toolbox-more>
                </template>

            </iv-table>
        </iv-card>

        <!--From (Add and Edit)-->
        <iv-auto-card
            v-show="pageStep === ePageStep.add || pageStep === ePageStep.edit"
            :visible="true"
            :label="pageStep === ePageStep.add ? _('w_OfficeHour_Add') :  _('w_OfficeHour_Edit')"
        >
            <template #toolbox>

                <iv-toolbox-back @click="pageToList()" />

            </template>

            <iv-form
                :interface="IAddAndEditForm()"
                :value="inputOfficeHourData"
                @submit="saveAddOrEdit($event)"
            >
                <template #title="{ $attrs, $listeners }">
                    <div class="ml-3 mb-2 w-100">{{ _('w_OfficeHour') }}</div>
                </template>

                <template #dayRanges="{$attrs, $listeners}">
                    <b-form-group class="ml-3">
                        <b-row
                            v-for="(value, index) in officeHourTime"
                            :key="'officeHourTime__' + index"
                        >
                            <b-col>
                                <b-form-select
                                    class="selectWeekWidth mb-2"
                                    v-model="officeHourTime[index].startDay"
                                    :plain="true"
                                    :options="dayRanges.weeks"
                                ></b-form-select>
                            </b-col>

                            <b-col>
                                <span>{{ _('w_To') }}</span>
                            </b-col>

                            <b-col>
                                <b-form-select
                                    class="selectWeekWidth"
                                    v-model="officeHourTime[index].endDay"
                                    :plain="true"
                                    :options="dayRanges.weeks"
                                ></b-form-select>
                            </b-col>

                            <b-col>
                                <b-form-select
                                    class="selectHourWidth"
                                    v-model="officeHourTime[index].startHour"
                                    :plain="true"
                                    :options="dayRanges.hours"
                                ></b-form-select>
                            </b-col>

                            <b-col>
                                <span> ： </span>
                            </b-col>

                            <b-col>
                                <b-form-select
                                    class="selectMinuteWidth"
                                    v-model="officeHourTime[index].startMinute"
                                    :plain="true"
                                    :options="dayRanges.minutes"
                                ></b-form-select>
                            </b-col>

                            <b-col>
                                <span>{{ _('w_To') }}</span>
                            </b-col>

                            <b-col>
                                <b-form-select
                                    class="selectHourWidth"
                                    v-model="officeHourTime[index].endHour"
                                    :plain="true"
                                    :options="dayRanges.hours"
                                ></b-form-select>
                            </b-col>

                            <b-col>
                                <span> ： </span>
                            </b-col>

                            <b-col>
                                <b-form-select
                                    class="selectMinuteWidth"
                                    v-model="officeHourTime[index].endMinute"
                                    :plain="true"
                                    :options="dayRanges.minutes"
                                ></b-form-select>
                            </b-col>

                            <b-col>
                                <b-button
                                    class="button addButton"
                                    variant="success"
                                    type="button"
                                    @click="addOfficeHour()"
                                >
                                    <i class="fa fa-plus"></i>
                                </b-button>
                            </b-col>

                            <b-col>
                                <b-button
                                    v-show="index === 0"
                                    class="button"
                                    variant="danger"
                                    type="button"
                                    style="visibility:hidden"
                                    @click="removeOfficeHour(index)"
                                >
                                    <i class="fa fa-minus"></i>

                                </b-button>
                            </b-col>

                            <b-col>
                                <b-button
                                    v-show="index !== 0"
                                    class="button"
                                    variant="danger"
                                    type="button"
                                    @click="removeOfficeHour(index)"
                                >
                                    <i class="fa fa-minus"></i>

                                </b-button>
                            </b-col>

                        </b-row>
                    </b-form-group>

                </template>

            </iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToList()"
                >{{ _('w_Back') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- view -->
        <iv-card
            v-show="pageStep === ePageStep.view"
            :visible="true"
            :label="_('w_OfficeHour_View')"
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList()" />
            </template>

            <iv-form
                :interface="IViewForm()"
                :value="inputOfficeHourData"
            >
                <!--                <template #sites="{$attrs, $listeners}">-->
                <!--                    <form-label-->
                <!--                        v-bind="$attrs"-->
                <!--                        :value="$attrs.value.map(item => item.name).join(', ')"-->
                <!--                    />-->
                <!--                </template>-->

                <template #dayRanges="{$attrs, $listeners}">
                    <iv-form-label
                        v-bind="$attrs"
                        :value="$attrs.value"
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

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import Datetime from "@/services/Datetime";
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog/Dialog";

const timeItem = {
    startDay: "1",
    endDay: "0",
    startHour: "9",
    startMinute: "0",
    endHour: "21",
    endMinute: "30",
    startDate: new Date(2000, 1, 1, 9, 0),
    endDate: new Date(2000, 1, 1, 21, 30)
};

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    none = "none",
    showResult = "showResult",
    chooseTree = "chooseTree"
}

@Component({
    components: {}
})
export default class GeneralOfficeHour extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

    isSelected: any = [];
    tableMultiple: boolean = true;

    selectedDetail: any = [];

    dayRanges: any = {
        weeks: [
            { value: "0", text: "Sunday" },
            { value: "1", text: "Monday" },
            { value: "2", text: "Tuesday" },
            { value: "3", text: "Wednesday" },
            { value: "4", text: "Thursday" },
            { value: "5", text: "Friday" },
            { value: "6", text: "Saturday" }
        ],
        hours: [],
        minutes: []
    };

    officeHourTime: any = [
        {
            startDay: "1",
            endDay: "0",
            startHour: "9",
            startMinute: "0",
            endHour: "21",
            endMinute: "30",
            startDate: new Date(2000, 1, 1, 9, 0),
            endDate: new Date(2000, 1, 1, 21, 30)
        }
    ];

    inputOfficeHourData: any = {
        objectId: "",
        name: "",
        dayRanges: [],
        type: "",
        siteIdsText: "",
        dayRangesText: ""
    };

    created() {
        this.dayRangesToText();
    }

    mounted() {
        this.initDayRanges();
    }

    clearInputData() {
        this.inputOfficeHourData = {
            objectId: "",
            name: "",
            dayRanges: [
                {
                    startDay: "1",
                    endDay: "0",
                    startDate: new Date(2000, 1, 1, 9, 0),
                    endDate: new Date(2000, 1, 1, 21, 30)
                }
            ]
        };
    }

    initDayRanges() {
        for (let i = 0; i < 25; i++) {
            const tempHour =
                i === 24 ? "00" : i < 10 ? "0" + i.toString() : i.toString();
            const tempValue =
                tempHour + ":00" + (i < 12 || i > 23 ? " am" : " pm");
            const tempObject = { value: i.toString(), text: tempValue };
            this.dayRanges.hours.push(tempObject);
        }

        for (let i = 0; i < 60; i++) {
            const tempMinute =
                i === 60 ? "00" : i < 10 ? "0" + i.toString() : i.toString();
            const tempObject = { value: i.toString(), text: tempMinute };
            this.dayRanges.minutes.push(tempObject);
        }
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    getInputData() {
        this.clearInputData();
        for (const param of this.selectedDetail) {
            this.inputOfficeHourData = {
                objectId: param.objectId,
                name: param.name,
                dayRanges: param.dayRanges,
                siteIdsText: this.idsToText(param.sites),
                // sites: param.sites,
                type: ""
            };
        }
    }

    pageToAdd(type: string) {
        this.pageStep = EPageStep.add;
        if (type === EPageStep.add) {
            this.officeHourTime = [
                {
                    startDay: "1",
                    endDay: "0",
                    startHour: "9",
                    startMinute: "0",
                    endHour: "21",
                    endMinute: "30",
                    startDate: new Date(2000, 1, 1, 9, 0),
                    endDate: new Date(2000, 1, 1, 21, 30)
                }
            ];

            this.clearInputData();
            this.inputOfficeHourData.type = type;
        }
        this.dayRangesToText();
    }

    pageToEdit(type: string) {
        this.pageStep = EPageStep.edit;
        this.getInputData();

        this.inputOfficeHourData.type = type;

        this.officeHourTime = [];

        for (const item of this.inputOfficeHourData.dayRanges) {
            let startHour = parseInt(
                Datetime.DateTime2String(new Date(item.startDate), "HH")
            );
            let startMinute = parseInt(
                Datetime.DateTime2String(new Date(item.startDate), "mm")
            );
            let endHour = parseInt(
                Datetime.DateTime2String(new Date(item.endDate), "HH")
            );
            let endMinute = parseInt(
                Datetime.DateTime2String(new Date(item.endDate), "mm")
            );

            const tempOfficeHourTime = {
                startDay: item.startDay,
                endDay: item.endDay,
                startHour: startHour.toString(),
                startMinute: startMinute.toString(),
                endHour: endHour.toString(),
                endMinute: endMinute.toString(),
                startDate: new Date(
                    2000,
                    1,
                    1,
                    Number(startHour),
                    Number(startMinute)
                ),
                endDate: new Date(
                    2000,
                    1,
                    1,
                    Number(endHour),
                    Number(endMinute)
                )
            };
            this.officeHourTime.push(tempOfficeHourTime);
            this.inputOfficeHourData.dayRanges = JSON.parse(
                JSON.stringify(this.officeHourTime)
            );
        }
        this.dayRangesToText();
    }

    pageToView() {
        this.pageStep = EPageStep.view;
        this.getInputData();
        this.dayRangesToText();
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        (this.$refs.officeHourTable as any).reload();
    }

    addOfficeHour() {
        var tempTimeItem = JSON.parse(JSON.stringify(timeItem));
        this.officeHourTime.push(tempTimeItem);
    }

    removeOfficeHour(index: number) {
        this.officeHourTime.splice(index, 1);
    }

    async saveAddOrEdit(data) {
        if (this.inputOfficeHourData.type === EPageStep.add) {
            data.dayRanges = [];

            for (const item of this.officeHourTime) {
                const startDate = new Date(
                    2000,
                    1,
                    1,
                    item.startHour,
                    item.startMinute
                );
                const endDate = new Date(
                    2000,
                    1,
                    1,
                    item.endHour,
                    item.endMinute
                );

                const dayRanges = {
                    startDay: item.startDay,
                    endDay: item.endDay,
                    startDate: startDate,
                    endDate: endDate
                };

                data.dayRanges.push(dayRanges);
            }

            const datas: any = [
                {
                    name: data.name,
                    dayRanges: data.dayRanges
                }
            ];

            const addParam = {
                datas
            };

            await this.$server
                .C("/office-hour", addParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_OfficeHour_AddFailed"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_OfficeHour_AddFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }

        // edit
        if (this.inputOfficeHourData.type === EPageStep.edit) {
            data.dayRanges = [];

            for (const item of this.officeHourTime) {
                const startDate = new Date(
                    2000,
                    1,
                    1,
                    item.startHour,
                    item.startMinute
                );
                const endDate = new Date(
                    2000,
                    1,
                    1,
                    item.endHour,
                    item.endMinute
                );

                const dayRanges = {
                    startDay: item.startDay,
                    endDay: item.endDay,
                    startDate: startDate,
                    endDate: endDate
                };

                data.dayRanges.push(dayRanges);
            }

            const datas: any = [
                {
                    // siteIds: data.siteIds,
                    name: data.name,
                    dayRanges: data.dayRanges,
                    objectId: data.objectId
                }
            ];

            const editParam = {
                datas
            };

            await this.$server
                .U("/office-hour", editParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_OfficeHour_EditFailed"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_OfficeHour_EditFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_OfficeHour_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const param of this.selectedDetail) {
                    const deleteParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    this.$server
                        .D("/office-hour", deleteParam)
                        .then((response: any) => {
                            for (const returnValue of response) {
                                if (returnValue.statusCode === 200) {
                                    this.pageToList();
                                }
                                if (returnValue.statusCode === 500) {
                                    Dialog.error(this._("w_DeleteFailed"));
                                    return false;
                                }
                            }
                        })
                        .catch((e: any) => {
                            if (
                                e.res &&
                                e.res.statusCode &&
                                e.res.statusCode == 401
                            ) {
                                return ResponseFilter.base(this, e);
                            }

                            console.log(e);
                        });
                }
            }
        );
    }

    showFirst(value) {
        if (value.length >= 2) {
            return value.map(item => item.name)[0] + "...";
        }
        if (value.length === 1) {
            return value.map(item => item.name)[0];
        }
        if (value.length == 0) {
            return "";
        }
    }

    show30Words(
        value: any,
        startWord: number = 0,
        endWord: number = 30
    ): string {
        return value.length < endWord
            ? value.substring(startWord, endWord)
            : value.substring(startWord, endWord) + "...";
    }

    idsToText(value: any): string {
        let result = "";
        for (const val of value) {
            result += val.name + ", ";
        }
        result = result.substring(0, result.length - 2);
        return result;
    }

    dayRangesToText(): string {
        let showData = "";

        if (this.inputOfficeHourData && this.inputOfficeHourData.dayRanges) {
            for (let dayRange of this.inputOfficeHourData.dayRanges) {
                let tempDateTimeNumber = {
                    startDay: parseInt(dayRange.startDay),
                    startHour: parseInt(
                        Datetime.DateTime2String(
                            new Date(dayRange.startDate),
                            "HH"
                        )
                    ),
                    startMinute: parseInt(
                        Datetime.DateTime2String(
                            new Date(dayRange.startDate),
                            "mm"
                        )
                    ),
                    endDay: parseInt(dayRange.endDay),
                    endHour: parseInt(
                        Datetime.DateTime2String(
                            new Date(dayRange.endDate),
                            "HH"
                        )
                    ),
                    endMinute: parseInt(
                        Datetime.DateTime2String(
                            new Date(dayRange.endDate),
                            "mm"
                        )
                    )
                };

                let tempDateTime = {
                    startDay: this.getWeekText(tempDateTimeNumber.startDay),
                    startHour: this.getNumber10plus0(
                        tempDateTimeNumber.startHour
                    ),
                    startMinute: this.getNumber10plus0(
                        tempDateTimeNumber.startMinute
                    ),
                    endDay: this.getWeekText(tempDateTimeNumber.endDay),
                    endHour: this.getNumber10plus0(tempDateTimeNumber.endHour),
                    endMinute: this.getNumber10plus0(
                        tempDateTimeNumber.endMinute
                    )
                };

                showData += `${tempDateTime.startDay}`;
                showData += `~`;
                showData += `${tempDateTime.endDay}`;
                showData += ` `;
                showData += `${tempDateTime.startHour}`;
                showData += `:`;
                showData += `${tempDateTime.startMinute}`;
                showData += ` ~ `;
                showData += `${tempDateTime.endHour}`;
                showData += `:`;
                showData += `${tempDateTime.endMinute}`;
                showData += ` , `;
            }
        }

        // 去掉結尾,
        this.inputOfficeHourData.dayRanges = showData.substring(
            0,
            showData.lastIndexOf(",")
        );
        return this.inputOfficeHourData.dayRanges;
    }

    getWeekText(value: any): string {
        return !isNaN(value) && value > -1 && value < 7
            ? this._(`w_Week_${value.toString()}` as any)
            : this._("w_Week_Unknow");
    }

    getNumber10plus0(value: any): string {
        let result = "00";
        if (!isNaN(value)) {
            result = value < 10 ? "0" + value.toString() : value.toString();
        }
        return result;
    }

    sortOutTableDataFromApi(data: any) {
        let showData = "";
        if (data && data.row && data.row.dayRanges) {
            for (let dayRange of data.row.dayRanges) {
                let tempDateTimeNumber = {
                    startDay: parseInt(dayRange.startDay),
                    startHour: parseInt(
                        Datetime.DateTime2String(
                            new Date(dayRange.startDate),
                            "HH"
                        )
                    ),
                    startMinute: parseInt(
                        Datetime.DateTime2String(
                            new Date(dayRange.startDate),
                            "mm"
                        )
                    ),
                    endDay: parseInt(dayRange.endDay),
                    endHour: parseInt(
                        Datetime.DateTime2String(
                            new Date(dayRange.endDate),
                            "HH"
                        )
                    ),
                    endMinute: parseInt(
                        Datetime.DateTime2String(
                            new Date(dayRange.endDate),
                            "mm"
                        )
                    )
                };

                let tempDateTime = {
                    startDay: this.getWeekText(tempDateTimeNumber.startDay),
                    startHour: this.getNumber10plus0(
                        tempDateTimeNumber.startHour
                    ),
                    startMinute: this.getNumber10plus0(
                        tempDateTimeNumber.startMinute
                    ),
                    endDay: this.getWeekText(tempDateTimeNumber.endDay),
                    endHour: this.getNumber10plus0(tempDateTimeNumber.endHour),
                    endMinute: this.getNumber10plus0(
                        tempDateTimeNumber.endMinute
                    )
                };

                showData += `${tempDateTime.startDay}`;
                showData += `~`;
                showData += `${tempDateTime.endDay}`;
                showData += ` `;
                showData += `${tempDateTime.startHour}`;
                showData += `:`;
                showData += `${tempDateTime.startMinute}`;
                showData += ` ~ `;
                showData += `${tempDateTime.endHour}`;
                showData += `:`;
                showData += `${tempDateTime.endMinute}`;
                showData += `<br>`;
            }
        }

        return showData;
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
             * @uiLabel - ${this._("w_OfficeHour_Name")}
             */
            name: string;


            /**
             * @uiLabel - ${this._("w_Description")}
             */
            dayRanges: string;


            /**
             * @uiLabel - ${this._("w_Sites")}
             */
            sites: string;

            Actions?: any;

            }
        `;
    }

    IAddAndEditForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_OfficeHour_Name")}
                 * @uiPlaceHolder - ${this._("w_OfficeHour_Name")}
                 * @uiType - ${
                     this.inputOfficeHourData.type === EPageStep.add
                         ? "iv-form-string"
                         : "iv-form-label"
                 }
                */
                name: string;

                title?: any;

                /**
                 * @uiLabel - ${this._("w_Description")}
                 * @uiPlaceHolder - ${this._("w_Description")}
                 */
                dayRanges?: any;

            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_OfficeHour_Name")}
                 * @uiType - iv-form-label
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Description")}
                 * @uiType - iv-form-label
                 */
                dayRanges: string;

                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiType - iv-form-label
                 */
                siteIdsText: string;

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
.selectWeekWidth {
    width: 130px;
}

.selectHourWidth {
    width: 130px;
}

.selectMinuteWidth {
    width: 80px;
}
</style>
