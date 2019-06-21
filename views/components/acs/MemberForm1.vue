<template>
    <div class="animated fadeIn">
        <iv-card
            v-show="pageStep === ePageStep.list"
            :label="_('w_Member_List')"
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
                <iv-toolbox-add @click="pageToAdd(ePageStep.add)" /> </template>

            <iv-table
                ref="listTable"
                :interface="ITableList()"
                :multiple="tableMultiple"
                :server="{ path: '/acs/member' }"
                @selected="selectedItem($event)"
            >

                <template #CardNumber="{$attrs}">
                    {{ anysisTableColumn($attrs.row, "CardNumber") }}
                </template>

                <template #StartDate="{$attrs}">
                    {{ dateToYYYY_MM_DD($attrs.value) }}
                </template>

                <template #EndDate="{$attrs}">
                    {{ dateToYYYY_MM_DD($attrs.value) }}
                </template>

                <template #Department="{$attrs}">
                    {{ anysisTableColumn($attrs.row, "Department") }}
                </template>

                <template #CostCenter="{$attrs}">
                    {{ anysisTableColumn($attrs.row, "CostCenter") }}
                </template>

                <template #Actions="{$attrs, $listeners}">

                    <iv-toolbox-more
                        size="sm"
                        :disabled="isSelected.length !== 1"
                    >
                        <iv-toolbox-view @click="pageToView" />
                        <iv-toolbox-edit @click="pageToEdit(ePageStep.edit)" />
                        <iv-toolbox-delete @click="doDelete" />
                    </iv-toolbox-more>
                </template>

            </iv-table>
        </iv-card>

        <!-- add -->
        <iv-auto-card
            v-show="pageStep === ePageStep.add"
            :visible="true"
            :label="pageStep === ePageStep.add ? _('w_Member_Add') :  _('w_Member_Edit')"
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList()" />
            </template>

            <iv-form
                :interface="IAddAndEditForm()"
                :value="inputFormData"
                @update:personPhoto="updateShowPhoto($event)"
                @submit="saveAddOrEdit($event)"
            >

                <template #info="{ $attr }">
                    <h4 class="ml-3 mt-4 font-weight-bold">
                        {{ _('w_Member_Info') }}
                    </h4>
                </template>

                <template #imageSrc="{ $attrs, $listeners}">
                    <label class="col-md-12">
                        {{_("w_Member_PersonPic")}}
                    </label>
                    <img
                        class="imgSide"
                        v-if="newImgSrc"
                        v-bind="$attrs"
                        v-on="$listeners"
                        :src="newImgSrc"
                    />
                </template>

                <template #permissionTable="{ $attr }">
                    <h4 class="ml-3 mt-4 font-weight-bold">
                        {{ _('w_Member_PermissionTable') }}
                    </h4>
                </template>

                <!-- Morris -->
                <template #premissionList>
                    <iv-sort-select
                        v-if="premissionOptions.length > 0"
                        v-model="inputFormData.premissionSelected"
                        class="col-md-12"
                        :options="premissionOptions"
                    ></iv-sort-select>
                </template>

                <template #tabItem>

                    <iv-tab
                        class="col-md-12 mt-5"
                        ref="tab"
                        :active="1"
                        @mounted="doTabMount"
                    >

                        <template #1-title>{{ _('w_Member_PersonInfo') }}</template>
                        <template #1>
                            <iv-form
                                :interface="ITabForm1()"
                                :value="inputFormData"
                            >
                                <template #personInfo="{ $attr }">
                                    <h4 class="ml-3 font-weight-bold">
                                        {{ _('w_Member_PersonInfo') }}
                                    </h4>
                                </template>

                                <template #companyInfo="{ $attr }">
                                    <h4 class="ml-3 mt-4 font-weight-bold">
                                        {{ _('w_Member_CompanyInfo') }}
                                    </h4>
                                </template>

                            </iv-form>
                        </template>

                        <template #2-title>{{ _('w_Member_General') }}</template>
                        <template #2>
                            <iv-form
                                :interface="ITabForm2()"
                                :value="inputFormData"
                            >
                                <template #carLicenseData="{ $attr }">
                                    <h4 class="ml-3 font-weight-bold">
                                        {{ _('w_Member_CarLicenseData') }}
                                    </h4>
                                </template>

                                <template #accountInfo="{ $attr }">
                                    <h4 class="ml-3 mt-4 font-weight-bold">
                                        {{ _('w_Member_AccountInfo') }}
                                    </h4>
                                </template>

                            </iv-form>
                        </template>

                        <template #3-title>{{ _('w_Member_CardRecord') }}</template>
                        <template #3>
                            <iv-form
                                :interface="ITabForm3()"
                                :value="inputFormData"
                            >
                                <template #cardRecord="{ $attr }">
                                    <h4 class="ml-3 font-weight-bold">
                                        {{ _('w_Member_CardRecord') }}
                                    </h4>
                                </template>

                                <template #carLicenseRecord="{ $attr }">
                                    <h4 class="ml-3 mt-4 font-weight-bold">
                                        {{ _('w_Member_CarLicenseRecord') }}
                                    </h4>
                                </template>

                            </iv-form>
                        </template>

                        <template #4-title>{{ _('w_Member_SelectTemplate') }}</template>
                        <template #4>
                            <iv-form
                                :interface="ITabForm4()"
                                :value="inputFormData"
                                @update:cardTemplate="updateShowPhoto($event)"
                            >

                                <template #imageSrc="{ $attrs, $listeners}">
                                    <label class="col-md-12">
                                        {{_("w_Member_CardPhoto")}}
                                    </label>
                                    <img
                                        class="imgCard"
                                        v-if="newImgSrc"
                                        v-bind="$attrs"
                                        v-on="$listeners"
                                        :src="newImgSrc"
                                    />
                                </template>

                            </iv-form>
                        </template>

                        <template #5-title>{{ _('w_Member_Other') }}</template>
                        <template #5>
                            <iv-form
                                :interface="ITabForm5()"
                                :value="inputFormData"
                            >
                                <template #censusRecord="{ $attr }">
                                    <h4 class="ml-3 font-weight-bold">
                                        {{ _('w_Member_CensusRecord') }}
                                    </h4>
                                </template>

                                <template #parkingViolation="{ $attr }">
                                    <h4 class="ml-3 mt-4 font-weight-bold">
                                        {{ _('w_Member_ParkingViolation') }}
                                    </h4>
                                </template>
                            </iv-form>
                        </template>

                    </iv-tab>

                </template>

                <!-- Morris -->

                <template #test="{ $attrs, $listeners }">
                    <div class="mt-2 ml-3 mb-3">
                        <b-button @click="pageToEmailTest($event)">{{ _('w_User_TestEmail') }}
                        </b-button>
                    </div>
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
        <iv-auto-card
            v-show="pageStep === ePageStep.view"
            :visible="true"
            :label="_('w_User_ViewUser') "
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

        </iv-auto-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import ResponseFilter from "@/services/ResponseFilter";
import { ToolboxBack } from "@/components/Toolbox/toolbox-back.vue";
import Dialog from "@/services/Dialog/Dialog";
import Datetime from "@/services/Datetime";
import ImageBase64 from "@/services/ImageBase64";

// Sort Select
import { ISortSelectOption } from "@/components/SortSelect";
import SortSelect from "@/components/SortSelect/SortSelect.vue";

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    none = "none"
}

@Component({
    components: {
        ToolboxBack,
        SortSelect
    }
})
export default class MemberForm1 extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

    isSelected: any = [];
    tableMultiple: boolean = true;

    selectedDetail: any = [];

    workGroupSelectItem: any = {};
    cardTemplateSelectItem: any = {};

    inputTestEmail: string = "";
    newImg = new Image();
    newImgSrc = "";
    premissionOptions: ISortSelectOption[] = [];
    tabMounted: boolean = false;
    doTabMount() {
        this.tabMounted = true;
    }

    inputFormData: any = {
        // Master
        objectId: "",
        premissionSelected: [],
        companyName: "",
        personType: "",
        employeeNumber: "",
        chineseName: "",
        englishName: "",
        cardNumber: "",
        personType1: "",
        cardAllNumber: "",
        cardCustodian: "",
        startDate: null,
        endDate: null,
        lastEditPerson: "",
        lastEditTime: "",

        // tab1
        extensionNumber: "",
        MVPN: "",
        phone: "",
        email: "",
        gender: "",
        birthday: null,
        department: "",
        costCenter: "",
        area: "",
        workArea: "",
        registrationDate: null,
        resignationDate: null,

        // tab2
        carLicenseCategory: "",
        cardLicense: "",
        carLicense: "",
        carLicense1: "",
        carLicense2: "",
        carLicense3: "",
        account: "",
        password: "",

        // tab3
        resignationNote: "",
        resignationRecordCardRecord: "",
        reasonForCard1: "",
        historyForCard1: "",
        dateForCard1: null,
        reasonForCard2: "",
        historyForCard2: "",
        dateForCard2: null,
        reasonForCard3: "",
        historyForCard3: "",
        dateForCard3: null,
        reasonForApplication1: "",
        dateForApplication1: null,
        reasonForApplication2: "",
        dateForApplication2: null,
        reasonForApplication3: "",
        dateForApplication3: null,
        resignationRecordCarLicense: ""

        // tab4
    };

    clearInputData() {
        this.premissionOptions = [];
        this.inputFormData = {
            // Master
            objectId: "",
            premissionSelected: [],
            companyName: "",
            personType: "",
            employeeNumber: "",
            chineseName: "",
            englishName: "",
            cardNumber: "",
            personType1: "",
            cardAllNumber: "",
            cardCustodian: "",
            startDate: null,
            endDate: null,
            lastEditPerson: "",
            lastEditTime: "",

            // tab1
            extensionNumber: "",
            MVPN: "",
            phone: "",
            email: "",
            gender: "",
            birthday: null,
            department: "",
            costCenter: "",
            area: "",
            workArea: "",
            registrationDate: null,
            resignationDate: null,

            // tab2
            carLicenseCategory: "",
            cardLicense: "",
            carLicense: "",
            carLicense1: "",
            carLicense2: "",
            carLicense3: "",
            account: "",
            password: "",

            // tab3
            resignationNote: "",
            resignationRecordCardRecord: "",
            reasonForCard1: "",
            historyForCard1: "",
            dateForCard1: null,
            reasonForCard2: "",
            historyForCard2: "",
            dateForCard2: null,
            reasonForCard3: "",
            historyForCard3: "",
            dateForCard3: null,
            reasonForApplication1: "",
            dateForApplication1: null,
            reasonForApplication2: "",
            dateForApplication2: null,
            reasonForApplication3: "",
            dateForApplication3: null,
            resignationRecordCarLicense: ""

            // tab4
        };
    }

    created() {}

    mounted() {
        this.initSelectItemWorkGroup();
        this.initDepartment();
    }

    async initSelectItemWorkGroup() {
        this.workGroupSelectItem = {};

        await this.$server
            .R("/acs/workgroup")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response.results) {
                        // 自定義 sitesSelectItem 的 key 的方式
                        this.workGroupSelectItem[returnValue.objectId] =
                            returnValue.groupname;
                    }
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    async initDepartment() {
        await this.$server
            .R("/acs/member")
            .then((response: any) => {
                // console.log('returnValue - ', response.results.CustomFields);
                if (response != undefined) {
                    for (const returnValue of response.results.CustomFields) {
                        console.log("returnValue - ", returnValue);
                    }
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    getInputData() {
        this.clearInputData();

        if (this.selectedDetail[0] != undefined) {
            let detailData = this.selectedDetail[0];

            console.log(detailData);

            // Master form
            if (detailData.objectId != undefined) {
                this.inputFormData.objectId = detailData.objectId;
            }

            if (detailData.AccessRules != undefined) {
                for (let rules of detailData.AccessRules) {
                    // Morris === premissionTableAPI: tableid => ObjectToken, show: ObjectName
                    if (
                        rules.ObjectToken != undefined &&
                        rules.ObjectName != undefined
                    ) {
                        let tempData = {
                            value: rules.value,
                            text: rules.text
                        };
                        this.inputFormData.premissionSelected.push(
                            rules.ObjectToken
                        );
                    }
                }
            }

            if (detailData.ApbWorkgroupId != undefined) {
                this.inputFormData.personType = detailData.ApbWorkgroupId;
                this.inputFormData.personType1 = detailData.ApbWorkgroupId;
            }

            if (detailData.EmployeeNumber != undefined) {
                this.inputFormData.employeeNumber = detailData.EmployeeNumber;
            }

            if (detailData.LastName != undefined) {
                this.inputFormData.chineseName = detailData.LastName;
            }

            if (detailData.FirstName != undefined) {
                this.inputFormData.englishName = detailData.FirstName;
            }

            if (
                detailData.Credentials != undefined &&
                detailData.Credentials[0] != undefined &&
                detailData.Credentials[0].CardNumber != undefined
            ) {
                this.inputFormData.cardNumber =
                    detailData.Credentials[0].CardNumber;
                this.inputFormData.cardAllNumber =
                    detailData.Credentials[0].CardNumber;
            }

            if (
                detailData.StartDate != undefined &&
                detailData.StartDate != ""
            ) {
                try {
                    this.inputFormData.startDate = new Date(
                        detailData.StartDate
                    );
                } catch (e) {
                    console.log(e);
                }
            }

            if (detailData.EndDate != undefined && detailData.EndDate != "") {
                try {
                    this.inputFormData.endDate = new Date(detailData.EndDate);
                } catch (e) {
                    console.log(e);
                }
            }

            // tab1
            if (detailData.PhoneNumber != undefined) {
                this.inputFormData.extensionNumber = detailData.PhoneNumber;
            }
            if (detailData.MobileNumber != undefined) {
                this.inputFormData.phone = detailData.MobileNumber;
            }
            if (detailData.Email != undefined) {
                this.inputFormData.email = detailData.Email;
            }
            if (
                detailData.DateOfBirth != undefined &&
                detailData.DateOfBirth != ""
            ) {
                try {
                    this.inputFormData.birthday = new Date(
                        detailData.DateOfBirth
                    );
                } catch (e) {
                    console.log(e);
                }
            }

            if (detailData.CustomFields != undefined) {
                for (let content of detailData.CustomFields) {
                    if (
                        content.FiledName != undefined &&
                        content.FieldValue != undefined
                    ) {
                        // Master
                        if (content.FiledName == "CustomTextBoxControl6__CF") {
                            this.inputFormData.companyName = content.FieldValue;
                        }
                        if (content.FiledName == "CustomTextBoxControl2__CF") {
                            this.inputFormData.cardCustodian =
                                content.FieldValue;
                        }
                        if (content.FiledName == "CustomTextBoxControl3__CF") {
                            this.inputFormData.lastEditPerson =
                                content.FieldValue;
                        }
                        if (content.FiledName == "CustomDateControl2__CF") {
                            this.inputFormData.lastEditTime =
                                content.FieldValue;
                        }

                        // tab1
                        if (
                            content.FiledName == "CustomTextBoxControl5__CF_CF"
                        ) {
                            this.inputFormData.MVPN = content.FieldValue;
                        }

                        if (
                            content.FiledName == "CustomDropdownControl2__CF_CF"
                        ) {
                            this.inputFormData.gender = content.FieldValue;
                        }

                        if (
                            content.FiledName ==
                            "CustomTextBoxControl5__CF_CF_CF"
                        ) {
                            this.inputFormData.department = content.FieldValue;
                        }

                        if (
                            content.FiledName ==
                            "CustomTextBoxControl5__CF_CF_CF_CF"
                        ) {
                            this.inputFormData.costCenter = content.FieldValue;
                        }

                        if (
                            content.FiledName ==
                            "CustomTextBoxControl5__CF_CF_CF_CF_CF"
                        ) {
                            this.inputFormData.area = content.FieldValue;
                        }

                        if (
                            content.FiledName ==
                            "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF"
                        ) {
                            this.inputFormData.workArea = content.FieldValue;
                        }

                        if (
                            content.FiledName == "CustomDateControl1__CF_CF_CF"
                        ) {
                            try {
                                this.inputFormData.registrationDate = new Date(
                                    content.FieldValue
                                );
                            } catch (e) {
                                console.log(e);
                            }
                        }

                        if (content.FiledName == "CustomDateControl1__CF") {
                            this.inputFormData.resignationDate =
                                content.FieldValue;
                        }

                        // tab2
                        if (content.FiledName == "CustomDropdownControl2__CF") {
                            this.inputFormData.carLicenseCategory =
                                content.FieldValue;
                        }

                        if (
                            content.FiledName ==
                            "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF"
                        ) {
                            this.inputFormData.cardLicense = content.FieldValue;
                        }

                        if (
                            content.FiledName ==
                            "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF"
                        ) {
                            this.inputFormData.carLicense = content.FieldValue;
                        }

                        if (content.FiledName == "CustomTextBoxControl5__CF") {
                            this.inputFormData.carLicense1 = content.FieldValue;
                        }

                        if (
                            content.FiledName ==
                            "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF"
                        ) {
                            this.inputFormData.carLicense2 = content.FieldValue;
                        }

                        if (
                            content.FiledName ==
                            "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF"
                        ) {
                            this.inputFormData.carLicense3 = content.FieldValue;
                        }

                        // tab3
                        if (
                            content.FiledName == "CustomTextBoxControl7__CF_CF"
                        ) {
                            this.inputFormData.resignationNote =
                                content.FieldValue;
                        }
                        if (
                            content.FiledName ==
                            "CustomTextBoxControl7__CF_CF_CF"
                        ) {
                            this.inputFormData.resignationRecordCardRecord =
                                content.FieldValue;
                        }
                        if (
                            content.FiledName == "CustomDropdownControl3__CF_CF"
                        ) {
                            this.inputFormData.reasonForCard1 =
                                content.FieldValue;
                        }
                        if (
                            content.FiledName ==
                            "CustomTextBoxControl7__CF_CF_CF_CF"
                        ) {
                            this.inputFormData.historyForCard1 =
                                content.FieldValue;
                        }
                        if (
                            content.FiledName ==
                            "CustomDateControl3__CF_CF_CF_CF_CF"
                        ) {
                            try {
                                this.inputFormData.dateForCard1 = new Date(
                                    content.FieldValue
                                );
                            } catch (e) {
                                console.log(e);
                            }
                        }

                        if (
                            content.FiledName ==
                            "CustomDropdownControl3__CF_CF_CF"
                        ) {
                            this.inputFormData.reasonForCard2 =
                                content.FieldValue;
                        }
                        if (
                            content.FiledName ==
                            "CustomTextBoxControl7__CF_CF_CF_CF_CF"
                        ) {
                            this.inputFormData.historyForCard2 =
                                content.FieldValue;
                        }
                        if (
                            content.FiledName ==
                            "CustomDateControl3__CF_CF_CF_CF_CF_CF"
                        ) {
                            try {
                                this.inputFormData.dateForCard2 = new Date(
                                    content.FieldValue
                                );
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        if (
                            content.FiledName ==
                            "CustomDropdownControl3__CF_CF_CF_CF"
                        ) {
                            this.inputFormData.reasonForCard3 =
                                content.FieldValue;
                        }
                        if (
                            content.FiledName ==
                            "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF"
                        ) {
                            this.inputFormData.historyForCard3 =
                                content.FieldValue;
                        }

                        if (
                            content.FiledName ==
                            "CustomDateControl3__CF_CF_CF_CF_CF_CF_CF"
                        ) {
                            try {
                                this.inputFormData.dateForCard3 = new Date(
                                    content.FieldValue
                                );
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        if (
                            content.FiledName ==
                            "CustomDropdownControl3__CF_CF_CF_CF_CF"
                        ) {
                            this.inputFormData.reasonForApplication1 =
                                content.FieldValue;
                        }
                        if (
                            content.FiledName ==
                            "CustomDateControl3__CF_CF_CF_CF_CF"
                        ) {
                            try {
                                this.inputFormData.dateForApplication1 = new Date(
                                    content.FieldValue
                                );
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        if (
                            content.FiledName ==
                            "CustomDropdownControl3__CF_CF_CF_CF_CF_CF"
                        ) {
                            this.inputFormData.reasonForApplication2 =
                                content.FieldValue;
                        }
                        if (
                            content.FiledName == "CustomDateControl3__CF_CF_CF"
                        ) {
                            try {
                                this.inputFormData.dateForApplication2 = new Date(
                                    content.FieldValue
                                );
                            } catch (e) {
                                console.log(e);
                            }
                        }

                        if (content.FiledName == "CustomDropdownControl3__CF") {
                            this.inputFormData.reasonForApplication3 =
                                content.FieldValue;
                        }
                        if (
                            content.FiledName ==
                            "CustomDateControl3__CF_CF_CF_CF"
                        ) {
                            try {
                                this.inputFormData.dateForApplication3 = new Date(
                                    content.FieldValue
                                );
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        if (
                            content.FiledName ==
                            "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF"
                        ) {
                            this.inputFormData.resignationRecordCarLicense =
                                content.FieldValue;
                        }
                    }
                }
            }

            //     inputFormData: any = {
            //     // Master
            //     objectId
            //     premissionSelected   AccessRules
            //     personType           ApbWorkgroupId
            //     personType1          ApbWorkgroupId
            //     employeeNumber       EmployeeNumber
            //     chineseName          LastName
            //     englishName          FirstName
            //     cardNumber           Credentials[0]CardNumber
            //     cardAllNumber        Credentials[0]CardNumber
            //     startDate            StartDate
            //     endDate              EndDate
            //     companyName          CustomFields -> CustomTextBoxControl6__CF
            //     cardCustodian        CustomFields -> CustomTextBoxControl2__CF
            //     lastEditPerson       CustomFields -> CustomTextBoxControl3__CF
            //     lastEditTime         CustomFields -> CustomDateControl2__CF

            //     // tab1
            //     extensionNumber      PhoneNumber
            //     phone                MobileNumber
            //     email                Email
            //     birthday             DateOfBirth
            //     MVPN                 CustomFields -> CustomTextBoxControl5__CF_CF
            //     gender               CustomFields -> CustomDropdownControl2__CF_CF
            //     department           CustomFields -> CustomTextBoxControl5__CF_CF_CF
            //     costCenter           CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF
            //     area                 CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF_CF
            //     workArea             CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF_CF_CF
            //     registrationDate     CustomFields -> CustomDateControl1__CF_CF_CF
            //     resignationDate      CustomFields -> CustomDateControl1__CF

            //     // tab2
            //     carLicenseCategory   CustomFields -> CustomDropdownControl2__CF
            //     cardLicense          CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF
            //     carLicense           CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF
            //     carLicense1          CustomFields -> CustomTextBoxControl5__CF
            //     carLicense2          CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF
            //     carLicense3          CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF
            //     account
            //     password

            //     // tab3
            //     resignationNote              CustomFields -> CustomTextBoxControl7__CF_CF
            //     resignationRecordCardRecord  CustomFields -> CustomTextBoxControl7__CF_CF_CF
            //     reasonForCard1               CustomFields -> CustomDropdownControl3__CF_CF
            //     historyForCard1              CustomFields -> CustomTextBoxControl7__CF_CF_CF_CF
            //     dateForCard1                 CustomFields -> CustomDateControl3__CF_CF_CF_CF_CF
            //     reasonForCard2               CustomFields -> CustomDropdownControl3__CF_CF_CF
            //     historyForCard2              CustomFields -> CustomTextBoxControl7__CF_CF_CF_CF_CF
            //     dateForCard2                 CustomFields -> CustomDateControl3__CF_CF_CF_CF_CF_CF
            //     reasonForCard3               CustomFields -> CustomDropdownControl3__CF_CF_CF_CF
            //     historyForCard3              CustomFields -> CustomTextBoxControl7__CF_CF_CF_CF_CF_CF
            //     dateForCard3                 CustomFields -> CustomDateControl3__CF_CF_CF_CF_CF_CF_CF
            //     reasonForApplication1        CustomFields -> CustomDropdownControl3__CF_CF_CF_CF_CF
            //     dateForApplication1          CustomFields -> CustomDateControl3__CF_CF_CF_CF_CF
            //     reasonForApplication2        CustomFields -> CustomDropdownControl3__CF_CF_CF_CF_CF_CF
            //     dateForApplication2          CustomFields -> CustomDateControl3__CF_CF_CF
            //     reasonForApplication3        CustomFields -> CustomDropdownControl3__CF
            //     dateForApplication3          CustomFields -> CustomDateControl3__CF_CF_CF_CF
            //     resignationRecordCarLicense  CustomFields -> CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF

            //     // tab4
            // };
        }

        this.pageToAdd();
    }

    async pageToAdd() {
        this.clearInputData();
        this.initSelectItemWorkGroup();
        this.initPremission();
        this.pageStep = EPageStep.add;
    }

    // Morris //
    async initPremission() {
        let param: {
            paging: {
                page: number;
                pageSize: number;
            };
        } = {
            paging: {
                page: 1,
                pageSize: 10000
            }
        };
        await this.$server
            .R("/acs/permissiontable", param)
            .then((response: any) => {
                if (response != undefined) {
                    for (let content of response.results) {
                        if (
                            content.tableid != undefined &&
                            content.tablename != undefined
                        ) {
                            let tempOption: ISortSelectOption = {
                                value: content.tableid,
                                text: content.tablename
                            };
                            this.premissionOptions.push(tempOption);
                        }
                    }
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }
    // Morris //

    async pageToEdit(type: string) {
        this.pageStep = EPageStep.edit;
        this.getInputData();

        this.inputFormData.type = type;

        this.inputFormData.siteIds = JSON.parse(
            JSON.stringify(
                this.inputFormData.siteIds.map(item => item.objectId)
            )
        );
        this.inputFormData.groupIds = JSON.parse(
            JSON.stringify(
                this.inputFormData.groupIds.map(item => item.objectId)
            )
        );
    }

    pageToView() {
        this.pageStep = EPageStep.view;
        this.getInputData();
    }

    pageToList() {
        console.log("000 - ");
        this.pageStep = EPageStep.list;
        console.log("111 - ");
        (this.$refs.listTable as any).reload();
        console.log("222 - ");
    }

    updateShowPhoto(data) {
        if (data) this.uploadFile(data);
    }

    async uploadFile(file) {
        if (file) {
            ImageBase64.fileToBase64(file, (base64 = "") => {
                if (base64 != "") {
                    this.newImg = new Image();
                    this.newImg.src = base64;
                    this.newImg.onload = () => {
                        this.newImgSrc = base64;
                        console.log("newImgSrc", this.newImgSrc);
                        return;
                    };
                } else {
                    Dialog.error(this._("w_Member_ErrorUploadFile"));
                }
            });
        }
    }

    saveAddOrEdit() {}

    async saveAdd(data) {
        const datas: any[] = [
            {
                username: data.username,
                role: data.role,
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
                employeeId: data.employeeId,
                siteIds: data.siteIds !== undefined ? data.siteIds : [],
                groupIds: data.groupIds !== undefined ? data.groupIds : []
            }
        ];

        const addParam = {
            datas
        };

        await this.$server
            .C("/acs/member", addParam)
            .then((response: any) => {
                for (const returnValue of response) {
                    if (returnValue.statusCode === 200) {
                        this.pageToList();
                    }
                    if (returnValue.statusCode === 500) {
                        Dialog.error(this._("w_Member_AddFailed"));
                        return false;
                    }
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                if (e.res.statusCode == 500) {
                    Dialog.error(this._("w_Member_AddFailed"));
                    return false;
                }
                console.log(e);
                return false;
            });
    }

    async saveEdit(data) {
        const datas: any[] = [
            {
                role: data.role,
                name: data.name,
                email: data.email,
                phone: data.phone,
                siteIds: data.siteIds !== undefined ? data.siteIds : [],
                groupIds: data.groupIds !== undefined ? data.groupIds : [],
                objectId: data.objectId
            }
        ];

        const editParam = {
            datas
        };

        await this.$server
            .U("/acs/member", editParam)
            .then((response: any) => {
                for (const returnValue of response) {
                    if (returnValue.statusCode === 200) {
                        this.pageToList();
                    }
                    if (returnValue.statusCode === 500) {
                        Dialog.error(this._("w_Member_EditFailed"));
                        return false;
                    }
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                if (e.res.statusCode == 500) {
                    Dialog.error(this._("w_Member_EditFailed"));
                    return false;
                }
                console.log(e);
                return false;
            });
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_Member_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const param of this.selectedDetail) {
                    const deleteParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    this.$server
                        .D("/acs/member", deleteParam)
                        .then((response: any) => {
                            if (response) {
                                this.pageToList();
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

    showFirst(value): string {
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
        for (let val of value) {
            result += val.name + ", ";
        }
        result = result.substring(0, result.length - 2);
        return result;
    }

    cardSearch(search: string) {
        // TODO: finished search
        // console.log('search - ', search)
        this.searchKeywords(search);
    }

    searchKeywords(search: string) {
        // TODO: finished search
        if (search != "") {
            const accountText = this.inputFormData.username.toLocaleLowerCase();
            const nameText = this.inputFormData.name.toLocaleLowerCase();
            const searchText = search.toLowerCase();
            const searchResult =
                accountText.match(searchText) || nameText.match(searchText);
            return searchResult;
        }
    }

    dateToYYYY_MM_DD(value) {
        return Datetime.DateTime2String(new Date(value), "YYYY-MM-DD");
    }

    // CardNumber: CustomTextBoxControl1__CF
    // Department: CustomTextBoxControl5__CF_CF_CF
    // CostCenter: CustomTextBoxControl5__CF_CF_CF_CF
    anysisTableColumn(row: any, key: string): string {
        let result: string = "";
        if (key == "CardNumber") {
            if (
                row.Credentials != undefined &&
                row.Credentials[0] != undefined &&
                row.Credentials[0].CardNumber != undefined
            ) {
                result = row.Credentials[0].CardNumber;
            }
        } else {
            if (row.CustomFields != undefined) {
                for (let fidled of row.CustomFields) {
                    if (
                        key == "Department" &&
                        fidled.FiledName != undefined &&
                        fidled.FiledName == "CustomTextBoxControl5__CF_CF_CF"
                    ) {
                        if (fidled.FieldValue != undefined) {
                            result = fidled.FieldValue;
                        }
                    }

                    if (
                        key == "CostCenter" &&
                        fidled.FiledName != undefined &&
                        fidled.FiledName == "CustomTextBoxControl5__CF_CF_CF_CF"
                    ) {
                        if (fidled.FieldValue != undefined) {
                            result = fidled.FieldValue;
                        }
                    }
                }
            }
        }

        return result;
    }

    ITableList() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Member_EmployeeNumber1")}
                 */
                EmployeeNumber: string;

                /**
                 * @uiLabel - ${this._("w_Member_CardNumber1")}
                 */
                CardNumber: string;

                /**
                 * @uiLabel - ${this._("w_Member_PersonType1")}
                 */
                PrimaryWorkgroupName: string;

                /**
                 * @uiLabel - ${this._("w_Member_ChineseName1")}
                 */
                LastName: string;

                /**
                 * @uiLabel - ${this._("w_Member_EnglishName1")}
                 */
                FirstName: string;

                /**
                 * @uiLabel - ${this._("w_Member_Department1")}
                 */
                Department: string;

                /**
                 * @uiLabel - ${this._("w_Member_CostCenter1")}
                 */
                CostCenter: string;

                /**
                 * @uiLabel - ${this._("w_Member_StartDate1")}
                 */
                StartDate: string;

                /**
                 * @uiLabel - ${this._("w_Member_EndDate1")}
                 */
                EndDate: string;

                /**
                 * @uiLabel - ${this._("w_Member_Actions")}
                 */
                Actions?: any;
            }
        `;
    }

    IAddAndEditForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Member_CompanyName")}
                 * @uiColumnGroup - row1
                 */
                companyName?: string;

                /**
                 * @uiLabel - ${this._("w_Member_PersonType")}
                 * @uiColumnGroup - row1
                 */
                personType?: ${toEnumInterface(
                    this.workGroupSelectItem as any,
                    false
                )};

                /**
                 * @uiLabel - ${this._("w_Member_EmployeeNumber")}
                 * @uiColumnGroup - row1
                 */
                employeeNumber?: string;

                /**
                 * @uiLabel - ${this._("w_Member_ChineseName")}
                 * @uiColumnGroup - row2
                 */
                chineseName?: string;


                /**
                 * @uiLabel - ${this._("w_Member_EnglishName")}
                 * @uiColumnGroup - row2
                 */
                englishName?: string;


                /**
                 * @uiLabel - ${this._("w_Member_CardNumber")}
                 * @uiColumnGroup - row2
                 */
                cardNumber?: string;


                /**
                 * @uiLabel - ${this._("w_Member_CardType")}
                 * @uiColumnGroup - row3
                 */
                personType1?: ${toEnumInterface(
                    this.workGroupSelectItem as any,
                    false
                )};

                /**
                 * @uiLabel - ${this._("w_Member_CardAllNumber")}
                 * @uiColumnGroup - row3
                 */
                cardAllNumber?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CardCustodian")}
                 * @uiColumnGroup - row3
                 */
                cardCustodian?: string;

               /**
                * @uiLabel - ${this._("w_Member_UpLoadPersonPic")}
                * @uiPlaceHolder - ${this._("w_Member_UpLoadPersonPic")}
                * @uiColumnGroup - row13
                * @uiType - iv-form-file
                */
                personPhoto?: string;

               /**
                * @uiColumnGroup - row13
                */
                imageSrc?:any;


                info?: any;


                /**
                * @uiLabel - ${this._("w_Member_StartDate")}
                * @uiPlaceHolder - ${this._("w_Member_StartDate")}
                * @uiColumnGroup - row5
                * @uiType - iv-form-date
                */
                startDate: any;


                /**
                * @uiLabel - ${this._("w_Member_EndDate")}
                * @uiPlaceHolder - ${this._("w_Member_EndDate")}
                * @uiColumnGroup - row5
                * @uiType - iv-form-date
                */
                endDate: any;


                /**
                 * @uiLabel - ${this._("w_Member_LastEditPerson")}
                 * @uiPlaceHolder - ${this._("w_Member_LastEditPerson")}
                 * @uiColumnGroup - row5
                 * @uiType - iv-form-label
                 */
                lastEditPerson: string;


                /**
                 * @uiLabel - ${this._("w_Member_LastEditTime")}
                 * @uiPlaceHolder - ${this._("w_Member_LastEditTime")}
                 * @uiColumnGroup - row6
                 * @uiType - iv-form-label
                 */
                lastEditTime: string;

                /**
                 * @uiColumnGroup - row6
                 * @uiHidden - true
                 */
                row62: string;


                /**
                 * @uiColumnGroup - row6
                 * @uiHidden - true
                 */
                row63: string;

                permissionTable?: any;

                premissionList?: any;

                tabItem?: any;

            }
        `;
    }

    // Morris //
    ITabForm1() {
        return `
            interface {

                personInfo?: any;


                /**
                 * @uiLabel - ${this._("w_Member_ExtensionNumber")}
                 * @uiAttrs - { min: 0}
                 * @uiColumnGroup - row1
                 */
                extensionNumber?: number;


                /**
                 * @uiLabel - ${this._("w_Member_MVPN")}
                 * @uiColumnGroup - row1
                 */
                MVPN?: string;


                /**
                 * @uiLabel - ${this._("w_Member_Phone")}
                 * @uiColumnGroup - row1
                 */
                phone?: string;


                /**
                 * @uiLabel - ${this._("w_Member_Email")}
                 * @uiColumnGroup - row2
                 */
                email?: string;

                /**
                 * @uiLabel - ${this._("w_Member_Gender")}
                 * @uiColumnGroup - row2
                 */
                gender?: string;


                /**
                 * @uiLabel - ${this._("w_Member_Birthday")}
                 * @uiColumnGroup - row2
                 * @uiType - iv-form-date
                 */
                birthday?: string;

                companyInfo?: any;


                /**
                 * @uiLabel - ${this._("w_Member_Department")}
                 * @uiColumnGroup - row4
                 */
                department?: string;


                /**
                 * @uiLabel - ${this._("w_Member_CostCenter")}
                 * @uiColumnGroup - row4
                 */
                costCenter?: string;


                /**
                 * @uiLabel - ${this._("w_Member_Area")}
                 * @uiColumnGroup - row4
                 */
                area?: string;


                /**
                 * @uiLabel - ${this._("w_Member_WorkArea")}
                 * @uiColumnGroup - row5
                 */
                workArea?: string;


                /**
                 * @uiLabel - ${this._("w_Member_RegistrationDate")}
                 * @uiColumnGroup - row5
                 * @uiType - iv-form-date
                 */
                registrationDate?: string;

                                /**
                 * @uiLabel - ${this._("w_Member_ResignationDate")}
                 * @uiColumnGroup - row5
                 * @uiType - iv-form-date
                 */
                resignationDate?: string;
            }
        `;
    }

    ITabForm2() {
        return `
            interface {
                carLicenseData?: any;


                /**
                 * @uiLabel - ${this._("w_Member_CarLicenseCategory")}
                 * @uiColumnGroup - row1
                 */
                carLicenseCategory?: string;


                /**
                 * @uiLabel - ${this._("w_Member_CardLicense")}
                 * @uiColumnGroup - row1
                 */
                cardLicense?: string;


                /**
                 * @uiLabel - ${this._("w_Member_CarLicense")}
                 * @uiColumnGroup - row1
                 */
                carLicense?: string;


                /**
                 * @uiLabel - ${this._("w_Member_CarLicense1")}
                 * @uiColumnGroup - row2
                 */
                carLicense1?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CarLicense2")}
                 * @uiColumnGroup - row2
                 */
                carLicense2?: string;


                /**
                 * @uiLabel - ${this._("w_Member_CarLicense3")}
                 * @uiColumnGroup - row2
                 */
                carLicense3?: string;

                accountInfo?: any;


                /**
                 * @uiLabel - ${this._("w_Member_Account")}
                 * @uiColumnGroup - row2
                 */
                account?: string;


                /**
                 * @uiLabel - ${this._("w_Member_Password")}
                 * @uiColumnGroup - row2
                 * @uiType - iv-form-password
                 */
                password?: string;


                /**
                 * @uiColumnGroup - row2
                 * @uiHidden - true
                 */
                row23: string;
            }
        `;
    }

    ITabForm3() {
        return `
            interface {

                cardRecord?: any;

                /**
                 * @uiLabel - ${this._("w_Member_ResignationNote")}
                 * @uiColumnGroup - row1
                 */
                resignationNote?: string;


                /**
                 * @uiLabel - ${this._("w_Member_ResignationRecordCardRecord")}
                 * @uiColumnGroup - row1
                 */
                resignationRecordCardRecord?: string;


                /**
                 * @uiColumnGroup - row1
                 * @uiHidden - true
                 */
                row13: string;


                /**
                 * @uiLabel - ${this._("ReasonForCard1")}
                 * @uiColumnGroup - row2
                 */
                reasonForCard1?: string;


                /**
                 * @uiLabel - ${this._("w_Member_HistoryForCard1")}
                 * @uiColumnGroup - row2
                 */
                historyForCard1?: string;

                /**
                 * @uiLabel - ${this._("w_Member_DateForCard1")}
                 * @uiColumnGroup - row2
                 * @uiType - iv-form-date
                 */
                dateForCard1?: string;

                /**
                 * @uiLabel - ${this._("ReasonForCard2")}
                 * @uiColumnGroup - row3
                 */
                reasonForCard2?: string;


                /**
                 * @uiLabel - ${this._("w_Member_HistoryForCard2")}
                 * @uiColumnGroup - row3
                 */
                historyForCard2?: string;

                /**
                 * @uiLabel - ${this._("w_Member_DateForCard2")}
                 * @uiColumnGroup - row3
                 * @uiType - iv-form-date
                 */
                dateForCard2?: string;

                /**
                 * @uiLabel - ${this._("ReasonForCard3")}
                 * @uiColumnGroup - row4
                 */
                reasonForCard3?: string;

                /**
                 * @uiLabel - ${this._("w_Member_HistoryForCard3")}
                 * @uiColumnGroup - row4
                 */
                historyForCard3?: string;

                /**
                 * @uiLabel - ${this._("w_Member_DateForCard3")}
                 * @uiColumnGroup - row4
                 * @uiType - iv-form-date
                 */
                dateForCard3?: string;


                carLicenseRecord?: any;

                /**
                 * @uiLabel - ${this._("w_Member_ReasonForApplication1")}
                 * @uiColumnGroup - row5
                 */
                reasonForApplication1?: string;


                /**
                 * @uiLabel - ${this._("w_Member_DateForApplication1")}
                 * @uiColumnGroup - row5
                 * @uiType - iv-form-date
                 */
                dateForApplication1?: string;


                /**
                 * @uiColumnGroup - row5
                 * @uiHidden - true
                 */
                row53: string;


                /**
                 * @uiLabel - ${this._("w_Member_ReasonForApplication2")}
                 * @uiColumnGroup - row6
                 */
                reasonForApplication2?: string;


                /**
                 * @uiLabel - ${this._("w_Member_DateForApplication2")}
                 * @uiColumnGroup - row6
                 * @uiType - iv-form-date
                 */
                dateForApplication2?: string;


                /**
                 * @uiColumnGroup - row6
                 * @uiHidden - true
                 */
                row63: string;


                /**
                 * @uiLabel - ${this._("w_Member_ReasonForApplication3")}
                 * @uiColumnGroup - row7
                 */
                reasonForApplication3?: string;


                /**
                 * @uiLabel - ${this._("w_Member_DateForApplication3")}
                 * @uiColumnGroup - row7
                 * @uiType - iv-form-date
                 */
                dateForApplication3?: string;


                /**
                 * @uiColumnGroup - row7
                 * @uiHidden - true
                 */
                row73: string;


                /**
                 * @uiLabel - ${this._("w_Member_ResignationRecordCarLicense")}
                 * @uiColumnGroup - row8
                 */
                resignationRecordCarLicense?: string;

                /**
                 * @uiColumnGroup - row8
                 * @uiHidden - true
                 */
                row82: string;

                 /**
                 * @uiColumnGroup - row8
                 * @uiHidden - true
                 */
                row83: string;
            }
        `;
    }

    ITabForm4() {
        return `
            interface {


                /**
                 * @uiLabel - ${this._("w_Member_CardTemplate")}
                 * @uiColumnGroup - row13
                 */
                cardTemplate?: ${toEnumInterface(
                    this.cardTemplateSelectItem as any,
                    false
                )};

               /**
                * @uiColumnGroup - row13
                */
                imageSrc?:any;
            }
        `;
    }

    ITabForm5() {
        return `
            interface {
               censusRecord?: any;

                /**
                 * @uiLabel - ${this._("w_Member_CensusRecord1")}
                 * @uiColumnGroup - row5
                 */
                censusRecord1?: string;


                /**
                 * @uiLabel - ${this._("w_Member_CensusDate1")}
                 * @uiColumnGroup - row5
                 * @uiType - iv-form-date
                 */
                censusDate1?: string;


                /**
                 * @uiColumnGroup - row5
                 * @uiHidden - true
                 */
                row53: string;


                /**
                 * @uiLabel - ${this._("w_Member_CensusRecord2")}
                 * @uiColumnGroup - row6
                 */
                censusRecord2?: string;


                /**
                 * @uiLabel - ${this._("w_Member_CensusDate2")}
                 * @uiColumnGroup - row6
                 * @uiType - iv-form-date
                 */
                censusDate2?: string;


                /**
                 * @uiColumnGroup - row6
                 * @uiHidden - true
                 */
                row63: string;


                /**
                 * @uiLabel - ${this._("w_Member_CensusRecord3")}
                 * @uiColumnGroup - row7
                 */
                censusRecord3?: string;


                /**
                 * @uiLabel - ${this._("w_Member_CensusDate3")}
                 * @uiColumnGroup - row7
                 * @uiType - iv-form-date
                 */
                censusDate3?: string;


                /**
                 * @uiColumnGroup - row7
                 * @uiHidden - true
                 */
                row73: string;


               parkingViolation?: any;

                /**
                 * @uiLabel - ${this._("w_Member_InfoOfViolation1")}
                 * @uiColumnGroup - row15
                 */
                infoOfViolation1?: string;


                /**
                 * @uiLabel - ${this._("w_Member_DateOfViolation1")}
                 * @uiColumnGroup - row15
                 * @uiType - iv-form-date
                 */
                dateOfViolation1?: string;


                /**
                 * @uiColumnGroup - row15
                 * @uiHidden - true
                 */
                row153: string;


                /**
                 * @uiLabel - ${this._("w_Member_InfoOfViolation2")}
                 * @uiColumnGroup - row16
                 */
                infoOfViolation2?: string;


                /**
                 * @uiLabel - ${this._("w_Member_DateOfViolation2")}
                 * @uiColumnGroup - row16
                 * @uiType - iv-form-date
                 */
                dateOfViolation2?: string;


                /**
                 * @uiColumnGroup - row16
                 * @uiHidden - true
                 */
                row163: string;


                /**
                 * @uiLabel - ${this._("w_Member_InfoOfViolation3")}
                 * @uiColumnGroup - row17
                 */
                infoOfViolation3?: string;


                /**
                 * @uiLabel - ${this._("w_Member_DateOfViolation3")}
                 * @uiColumnGroup - row17
                 * @uiType - iv-form-date
                 */
                dateOfViolation3?: string;


                /**
                 * @uiColumnGroup - row17
                 * @uiHidden - true
                 */
                row173: string;

             }
        `;
    }
    // Morris //

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Account")}
                 * @uiType - iv-form-label
                 */
                username?: string;


                /**
                 * @uiLabel - ${this._("w_Name")}
                 * @uiType - iv-form-label
                 */
                name?: string;


                /**
                 * @uiLabel - ${this._("w_User_ID")}
                 * @uiType - iv-form-label
                 */
                employeeId?: string;


                /**
                 * @uiLabel - ${this._("w_Email")}
                 * @uiType - iv-form-label
                 */
                email?: string;


                /**
                 * @uiLabel - ${this._("w_Phone")}
                 * @uiType - iv-form-label
                 */
                phone?: string;


                /**
                 * @uiLabel - ${this._("w_User_Role")}
                 * @uiType - iv-form-label
                 */
                role?: string;


                /**
                 * @uiLabel - ${this._("w_User_UserGroup")}
                 * @uiType - iv-form-label
                 */
                groupIdsText?: string;


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
.imgSide {
    max-width: 200px;
    min-width: 200px;
    max-height: none;
    min-height: auto;
    height: 100%;
    margin-bottom: 10px;
}
.imgCard {
    max-width: 300px;
    min-width: 200px;
    max-height: none;
    min-height: auto;
    height: 100%;
    margin-bottom: 10px;
}
</style>
