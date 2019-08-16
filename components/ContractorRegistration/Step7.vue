<template>
    <div>
        <!-- 主頁 -->

        <b-row v-show="pageStep === ePageStep.list">
            <b-col cols="11">
                <h5 class="col-md-12 mb-0 mt-4">{{_('w_ViewPTW_Step7_PersonList')}}</h5>
            </b-col>

            <b-col
                cols="1"
                :hidden="permission"
            >
                <b-button
                    class="col-md-12 mb-3 mt-4"
                    variant="primary"
                    type="button"
                    @click="pageToAdd"
                >{{_('w_ViewPTW_Step7_AddPerson')}}
                </b-button>
            </b-col>

        </b-row>

        <table
            v-show="
                    pageStep===ePageStep.list"
            class="table b-table table-striped table-hover text-center"
        >

            <thead>
                <tr>
                    <th
                        v-for="(value, index) in personTable.title"
                        :key="'title_' + index"
                    >{{ value }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="(value, index) in personTable.tableDataFromApi"
                    :key="'data_' + index"
                >

                    <td class="align-middle">{{ value.phone }}</td>
                    <td class="align-middle">{{ value.name }}</td>
                    <td class="align-middle">{{ value.occupation }}</td>
                    <td class="align-middle">{{ value.nric }}</td>
                    <td class="align-middle">{{ value.shift }}</td>
                    <td class="align-middle">{{ value.unitNo }}</td>
                    <td class="align-middle">{{ value.vehicle }}</td>
                    <td class="align-middle">{{ value.companyName }}</td>
                    <td>
                        <b-button
                            variant="transparent"
                            @click="pageToEdit(value, index)"
                            :disabled="permission"
                        >
                            <i class="fa fa-pencil text-dark"></i>
                        </b-button>
                    </td>
                    <td>
                        <b-button
                            variant="transparent"
                            @click="doDelete(index)"
                            :disabled="permission"
                        >
                            <i class="fa fa-trash-o text-dark"></i>
                        </b-button>
                    </td>
                </tr>
            </tbody>
        </table>

        <iv-auto-card
            v-show="pageStep === ePageStep.edit || pageStep === ePageStep.add"
            :label="pageStep === ePageStep.add ? _('w_ViewPTW_Step7_AddPerson') : _('w_ViewPTW_Step7_EditPerson')"
            class="mt-3"
        >
            <template #toolbox>

                <iv-toolbox-back
                    @click="pageToList()"
                    v-show="pageStep === ePageStep.add"
                />

            </template>

            <iv-form
                :interface="IForm()"
                :value="inputFormData"
                @submit="doSubmit($event)"
            >

                <template #nric="{ $attrs, $listeners }">
                    <iv-form-string
                        v-bind="$attrs"
                        v-on="$listeners"
                    >
                        {{$attrs}}
                    </iv-form-string>
                </template>

                <template #contractorIsRequired>
                    <span class="font-red col-md-12 mb-3 mt-5">* {{ _('w_ViewPTW_Step_AsteriskIsRequired') }}</span>
                </template>

            </iv-form>

            <template #footer-before>
                <b-button
                    v-show="pageStep === ePageStep.add"
                    variant="dark"
                    size="lg"
                    @click="pageToList()"
                >{{ _('w_Back') }}
                </b-button>
            </template>

        </iv-auto-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import Dialog from "@/services/Dialog";
import { IStep7, IWorkPermitPerson } from ".";

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    remove = "remove"
}

@Component({
    components: {}
})
export class Step7 extends Vue {
    // Prop
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {}
    })
    selectedDetail: any;

    @Prop({
        type: Boolean,
        default: function() {
            return false;
        }
    })
    permission: boolean;

    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

    shiftSelectItem: any = [];

    personTable: any = {
        title: [],
        tableDataFromApi: this.selectedDetail.persons ? this.selectedDetail.persons : []
    };
// this.personTable.tableDataFromApi ? this.personTable.tableDataFromApi :

    inputFormData: IWorkPermitPerson = {
        name: "",
        phone: "",
        nric: "",
        occupation: "",
        unitNo: "",
        vehicle: "",
        companyName: "",
        shift: ""
    };

    created() {}

    mounted() {
        this.initData();
    }

    @Watch("selectedDetail", { deep: true })
    private ptwIdChanged(newVal, oldVal) {
        this.initInputFormData();
    }

    initInputFormData() {

        if (this.selectedDetail.persons) {
            this.personTable.tableDataFromApi = this.selectedDetail.persons;
        } else {
            this.personTable.tableDataFromApi = [];
        }

    }

    initData() {
        this.shiftSelectItem = {
            day: this._("w_ViewPTW_Step7_Day"),
            night: this._("w_ViewPTW_Step7_Night"),
            midnight: this._("w_ViewPTW_Step7_Midnight")
        };

        this.personTable.title = [
            this._("w_ViewPTW_Step2_ContactNumber"),
            this._("w_ViewPTW_Step7_FullName"),
            this._("w_ViewPTW_Step7_Occupation"),
            this._("w_ViewPTW_Step7_NRIC"),
            this._("w_ViewPTW_Step7_Shift"),
            this._("w_Invitation_Unit"),
            this._("w_ViewPTW_Step7_Vehicle"),
            this._("w_ViewPTW_Step7_Company"),
            this._("w_ViewPTW_Step7_EditPerson"),
            this._("w_ViewPTW_Step7_RemovePerson")
        ];

        // this.personTable.tableDataFromApi = [
        //     {
        //         phone: 12345647890,
        //         name: 'sci',
        //         occupation: 'Plumber',
        //         nric: '423N',
        //         shift: "day",
        //         unit: '04-45',
        //         vehicle: 'SGX-23423',
        //         company: 'ABC Corp',
        //     },
        //     {
        //         phone: 12345647890,
        //         name: 'zh',
        //         occupation: 'Foreman',
        //         nric: '473Z',
        //         shift: "midnight",
        //         unit: '04-45',
        //         vehicle: 'SGX-23003',
        //         company: 'ABC Corp',
        //     },
        // ];
    }

    clearInputFormData() {
        this.inputFormData = {
            name: "",
            phone: "",
            nric: "",
            occupation: "",
            unitNo: "",
            vehicle: "",
            companyName: "",
            shift: ""
        };
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        console.log(
            "this.personTable.tableDataFromApi ~ ",
            this.personTable.tableDataFromApi
        );
    }

    pageToAdd() {
        this.clearInputFormData();
        this.pageStep = EPageStep.add;
    }

    pageToEdit(item: any, index: number) {
        this.clearInputFormData();
        this.pageStep = EPageStep.edit;
        this.inputFormData = item;
        this.personTable.tableDataFromApi.splice(index, 1);
    }

    doSubmit(data) {

        let personObject: any = {
            name: data.name,
            phone: data.phone,
            nric: data.nric,
            occupation: data.occupation,
            unitNo: data.unitNo,
            vehicle: data.vehicle,
            companyName: data.companyName,
            shift: data.shift
        };

        if (!this.NRICRegExp(personObject.nric)) {
            Dialog.error(this._("w_ViewPTW_Step7_NRICFIN_PlaceHolder"));
            return;
        }

        this.personTable.tableDataFromApi.push(personObject);
        this.pageStep = EPageStep.list;

        this.$emit("step7", this.personTable.tableDataFromApi);
    }

    NRICRegExp(data) {
        var pattern = new RegExp("^[A-Za-z0-9]+$");

        if (data.length != 4) {
            return false;
        }
        if (!pattern.test(data)) {
            return false;
        }

        return true;
    }

    doDelete(index: number) {
        Dialog.confirm(
            this._("w_ViewPTW_Step7_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                this.personTable.tableDataFromApi.splice(index, 1);
            }
        );
    }

    IForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step7_FullName")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step7_FullName")}
                 */
                name: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step2_ContactNumber")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step2_ContactNumber")}
                 */
                phone: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step7_NRICFIN")}
                 * @uiPlaceHolder - ${this._(
                     "w_ViewPTW_Step7_NRICFIN_PlaceHolder"
                 )}
                 */
                nric: string;



                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step7_Occupation")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step7_Occupation")}
                 */
                occupation: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Unit")}
                 * @uiPlaceHolder - ${this._("w_Invitation_Unit")}
                 */
                unitNo: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step7_Vehicle")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step7_Vehicle")}
                 */
                vehicle?: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step7_Company")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step7_Company")}
                 */
                companyName: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step7_Shift")}
                 */
                shift: ${toEnumInterface(this.shiftSelectItem as any, false)};

                  contractorIsRequired?: any;

            }
        `;
    }
}

export default Step7;
Vue.component("step7", Step7);
</script>

<style lang="scss" scoped>
.font-red {
    color: red;
}
</style>
