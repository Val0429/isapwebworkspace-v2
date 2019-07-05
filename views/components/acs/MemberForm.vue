<template>
  <div class="animated fadeIn">
    <iv-card v-show="pageStep === ePageStep.list" :label="_('w_Filter')">
      <iv-form
        ref="filterForm"
        class="col-md-9"
        @mounted="doMounted"
        :interface="filterInterface()"
        :value="getParams"
        @submit="onFilter($event)"
      ></iv-form>
      <template v-if="isMounted">
        <div class="float-right">
          <b-button
            class="btn-filter"
            size="lg"
            v-bind="$refs.filterForm.submitBindings.$attrs"
            v-on="$refs.filterForm.submitBindings.$listeners"
          >{{ _("wb_Submit") }}</b-button>
          <b-button
            class="btn-filter"
            size="lg"
            v-bind="$refs.filterForm.resetBindings.$attrs"
            v-on="$refs.filterForm.resetBindings.$listeners"
            @click="getParams={}"
          >{{ _("wb_Reset") }}</b-button>
        </div>
      </template>
    </iv-card>
    <iv-card v-show="pageStep === ePageStep.list" :label="_('w_Member_List')">
      <template #toolbox>
        <iv-toolbox-view :disabled="isSelected.length !== 1" @click="pageToView" />
        <iv-toolbox-edit
          v-show="canEdit"
          :disabled="isSelected.length !== 1"
          @click="pageToEdit()"
        />

        <iv-toolbox-delete
          v-show="canDelete"
          :disabled="isSelected.length === 0"
          @click="doDelete"
        />
        <iv-toolbox-divider />
        <iv-toolbox-add v-show="canAdd" @click="pageToAdd(ePageStep.add)" />
      </template>

      <iv-table
        ref="listTable"
        :interface="ITableList()"
        :multiple="tableMultiple"
        :params="getParams"
        :server="{ path: '/acs/member' }"
        @selected="selectedItem($event)"
      >
        <template #CardNumber="{$attrs}">{{ anysisTableColumn($attrs.row, "CardNumber") }}</template>

        <template
          #StartDate="{$attrs}"
        >{{ $attrs.value === '' ? '' : dateToYYYY_MM_DD($attrs.value) }}</template>

        <template
          #EndDate="{$attrs}"
        >{{ $attrs.value === '' ? '' : dateToYYYY_MM_DD($attrs.value) }}</template>

        <template #Department="{$attrs}">{{ anysisTableColumn($attrs.row, "Department") }}</template>

        <template #CostCenter="{$attrs}">{{ anysisTableColumn($attrs.row, "CostCenter") }}</template>

        <template #Actions="{$attrs, $listeners}">
          <iv-toolbox-more size="sm" :disabled="isSelected.length !== 1">
            <iv-toolbox-view @click="pageToView" />
            <iv-toolbox-edit v-show="canEdit" @click="pageToEdit()" />
            <iv-toolbox-delete v-show="canDelete" @click="doDelete" />
          </iv-toolbox-more>
        </template>
      </iv-table>
    </iv-card>

    <!-- add -->
    <iv-auto-card
      v-show="pageStep === ePageStep.add || pageStep === ePageStep.edit || pageStep === ePageStep.view"
      :visible="true"
      :label="pageStep === ePageStep.add ? _('w_Member_Add') : pageStep === ePageStep.edit ? _('w_Member_Edit') :  _('w_Member_View')"
    >
      <template #toolbox>
        <iv-toolbox-back @click="pageToList()" />
      </template>

      <iv-form
        :interface="IAddAndEditForm()"
        :value="inputFormData"
        @update:*="tempSaveInputData($event)"
        @update:personPhoto="updateShowPhoto($event)"
        @submit="saveAddOrEdit($event)"
      >
        <template #infoCard="{ $attr }">
          <h4 class="ml-3 mt-4 font-weight-bold">{{ _('w_Member_Info') }}</h4>
        </template>

        <template #info="{ $attr }">
          <h4 class="ml-3 mt-4 font-weight-bold">{{ _('w_Member_Info') }}</h4>
        </template>

        <template #imageSrc="{ $attrs, $listeners}" v-if="newImgSrc">
          <label class="col-md-12">{{_("w_Member_PersonPic")}}</label>
          <img class="imgSide" v-bind="$attrs" v-on="$listeners" :src="newImgSrc" />
        </template>

        <template #permissionTable="{ $attr }">
          <h4 class="ml-3 mt-4 font-weight-bold">{{ _('w_Member_PermissionTable') }}</h4>
        </template>

        <template #premissionList>
          <iv-sort-select
            v-if="premissionOptions.length > 0"
            v-model="inputFormData.premissionSelected"
            class="col-md-12"
            :options="premissionOptions"
          ></iv-sort-select>
        </template>

        <template #tabItem>
          <iv-tab class="col-md-12 mt-5" ref="tab" :active="1" @mounted="doTabMount">
            <template #1-title>{{ _('w_Member_PersonInfo') }}</template>
            <template #1>
              <iv-form
                :interface="ITabForm1()"
                :value="inputFormData"
                @update:*="tempSaveInputData($event)"
              >
                <template #personInfo="{ $attr }">
                  <h4 class="ml-3 font-weight-bold">{{ _('w_Member_PersonInfo') }}</h4>
                </template>

                <template #companyInfo="{ $attr }">
                  <h4 class="ml-3 mt-4 font-weight-bold">{{ _('w_Member_CompanyInfo') }}</h4>
                </template>
              </iv-form>
            </template>

            <template #2-title>{{ _('w_Member_General') }}</template>
            <template #2>
              <iv-form
                :interface="ITabForm2()"
                :value="inputFormData"
                @update:*="tempSaveInputData($event)"
              >
                <template #carLicenseData="{ $attr }">
                  <h4 class="ml-3 font-weight-bold">{{ _('w_Member_CarLicenseData') }}</h4>
                </template>

                <template #accountInfo="{ $attr }">
                  <h4 class="ml-3 mt-4 font-weight-bold">{{ _('w_Member_AccountInfo') }}</h4>
                </template>
              </iv-form>
            </template>

            <template #3-title>{{ _('w_Member_CardRecord') }}</template>
            <template #3>
              <iv-form
                :interface="ITabForm3()"
                :value="inputFormData"
                @update:*="tempSaveInputData($event)"
              >
                <template #cardRecord="{ $attr }">
                  <h4 class="ml-3 font-weight-bold">{{ _('w_Member_CardRecord') }}</h4>
                </template>

                <template #carLicenseRecord="{ $attr }">
                  <h4 class="ml-3 mt-4 font-weight-bold">{{ _('w_Member_CarLicenseRecord') }}</h4>
                </template>
              </iv-form>
            </template>

            <template #4-title>{{ _('w_Member_SelectTemplate') }}</template>
            <template #4>
              <iv-form
                :interface="ITabForm4()"
                :value="inputFormData"
                @update:*="tempSaveInputData($event)"
              >
                <template #cardTemplate="{ $attrs, $listeners }">
                  <iv-form-selection
                    class="col-md-6"
                    v-bind="$attrs"
                    v-on="$listeners"
                    v-model="inputFormData.cardTemplate"
                  ></iv-form-selection>
                </template>

                <template #imageSrcCard="{ $attrs, $listeners}" v-if="imageSrcCard">
                  <img
                    class="col-md-6 imgCard"
                    v-bind="$attrs"
                    v-on="$listeners"
                    :src="imageSrcCard"
                  />
                </template>
              </iv-form>
            </template>

            <template #5-title>{{ _('w_Member_Other') }}</template>
            <template #5>
              <iv-form
                :interface="ITabForm5()"
                :value="inputFormData"
                @update:*="tempSaveInputData($event)"
              >
                <template #censusRecord="{ $attr }">
                  <h4 class="ml-3 font-weight-bold">{{ _('w_Member_CensusRecord') }}</h4>
                </template>

                <template #parkingViolation="{ $attr }">
                  <h4 class="ml-3 mt-4 font-weight-bold">{{ _('w_Member_ParkingViolation') }}</h4>
                </template>
              </iv-form>
            </template>
          </iv-tab>
        </template>

        <template #test="{ $attrs, $listeners }">
          <div class="mt-2 ml-3 mb-3">
            <b-button @click="pageToEmailTest($event)">{{ _('w_User_TestEmail') }}</b-button>
          </div>
        </template>
      </iv-form>

      <template #footer-before>
        <b-button variant="dark" size="lg" @click="pageToList()">{{ _('w_Back') }}</b-button>
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
import CardTemplateBase64 from "@/components/FET_Card/models/cardTemplateBase64";
import { PermissionName } from "@/../src/constants/permissions";
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

enum ITemplateCard {
  permanent = "職員識別證",
  contract = "約聘職員識別證"
}

@Component({
  components: {
    ToolboxBack,
    SortSelect
  }
})
export default class MemberForm extends Vue {
  beforeMount() {
    if (!this.$user || !this.$user.permissions) return;
    this.permissionName = PermissionName.member;
    this.canAdd =
      this.$user.permissions.find(
        x => x.access.C === true && x.of.identifier == this.permissionName
      ) != undefined;
    this.canEdit =
      this.$user.permissions.find(
        x => x.access.U === true && x.of.identifier == this.permissionName
      ) != undefined;
    this.canDelete =
      this.$user.permissions.find(
        x => x.access.D === true && x.of.identifier == this.permissionName
      ) != undefined;
  }
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  permissionName: string;

  // // Master
  // objectId                     objectId
  // premissionSelected           AccessRules (premissionTableAPI: tableid => ObjectToken, show: ObjectName)
  // personType                   PrimaryWorkgroupName
  // cardType                     * CustomFields -> CustomDropdownControl1__CF
  // employeeNumber               EmployeeNumber
  // chineseName                  LastName
  // englishName                  FirstName
  // cardNumber                   Credentials[0]CardNumber
  // cardAllNumber                Credentials[0]CardNumber
  // cardCertificate              * Credentials[0]ProfileId
  // startDate                    StartDate
  // endDate                      EndDate
  // companyName                  CustomFields -> CustomTextBoxControl6__CF
  // cardCustodian                CustomFields -> CustomTextBoxControl2__CF
  // lastEditPerson               CustomFields -> CustomTextBoxControl3__CF
  // lastEditTime                 CustomFields -> CustomDateControl2__CF
  // deviceNumber                 * Credentials[0]FacilityCode
  // Pin                          * pin

  // // tab1
  // extensionNumber              PhoneNumber
  // phone                        MobileNumber
  // email                        Email
  // birthday                     DateOfBirth
  // MVPN                         CustomFields -> CustomTextBoxControl5__CF_CF
  // gender                       CustomFields -> CustomDropdownControl2__CF_CF
  // department                   CustomFields -> CustomTextBoxControl5__CF_CF_CF
  // costCenter                   CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF
  // area                         CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF_CF
  // workArea                     CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF_CF_CF
  // registrationDate             CustomFields -> CustomDateControl1__CF_CF_CF
  // resignationDate              CustomFields -> CustomDateControl1__CF

  // // tab2
  // carLicenseCategory           CustomFields -> CustomDropdownControl2__CF
  // cardLicense                  CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF
  // carLicense                   CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF
  // carLicense1                  CustomFields -> CustomTextBoxControl5__CF
  // carLicense2                  CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF
  // carLicense3                  CustomFields -> CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF
  // account                      PersonalDetails.UserDetails.UserName
  // password                     PersonalDetails.UserDetails.Password

  // // tab3
  // resignationNote              CustomFields -> CustomTextBoxControl7__CF_CF
  // resignationRecordCardRecord  CustomFields -> CustomTextBoxControl7__CF_CF_CF
  // reasonForCard1               CustomFields -> CustomDropdownControl3__CF_CF
  // historyForCard1              CustomFields -> CustomTextBoxControl7__CF_CF_CF_CF
  // dateForCard1                 CustomFields -> CustomDateControl3__CF_CF_CF_CF_CF
  // reasonForCard2               CustomFields -> CustomDropdownControl3__CF_CF_CF
  // historyForCard2              CustomFields -> CustomTextBoxControl7__CF_CF_CF_CF_CF
  // dateForCard2                 CustomFields -> CustomDateControl3__CF_CF_CF_CF_CF_CF
  // reasonForCard3               CustomFields -> CustomDropdownControl3__CF_CF_CF_CF
  // historyForCard3              CustomFields -> CustomTextBoxControl7__CF_CF_CF_CF_CF_CF
  // dateForCard3                 CustomFields -> CustomDateControl3__CF_CF_CF_CF_CF_CF_CF
  // reasonForApplication1        CustomFields -> CustomDropdownControl3__CF_CF_CF_CF_CF
  // dateForApplication1          CustomFields -> CustomDateControl3__CF_CF_CF_CF_CF
  // reasonForApplication2        CustomFields -> CustomDropdownControl3__CF_CF_CF_CF_CF_CF
  // dateForApplication2          CustomFields -> CustomDateControl3__CF_CF_CF
  // reasonForApplication3        CustomFields -> CustomDropdownControl3__CF
  // dateForApplication3          CustomFields -> CustomDateControl3__CF_CF_CF_CF
  // resignationRecordCarLicense  CustomFields -> CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF

  // // tab4
  // cardTemplate
  // imageSrc

  // // tab 5
  // censusRecord1                CustomFields -> CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF
  // censusDate1                  CustomFields -> CustomDateControl3__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF
  // censusRecord2                CustomFields -> CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF
  // censusDate2                  CustomFields -> CustomDateControl3__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF
  // censusRecord3                CustomFields -> CustomTextBoxControl7__CF
  // censusDate3                  CustomFields -> CustomDateControl3__CF
  // infoOfViolation1             CustomFields -> CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF
  // dateOfViolation1             CustomFields -> CustomDateControl3__CF_CF_CF_CF_CF_CF_CF_CF
  // infoOfViolation2             CustomFields -> CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF_CF
  // dateOfViolation2             CustomFields -> CustomDateControl3__CF_CF_CF_CF_CF_CF_CF_CF_CF
  // infoOfViolation3             CustomFields -> CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF
  // dateOfViolation3             CustomFields -> CustomDateControl3__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF

  ////////////////////////////////////////////////////////////////

  ePageStep = EPageStep;
  pageStep: EPageStep = EPageStep.list;

  isSelected: any = [];
  tableMultiple: boolean = true;

  selectedDetail: any = [];

  workGroupSelectItem: any = {};
  cardTemplateSelectItem: any = {
    permanent: ITemplateCard.permanent,
    contract: ITemplateCard.contract
  };
  workGroupIdSelectItem: any = {};
  cardCertificateItem: any = {};
  cardTypeItem: any = {};

  inputTestEmail: string = "";
  newImg = new Image();
  newImgSrc = "";
  imageSrcCard = "";
  premissionOptions: ISortSelectOption[] = [];
  tabMounted: boolean = false;
  doTabMount() {
    this.tabMounted = true;
  }

  inputFormData: any = {
    // Master
    objectId: "",
    premissionSelected: [],
    personType: "",
    cardType: "",
    employeeNumber: "",
    chineseName: "",
    englishName: "",
    cardNumber: "",
    cardAllNumber: "",
    startDate: null,
    endDate: null,
    personPhoto: "",
    imageSrc: "",
    companyName: "",
    cardCustodian: "",
    lastEditPerson: "",
    lastEditTime: "",
    cardCertificate: "",
    deviceNumber: 0,
    pin: "",

    // tab1
    extensionNumber: "",
    phone: "",
    email: "",
    birthday: null,
    MVPN: "",
    gender: "",
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
    resignationRecordCarLicense: "",

    // tab4
    cardTemplate: "",
    imageSrcCard: "",

    // tab 5
    censusRecord1: "",
    censusDate1: null,
    censusRecord2: "",
    censusDate2: null,
    censusRecord3: "",
    censusDate3: null,
    infoOfViolation1: "",
    dateOfViolation1: null,
    infoOfViolation2: "",
    dateOfViolation2: null,
    infoOfViolation3: "",
    dateOfViolation3: null
  };

  clearInputData() {
    this.premissionOptions = [];
    this.inputFormData = {
      // Master
      objectId: "",
      premissionSelected: [],
      personType: "",
      cardType: "",
      employeeNumber: "",
      chineseName: "",
      englishName: "",
      cardNumber: "",
      cardAllNumber: "",
      startDate: null,
      endDate: null,
      personPhoto: "",
      imageSrc: "",
      companyName: "",
      cardCustodian: "",
      lastEditPerson: "",
      lastEditTime: "",
      cardCertificate: "",
      deviceNumber: 0,
      pin: "",

      // tab1
      extensionNumber: "",
      phone: "",
      email: "",
      birthday: null,
      MVPN: "",
      gender: "",
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
      resignationRecordCarLicense: "",

      // tab4
      cardTemplate: "",
      imageSrcCard: "",

      // tab 5
      censusRecord1: "",
      censusDate1: null,
      censusRecord2: "",
      censusDate2: null,
      censusRecord3: "",
      censusDate3: null,
      infoOfViolation1: "",
      dateOfViolation1: null,
      infoOfViolation2: "",
      dateOfViolation2: null,
      infoOfViolation3: "",
      dateOfViolation3: null
    };
  }

  created() {}

  mounted() {
    this.initSelectItemWorkGroup();
    this.initSelectItemCardCertificate();
    this.initSelectItemCardType();
  }

  async initSelectItemWorkGroup() {
    this.workGroupSelectItem = {};
    await this.$server
      .R("/acs/workgroup")
      .then((response: any) => {
        if (response != undefined) {
          for (const returnValue of response.results) {
            // 自定義 sitesSelectItem 的 key 的方式
            this.workGroupSelectItem[returnValue.groupname] =
              returnValue.groupname;

            // this.workGroupIdSelectItem[returnValue.groupid] =
            //     returnValue.groupname;
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

  async initSelectItemCardCertificate() {
    this.cardCertificateItem = {};
    await this.$server
      .R("/acs/dropdownlist", { type: "ProfileId" })
      .then((response: any) => {
        if (response != undefined) {
          for (const returnValue of response.results) {
            // 自定義 sitesSelectItem 的 key 的方式
            this.cardCertificateItem[returnValue.profileid] = returnValue.name;
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

  async initSelectItemCardType() {
    this.cardTypeItem = {};
    await this.$server
      .R("/acs/dropdownlist", { type: "Certification" })
      .then((response: any) => {
        if (response != undefined) {
          for (const returnValue of response.results) {
            // 自定義 sitesSelectItem 的 key 的方式
            this.cardTypeItem[returnValue.name] = returnValue.name;
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

      // Master form
      if (detailData.objectId != undefined) {
        this.inputFormData.objectId = detailData.objectId.toString();
      }

      if (detailData.AccessRules != undefined) {
        for (let rule of detailData.AccessRules) {
          if (typeof rule == "object") {
            if (rule.ObjectToken != undefined && rule.ObjectName != undefined) {
              this.inputFormData.premissionSelected.push(
                rule.ObjectToken.toString()
              );
            }
          } else if (typeof rule == "string") {
            this.inputFormData.premissionSelected.push(rule);
          }
        }
      }

      if (detailData.PrimaryWorkgroupName != undefined) {
        this.inputFormData.personType = detailData.PrimaryWorkgroupName;
      }

      // if (detailData.PrimaryWorkgroupName != undefined) {
      //     for (const detail in this.workGroupIdSelectItem) {
      //         if (detailData.PrimaryWorkgroupName.toString() == detail) {
      //             this.inputFormData.personType = this.workGroupIdSelectItem[
      //                 detail
      //                 ];
      //             this.inputFormData.cardType = this.workGroupIdSelectItem[
      //                 detail
      //                 ];
      //         }
      //         for (const detail in this.workGroupSelectItem) {
      //             if (this.inputFormData.cardType == detail) {
      //                 this.inputFormData.cardType = this.workGroupSelectItem[
      //                     detail
      //                     ];
      //             }
      //         }
      //     }
      // }

      if (detailData.EmployeeNumber != undefined) {
        this.inputFormData.employeeNumber = detailData.EmployeeNumber.toString();
      }

      if (detailData.LastName != undefined) {
        this.inputFormData.chineseName = detailData.LastName.toString();
      }

      if (detailData.FirstName != undefined) {
        this.inputFormData.englishName = detailData.FirstName.toString();
      }

      if (
        detailData.Credentials != undefined &&
        detailData.Credentials[0] != undefined &&
        detailData.Credentials[0].CardNumber != undefined
      ) {
        this.inputFormData.cardNumber = detailData.Credentials[0].CardNumber.toString();
        this.inputFormData.cardAllNumber = detailData.Credentials[0].CardNumber.toString();
      }

      if (
        detailData.Credentials != undefined &&
        detailData.Credentials[0] != undefined &&
        detailData.Credentials[0].ProfileId != undefined
      ) {
        this.inputFormData.cardCertificate = detailData.Credentials[0].ProfileId.toString();
        console.log(" - ", this.inputFormData.cardCertificate);
      }

      if (
        detailData.Credentials != undefined &&
        detailData.Credentials[0] != undefined &&
        detailData.Credentials[0].FacilityCode != undefined
      ) {
        this.inputFormData.deviceNumber =
          detailData.Credentials[0].FacilityCode;
      }

      if (
        detailData.Credentials != undefined &&
        detailData.Credentials[0] != undefined &&
        detailData.Credentials[0].Pin != undefined
      ) {
        this.inputFormData.pin = detailData.Credentials[0].Pin;
      }

      if (detailData.StartDate != undefined && detailData.StartDate != "") {
        try {
          this.inputFormData.startDate = new Date(detailData.StartDate);
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
        this.inputFormData.extensionNumber = detailData.PhoneNumber.toString();
      }
      if (detailData.MobileNumber != undefined) {
        this.inputFormData.phone = detailData.MobileNumber.toString();
      }
      if (detailData.Email != undefined) {
        this.inputFormData.email = detailData.Email.toString();
      }
      if (detailData.DateOfBirth != undefined && detailData.DateOfBirth != "") {
        try {
          this.inputFormData.birthday = new Date(detailData.DateOfBirth);
        } catch (e) {
          console.log(e);
        }
      }

      // tab2
      if (
        detailData.PersonalDetails != undefined &&
        detailData.PersonalDetails.UserDetails != undefined &&
        detailData.PersonalDetails.UserDetails.UserName != undefined &&
        detailData.PersonalDetails.UserDetails.UserName != ""
      ) {
        this.inputFormData.account =
          detailData.PersonalDetails.UserDetails.UserName;
      }

      if (
        detailData.PersonalDetails != undefined &&
        detailData.PersonalDetails.UserDetails != undefined &&
        detailData.PersonalDetails.UserDetails.Password != undefined &&
        detailData.PersonalDetails.UserDetails.Password != ""
      ) {
        this.inputFormData.password =
          detailData.PersonalDetails.UserDetails.Password;
      }

      if (detailData.CustomFields != undefined) {
        for (let content of detailData.CustomFields) {
          if (
            content.FiledName != undefined &&
            content.FieldValue != undefined
          ) {
            // Master
            if (content.FiledName == "CustomTextBoxControl6__CF") {
              this.inputFormData.companyName = content.FieldValue.toString();
            }
            if (content.FiledName == "CustomTextBoxControl2__CF") {
              this.inputFormData.cardCustodian = content.FieldValue.toString();
            }
            if (content.FiledName == "CustomTextBoxControl3__CF") {
              this.inputFormData.lastEditPerson = content.FieldValue.toString();
            }
            if (content.FiledName == "CustomDateControl2__CF") {
              this.inputFormData.lastEditTime = content.FieldValue.toString();
            }
            if (content.FiledName == "CustomDropdownControl1__CF") {
              this.inputFormData.cardType = content.FieldValue.toString();
            }

            // tab1
            if (content.FiledName == "CustomTextBoxControl5__CF_CF") {
              this.inputFormData.MVPN = content.FieldValue.toString();
            }

            if (content.FiledName == "CustomDropdownControl2__CF_CF") {
              this.inputFormData.gender = content.FieldValue.toString();
            }

            if (content.FiledName == "CustomTextBoxControl5__CF_CF_CF") {
              this.inputFormData.department = content.FieldValue.toString();
            }

            if (content.FiledName == "CustomTextBoxControl5__CF_CF_CF_CF") {
              this.inputFormData.costCenter = content.FieldValue.toString();
            }

            if (content.FiledName == "CustomTextBoxControl5__CF_CF_CF_CF_CF") {
              this.inputFormData.area = content.FieldValue.toString();
            }

            if (
              content.FiledName == "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF"
            ) {
              this.inputFormData.workArea = content.FieldValue.toString();
            }

            if (content.FiledName == "CustomDateControl1__CF_CF_CF") {
              try {
                this.inputFormData.registrationDate = new Date(
                  content.FieldValue
                );
              } catch (e) {
                console.log(e);
              }
            }

            if (content.FiledName == "CustomDateControl1__CF") {
              try {
                this.inputFormData.resignationDate = new Date(
                  content.FieldValue
                );
              } catch (e) {
                console.log(e);
              }
            }

            // tab2
            if (content.FiledName == "CustomDropdownControl2__CF") {
              this.inputFormData.carLicenseCategory = content.FieldValue.toString();
            }

            if (
              content.FiledName ==
              "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              this.inputFormData.cardLicense = content.FieldValue.toString();
            }

            if (
              content.FiledName ==
              "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              this.inputFormData.carLicense = content.FieldValue.toString();
            }

            if (content.FiledName == "CustomTextBoxControl5__CF") {
              this.inputFormData.carLicense1 = content.FieldValue.toString();
            }

            if (
              content.FiledName ==
              "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              this.inputFormData.carLicense2 = content.FieldValue.toString();
            }

            if (
              content.FiledName ==
              "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              this.inputFormData.carLicense3 = content.FieldValue.toString();
            }

            // tab3
            if (content.FiledName == "CustomTextBoxControl7__CF_CF") {
              this.inputFormData.resignationNote = content.FieldValue.toString();
            }
            if (content.FiledName == "CustomTextBoxControl7__CF_CF_CF") {
              this.inputFormData.resignationRecordCardRecord = content.FieldValue.toString();
            }
            if (content.FiledName == "CustomDropdownControl3__CF_CF") {
              this.inputFormData.reasonForCard1 = content.FieldValue.toString();
            }
            if (content.FiledName == "CustomTextBoxControl7__CF_CF_CF_CF") {
              this.inputFormData.historyForCard1 = content.FieldValue.toString();
            }
            if (content.FiledName == "CustomDateControl3__CF_CF_CF_CF_CF") {
              try {
                this.inputFormData.dateForCard1 = new Date(content.FieldValue);
              } catch (e) {
                console.log(e);
              }
            }

            if (content.FiledName == "CustomDropdownControl3__CF_CF_CF") {
              this.inputFormData.reasonForCard2 = content.FieldValue.toString();
            }
            if (content.FiledName == "CustomTextBoxControl7__CF_CF_CF_CF_CF") {
              this.inputFormData.historyForCard2 = content.FieldValue.toString();
            }
            if (content.FiledName == "CustomDateControl3__CF_CF_CF_CF_CF_CF") {
              try {
                this.inputFormData.dateForCard2 = new Date(
                  content.FieldValue.toString()
                );
              } catch (e) {
                console.log(e);
              }
            }
            if (content.FiledName == "CustomDropdownControl3__CF_CF_CF_CF") {
              this.inputFormData.reasonForCard3 = content.FieldValue.toString();
            }
            if (
              content.FiledName == "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF"
            ) {
              this.inputFormData.historyForCard3 = content.FieldValue.toString();
            }

            if (
              content.FiledName == "CustomDateControl3__CF_CF_CF_CF_CF_CF_CF"
            ) {
              try {
                this.inputFormData.dateForCard3 = new Date(content.FieldValue);
              } catch (e) {
                console.log(e);
              }
            }
            if (content.FiledName == "CustomDropdownControl3__CF_CF_CF_CF_CF") {
              this.inputFormData.reasonForApplication1 = content.FieldValue.toString();
            }
            if (content.FiledName == "CustomDateControl3__CF_CF_CF_CF_CF") {
              try {
                this.inputFormData.dateForApplication1 = new Date(
                  content.FieldValue
                );
              } catch (e) {
                console.log(e);
              }
            }
            if (
              content.FiledName == "CustomDropdownControl3__CF_CF_CF_CF_CF_CF"
            ) {
              this.inputFormData.reasonForApplication2 = content.FieldValue.toString();
            }
            if (content.FiledName == "CustomDateControl3__CF_CF_CF") {
              try {
                this.inputFormData.dateForApplication2 = new Date(
                  content.FieldValue
                );
              } catch (e) {
                console.log(e);
              }
            }

            if (content.FiledName == "CustomDropdownControl3__CF") {
              this.inputFormData.reasonForApplication3 = content.FieldValue.toString();
            }
            if (content.FiledName == "CustomDateControl3__CF_CF_CF_CF") {
              try {
                this.inputFormData.dateForApplication3 = new Date(
                  content.FieldValue
                );
              } catch (e) {
                console.log(e);
              }
            }
            if (
              content.FiledName == "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF"
            ) {
              this.inputFormData.resignationRecordCarLicense = content.FieldValue.toString();
            }

            // tab 5
            if (
              content.FiledName ==
              "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              this.inputFormData.censusRecord1 = content.FieldValue.toString();
            }
            if (
              content.FiledName ==
              "CustomDateControl3__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              try {
                this.inputFormData.censusDate1 = new Date(content.FieldValue);
              } catch (e) {
                console.log(e);
              }
            }
            if (
              content.FiledName ==
              "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              this.inputFormData.censusRecord2 = content.FieldValue.toString();
            }
            if (
              content.FiledName ==
              "CustomDateControl3__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              try {
                this.inputFormData.censusDate2 = new Date(content.FieldValue);
              } catch (e) {
                console.log(e);
              }
            }
            if (content.FiledName == "CustomTextBoxControl7__CF") {
              this.inputFormData.censusRecord3 = content.FieldValue.toString();
            }

            if (content.FiledName == "CustomDateControl3__CF") {
              try {
                this.inputFormData.censusDate3 = new Date(content.FieldValue);
              } catch (e) {
                console.log(e);
              }
            }
            if (
              content.FiledName ==
              "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              this.inputFormData.infoOfViolation1 = content.FieldValue.toString();
            }
            if (
              content.FiledName == "CustomDateControl3__CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              try {
                this.inputFormData.dateOfViolation1 = new Date(
                  content.FieldValue
                );
              } catch (e) {
                console.log(e);
              }
            }
            if (
              content.FiledName ==
              "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              this.inputFormData.infoOfViolation2 = content.FieldValue.toString();
            }
            if (
              content.FiledName ==
              "CustomDateControl3__CF_CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              try {
                this.inputFormData.dateOfViolation2 = new Date(
                  content.FieldValue
                );
              } catch (e) {
                console.log(e);
              }
            }

            if (
              content.FiledName ==
              "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              this.inputFormData.infoOfViolation3 = content.FieldValue.toString();
            }
            if (
              content.FiledName ==
              "CustomDateControl3__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF"
            ) {
              try {
                this.inputFormData.dateOfViolation3 = new Date(
                  content.FieldValue
                );
              } catch (e) {
                console.log(e);
              }
            }
          }
        }
      }

      console.log("let detailData - ", detailData);
    }

    // this.pageToAdd();
  }

  tempSaveInputData(data) {
    switch (data.key) {
      // Master
      case "objectId":
        this.inputFormData.objectId = data.value;
        break;
      case "premissionSelected":
        this.inputFormData.premissionSelected = data.value;
        break;
      case "personType":
        this.inputFormData.personType = data.value;
        break;
      case "employeeNumber":
        this.inputFormData.employeeNumber = data.value;
        break;
      case "chineseName":
        this.inputFormData.chineseName = data.value;
        break;
      case "englishName":
        this.inputFormData.englishName = data.value;
        break;
      case "cardNumber":
        this.inputFormData.cardNumber = data.value;
        this.inputFormData.cardAllNumber = data.value;
        break;
      case "startDate":
        this.inputFormData.startDate = data.value;
        break;
      case "endDate":
        this.inputFormData.endDate = data.value;
        break;
      case "companyName":
        this.inputFormData.companyName = data.value;
        break;
      case "cardCustodian":
        this.inputFormData.cardCustodian = data.value;
        break;
      case "personPhoto":
        this.inputFormData.personPhoto = data.value;
        break;
      case "lastEditPerson":
        this.inputFormData.lastEditPerson = data.value;
        break;
      case "lastEditTime":
        this.inputFormData.lastEditTime = data.value;
        break;
      case "cardCertificate":
        this.inputFormData.cardCertificate = data.value;
        break;
      case "cardType":
        this.inputFormData.cardType = data.value;
        break;
      case "deviceNumber":
        this.inputFormData.deviceNumber = data.value;
        break;
      case "pin":
        this.inputFormData.pin = data.value;
        break;
      // tab1
      case "extensionNumber":
        this.inputFormData.extensionNumber = data.value;
        break;
      case "phone":
        this.inputFormData.phone = data.value;
        break;
      case "email":
        this.inputFormData.email = data.value;
        break;
      case "birthday":
        this.inputFormData.birthday = data.value;
        break;
      case "MVPN":
        this.inputFormData.MVPN = data.value;
        break;
      case "gender":
        this.inputFormData.gender = data.value;
        break;
      case "department":
        this.inputFormData.department = data.value;
        break;
      case "costCenter":
        this.inputFormData.costCenter = data.value;
        break;
      case "area":
        this.inputFormData.area = data.value;
        break;
      case "workArea":
        this.inputFormData.workArea = data.value;
        break;
      case "registrationDate":
        this.inputFormData.registrationDate = data.value;
        break;
      case "resignationDate":
        this.inputFormData.resignationDate = data.value;
        break;

      // tab2
      case "carLicenseCategory":
        this.inputFormData.carLicenseCategory = data.value;
        break;
      case "cardLicense":
        this.inputFormData.cardLicense = data.value;
        break;
      case "carLicense":
        this.inputFormData.carLicense = data.value;
        break;
      case "carLicense1":
        this.inputFormData.carLicense1 = data.value;
        break;
      case "carLicense2":
        this.inputFormData.carLicense2 = data.value;
        break;
      case "carLicense3":
        this.inputFormData.carLicense3 = data.value;
        break;
      case "account":
        this.inputFormData.account = data.value;
        break;
      case "password":
        this.inputFormData.password = data.value;
        break;

      // tab3
      case "resignationNote":
        this.inputFormData.resignationNote = data.value;
        break;
      case "resignationRecordCardRecord":
        this.inputFormData.resignationRecordCardRecord = data.value;
        break;
      case "reasonForCard1":
        this.inputFormData.reasonForCard1 = data.value;
        break;
      case "historyForCard1":
        this.inputFormData.historyForCard1 = data.value;
        break;
      case "dateForCard1":
        this.inputFormData.dateForCard1 = data.value;
        break;
      case "reasonForCard2":
        this.inputFormData.reasonForCard2 = data.value;
        break;
      case "historyForCard2":
        this.inputFormData.historyForCard2 = data.value;
        break;
      case "dateForCard2":
        this.inputFormData.dateForCard2 = data.value;
        break;
      case "reasonForCard3":
        this.inputFormData.reasonForCard3 = data.value;
        break;
      case "historyForCard3":
        this.inputFormData.historyForCard3 = data.value;
        break;
      case "dateForCard3":
        this.inputFormData.dateForCard3 = data.value;
        break;
      case "reasonForApplication1":
        this.inputFormData.reasonForApplication1 = data.value;
        break;
      case "dateForApplication1":
        this.inputFormData.dateForApplication1 = data.value;
        break;
      case "reasonForApplication2":
        this.inputFormData.reasonForApplication2 = data.value;
        break;
      case "dateForApplication2":
        this.inputFormData.dateForApplication2 = data.value;
        break;
      case "reasonForApplication3":
        this.inputFormData.reasonForApplication3 = data.value;
        break;
      case "dateForApplication3":
        this.inputFormData.dateForApplication3 = data.value;
        break;
      case "resignationRecordCarLicense":
        this.inputFormData.resignationRecordCarLicense = data.value;
        break;

      // tab4
      case "cardTemplate":
        switch (data.value) {
          case "permanent":
            this.imageSrcCard = CardTemplateBase64.permanent;
            break;
          case "contract":
            this.imageSrcCard = CardTemplateBase64.contract;
            break;
        }
        break;

      // tab5
      case "censusRecord1":
        this.inputFormData.censusRecord1 = data.value;
        break;
      case "censusDate1":
        this.inputFormData.censusDate1 = data.value;
        break;
      case "censusRecord2":
        this.inputFormData.censusRecord2 = data.value;
        break;
      case "censusDate2":
        this.inputFormData.censusDate2 = data.value;
        break;
      case "censusRecord3":
        this.inputFormData.censusRecord3 = data.value;
        break;
      case "censusDate3":
        this.inputFormData.censusDate3 = data.value;
        break;
      case "infoOfViolation1":
        this.inputFormData.infoOfViolation1 = data.value;
        break;
      case "dateOfViolation1":
        this.inputFormData.dateOfViolation1 = data.value;
        break;
      case "infoOfViolation2":
        this.inputFormData.infoOfViolation2 = data.value;
        break;
      case "dateOfViolation2":
        this.inputFormData.dateOfViolation2 = data.value;
        break;
      case "infoOfViolation3":
        this.inputFormData.infoOfViolation3 = data.value;
        break;
      case "dateOfViolation3":
        this.inputFormData.dateOfViolation3 = data.value;
        break;
    }
  }

  pageToAdd() {
    this.pageStep = EPageStep.add;
    this.clearInputData();
    this.initPremission();
  }

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
              let haveOption = false;
              let tempOption: ISortSelectOption = {
                value: content.tableid.toString(),
                text: content.tablename.toString()
              };
              for (let option of this.premissionOptions) {
                if (option.value == tempOption.value) {
                  haveOption = true;
                }
              }
              if (!haveOption) {
                this.premissionOptions.push(tempOption);
              }
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

  async pageToEdit() {
    this.getInputData();
    this.pageStep = EPageStep.edit;
  }

  pageToView() {
    this.getInputData();
    this.pageStep = EPageStep.view;
  }

  pageToList() {
    this.pageStep = EPageStep.list;
    (this.$refs.listTable as any).reload();
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
            return;
          };
        } else {
          Dialog.error(this._("w_Member_ErrorUploadFile"));
        }
      });
    }
  }

  async saveAddOrEdit() {
    let tempCredentials: any = [];
    let tempPersonalDetails: any = {};
    let tempCustomFieldsList: any = [];

    if (
      this.selectedDetail[0] != undefined &&
      this.selectedDetail[0].Credentials != undefined &&
      this.selectedDetail[0].Credentials[0] != undefined
    ) {
      tempCredentials = JSON.parse(
        JSON.stringify(this.selectedDetail[0].Credentials)
      );
      tempCredentials[0].CardNumber = this.inputFormData.cardNumber;
      tempCredentials[0].Pin = this.inputFormData.pin;
      tempCredentials[0].FacilityCode = parseInt(
        this.inputFormData.deviceNumber
      );

      // console.log('switch 1  - s ', );
      // switch (this.inputFormData.ProfileId) {
      //     case "35 bit":
      //         tempCredentials[0].FacilityCode = 1;
      //         break;
      //     case "26 bit":
      //         tempCredentials[0].FacilityCode = 2;
      //         break;
      //     case "mifare32":
      //         tempCredentials[0].FacilityCode = 3;
      //         break;
      //     case undefined:
      //         tempCredentials[0].FacilityCode = 0;
      //         break;
      // }

      tempCredentials[0].ProfileId = !isNaN(
        parseInt(this.inputFormData.cardCertificate)
      )
        ? parseInt(this.inputFormData.cardCertificate)
        : 0;
    } else {
      // console.log('switch 2  - s ', );
      //
      // switch (this.inputFormData.ProfileId) {
      //     case "35 bit":
      //         tempCredentials = [
      //             {
      //                 CardNumber: this.inputFormData.cardNumber,
      //                 FacilityCode: parseInt(this.inputFormData.deviceNumber),
      //                 ProfileId: 1
      //             }
      //         ];
      //         break;
      //     case "26 bit":
      //         tempCredentials = [
      //             {
      //                 CardNumber: this.inputFormData.cardNumber,
      //                 FacilityCode: parseInt(this.inputFormData.deviceNumber),
      //                 ProfileId: 2
      //             }
      //         ];
      //         break;
      //     case "mifare32":
      //         tempCredentials = [
      //             {
      //                 CardNumber: this.inputFormData.cardNumber,
      //                 FacilityCode: parseInt(this.inputFormData.deviceNumber),
      //                 ProfileId: 3
      //             }
      //         ];
      //         break;
      //     default:
      //
      //     tempCredentials = [
      //             {
      //                 CardNumber: this.inputFormData.cardNumber,
      //                 FacilityCode: parseInt(this.inputFormData.deviceNumber),
      //                 ProfileId: 0
      //             }
      //         ];
      //         break;
      // }
      tempCredentials = [
        {
          CardNumber: this.inputFormData.cardNumber,
          Pin: this.inputFormData.pin,
          FacilityCode: parseInt(this.inputFormData.deviceNumber),
          ProfileId: !isNaN(parseInt(this.inputFormData.cardCertificate))
            ? parseInt(this.inputFormData.cardCertificate)
            : 0
        }
      ];
    }

    if (
      this.selectedDetail[0] != undefined &&
      this.selectedDetail[0].PersonalDetails != undefined
    ) {
      tempPersonalDetails = JSON.parse(
        JSON.stringify(this.selectedDetail[0].PersonalDetails)
      );
      if (tempPersonalDetails.UserDetails != undefined) {
        tempPersonalDetails.UserDetails.account = this.inputFormData.account;
        tempPersonalDetails.UserDetails.password = this.inputFormData.password;
      } else {
        tempPersonalDetails.UserDetails = {
          UserName: this.inputFormData.account,
          Password: this.inputFormData.password
        };
      }
    } else {
      tempPersonalDetails = {
        UserDetails: {
          UserName: this.inputFormData.account,
          Password: this.inputFormData.password
        }
      };
    }

    // master
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl6__CF",
      FieldValue: this.inputFormData.companyName.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl2__CF",
      FieldValue: this.inputFormData.cardCustodian.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl3__CF",
      FieldValue: this.inputFormData.lastEditPerson.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDateControl3__CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.lastEditTime.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDropdownControl1__CF",
      FieldValue: this.inputFormData.cardType.toString()
    });

    // tab1
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl5__CF_CF",
      FieldValue: this.inputFormData.MVPN.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDropdownControl2__CF_CF",
      FieldValue: this.inputFormData.gender.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl5__CF_CF_CF",
      FieldValue: this.inputFormData.department.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl5__CF_CF_CF_CF",
      FieldValue: this.inputFormData.costCenter.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl5__CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.area.toString()
    });

    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.workArea.toString()
    });

    tempCustomFieldsList.push({
      FiledName: "CustomDateControl1__CF_CF_CF",
      FieldValue:
        this.inputFormData.registrationDate != null &&
        !isNaN(this.inputFormData.registrationDate.getTime())
          ? this.inputFormData.registrationDate.toISOString()
          : ""
    });

    tempCustomFieldsList.push({
      FiledName: "CustomDateControl1__CF",
      FieldValue:
        this.inputFormData.resignationDate != null &&
        !isNaN(this.inputFormData.resignationDate.getTime())
          ? this.inputFormData.resignationDate.toISOString()
          : ""
    });

    // tab2
    tempCustomFieldsList.push({
      FiledName: "CustomDropdownControl2__CF",
      FieldValue: this.inputFormData.carLicenseCategory.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.cardLicense.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.carLicense.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl5__CF",
      FieldValue: this.inputFormData.carLicense1.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.carLicense2.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl5__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.carLicense3.toString()
    });

    // tab3
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl7__CF_CF",
      FieldValue: this.inputFormData.resignationNote.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl7__CF_CF_CF",
      FieldValue: this.inputFormData.resignationRecordCardRecord.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDropdownControl3__CF_CF",
      FieldValue: this.inputFormData.reasonForCard1.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl7__CF_CF_CF_CF",
      FieldValue: this.inputFormData.historyForCard1.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDateControl3__CF_CF_CF_CF_CF",
      FieldValue:
        this.inputFormData.dateForCard1 != null &&
        !isNaN(this.inputFormData.dateForCard1.getTime())
          ? this.inputFormData.dateForCard1.toISOString()
          : ""
    });

    tempCustomFieldsList.push({
      FiledName: "CustomDropdownControl3__CF_CF_CF",
      FieldValue: this.inputFormData.reasonForCard2.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl7__CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.historyForCard2.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDateControl3__CF_CF_CF_CF_CF",
      FieldValue:
        this.inputFormData.dateForCard2 != null &&
        !isNaN(this.inputFormData.dateForCard2.getTime())
          ? this.inputFormData.dateForCard2.toISOString()
          : ""
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDropdownControl3__CF_CF_CF_CF",
      FieldValue: this.inputFormData.reasonForCard3.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.historyForCard3.toString()
    });

    tempCustomFieldsList.push({
      FiledName: "CustomDateControl3__CF_CF_CF_CF_CF",
      FieldValue:
        this.inputFormData.dateForCard3 != null &&
        !isNaN(this.inputFormData.dateForCard3.getTime())
          ? this.inputFormData.dateForCard3.toISOString()
          : ""
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDropdownControl3__CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.reasonForApplication1.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDateControl3__CF_CF_CF_CF_CF",
      FieldValue:
        this.inputFormData.dateForApplication1 != null &&
        !isNaN(this.inputFormData.dateForApplication1.getTime())
          ? this.inputFormData.dateForApplication1.toISOString()
          : ""
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDropdownControl3__CF_CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.reasonForApplication2.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDateControl3__CF_CF_CF_CF_CF",
      FieldValue:
        this.inputFormData.dateForApplication2 != null &&
        !isNaN(this.inputFormData.dateForApplication2.getTime())
          ? this.inputFormData.dateForApplication2.toISOString()
          : ""
    });

    tempCustomFieldsList.push({
      FiledName: "CustomDropdownControl3__CF",
      FieldValue: this.inputFormData.reasonForApplication3.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDateControl3__CF_CF_CF_CF_CF",
      FieldValue:
        this.inputFormData.dateForApplication3 != null &&
        !isNaN(this.inputFormData.dateForApplication3.getTime())
          ? this.inputFormData.dateForApplication3.toISOString()
          : ""
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.resignationRecordCarLicense.toString()
    });

    // tab5
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.censusRecord1.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDateControl3__CF_CF_CF_CF_CF",
      FieldValue:
        this.inputFormData.censusDate1 != null &&
        !isNaN(this.inputFormData.censusDate1.getTime())
          ? this.inputFormData.censusDate1.toISOString()
          : ""
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.censusRecord2.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDateControl3__CF_CF_CF_CF_CF",
      FieldValue:
        this.inputFormData.censusDate2 != null &&
        !isNaN(this.inputFormData.censusDate2.getTime())
          ? this.inputFormData.censusDate2.toISOString()
          : ""
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl7__CF",
      FieldValue: this.inputFormData.censusRecord3.toString()
    });

    tempCustomFieldsList.push({
      FiledName: "CustomDateControl3__CF_CF_CF_CF_CF",
      FieldValue:
        this.inputFormData.censusDate3 != null &&
        !isNaN(this.inputFormData.censusDate3.getTime())
          ? this.inputFormData.censusDate3.toISOString()
          : ""
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.infoOfViolation1.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDateControl3__CF_CF_CF_CF_CF",
      FieldValue:
        this.inputFormData.dateOfViolation1 != null &&
        !isNaN(this.inputFormData.dateOfViolation1.getTime())
          ? this.inputFormData.dateOfViolation1.toISOString()
          : ""
    });
    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.infoOfViolation2.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDateControl3__CF_CF_CF_CF_CF",
      FieldValue:
        this.inputFormData.dateOfViolation2 != null &&
        !isNaN(this.inputFormData.dateOfViolation2.getTime())
          ? this.inputFormData.dateOfViolation2.toISOString()
          : ""
    });

    tempCustomFieldsList.push({
      FiledName: "CustomTextBoxControl7__CF_CF_CF_CF_CF_CF_CF_CF_CF_CF",
      FieldValue: this.inputFormData.infoOfViolation3.toString()
    });
    tempCustomFieldsList.push({
      FiledName: "CustomDateControl3__CF_CF_CF_CF_CF",
      FieldValue:
        this.inputFormData.dateOfViolation3 != null &&
        !isNaN(this.inputFormData.dateOfViolation3.getTime())
          ? this.inputFormData.dateOfViolation3.toISOString()
          : ""
    });

    if (
      this.selectedDetail[0] != undefined &&
      this.selectedDetail[0].objectId != undefined &&
      this.selectedDetail[0].objectId != ""
    ) {
      const editParam: any = JSON.parse(JSON.stringify(this.selectedDetail[0]));

      // master
      editParam.objectId = this.inputFormData.objectId;
      editParam.AccessRules = this.inputFormData.premissionSelected;
      editParam.PrimaryWorkgroupName = this.inputFormData.personType;
      // editParam.PrimaryWorkgroupName = !isNaN(
      //     parseInt(this.inputFormData.personType)
      // )
      //     ? parseInt(this.inputFormData.personType)
      //     : 0;
      editParam.EmployeeNumber = this.inputFormData.employeeNumber;
      editParam.LastName = this.inputFormData.chineseName;
      editParam.FirstName = this.inputFormData.englishName;
      editParam.StartDate =
        this.inputFormData.startDate === null
          ? ""
          : this.inputFormData.startDate;
      editParam.EndDate =
        this.inputFormData.endDate === null ? "" : this.inputFormData.endDate;

      // tab1
      editParam.extensionNumber = this.inputFormData.PhoneNumber;
      editParam.phone = this.inputFormData.MobileNumber;
      editParam.Email = this.inputFormData.email;
      editParam.DateOfBirth = this.inputFormData.birthday;

      // special
      editParam.Credentials = tempCredentials;
      editParam.PersonalDetails = tempPersonalDetails;
      editParam.CustomFields = tempCustomFieldsList;

      await this.$server
        .U("/acs/member", editParam)
        .then((response: any) => {
          this.pageToList();
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
    } else {
      const addParam = {
        // master
        objectId: this.inputFormData.objectId,
        AccessRules: this.inputFormData.premissionSelected,
        PrimaryWorkgroupName: this.inputFormData.personType,
        EmployeeNumber: this.inputFormData.employeeNumber,
        LastName: this.inputFormData.chineseName,
        FirstName: this.inputFormData.englishName,
        StartDate:
          this.inputFormData.startDate === null
            ? ""
            : this.inputFormData.startDate,
        EndDate:
          this.inputFormData.endDate === null ? "" : this.inputFormData.endDate,
        // EndDate: this.inputFormData.EndDate,

        // tab1
        extensionNumber: this.inputFormData.PhoneNumber,
        phone: this.inputFormData.MobileNumber,
        Email: this.inputFormData.email,
        DateOfBirth: this.inputFormData.birthday,

        // special
        Credentials: tempCredentials,
        PersonalDetails: tempPersonalDetails,
        CustomFields: tempCustomFieldsList
      };

      await this.$server
        .C("/acs/member", addParam)
        .then((response: any) => {
          this.pageToList();
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
              if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                return ResponseFilter.base(this, e);
              }
              console.log(e);
            });
        }
      }
    );
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
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                */
                companyName?: string;

                /**
                 * @uiLabel - ${this._("w_Member_PersonType")}
                 * @uiColumnGroup - row1
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                personType?: ${toEnumInterface(
                  this.workGroupSelectItem as any,
                  false
                )};

                /**
                 * @uiLabel - ${this._("w_Member_EmployeeNumber")}
                 * @uiColumnGroup - row1
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                employeeNumber?: string;

                /**
                 * @uiLabel - ${this._("w_Member_ChineseName")}
                 * @uiColumnGroup - row2
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                chineseName: string;

                /**
                 * @uiLabel - ${this._("w_Member_EnglishName")}
                 * @uiColumnGroup - row2
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                englishName?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CardType")}
                 * @uiColumnGroup - row2
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                cardType?: ${toEnumInterface(this.cardTypeItem as any, false)};



               /**
                * @uiLabel - ${this._("w_Member_UpLoadPersonPic")}
                * @uiColumnGroup - row3
                * @uiType - iv-form-file
                * @uiHidden - ${
                  this.pageStep === EPageStep.add ||
                  this.pageStep === EPageStep.edit
                    ? "false"
                    : "true"
                }
                */
                personPhoto?: string;


                /**
                 * @uiLabel - ${this._("w_Member_CardCustodian")}
                 * @uiColumnGroup - row3
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                cardCustodian?: string;



                /**
                 * @uiColumnGroup - row3
                 * @uiHidden - true
                 */
                row3?: string;


               /**
                * @uiColumnGroup - row13
                */
                imageSrc?:any;



                ////////////////////////////////////////////////////////////////////////////////////


                infoCard?: any;


                /**
                 * @uiLabel - ${this._("w_Member_CardNumber")}
                 * @uiColumnGroup - row33
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                cardNumber?: string;


                /**
                 * @uiLabel - ${this._("w_Member_CardVoucherType")}
                 * @uiColumnGroup - row33
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                cardCertificate?: ${toEnumInterface(
                  this.cardCertificateItem as any,
                  false
                )};


                /**
                 * @uiLabel - ${this._("w_Member_deviceNumber")}
                 * @uiColumnGroup - row33
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                deviceNumber?: string;



                /**
                 * @uiLabel - ${this._("w_Member_pin")}
                 * @uiColumnGroup - row173
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                pin?: string;



                /**
                 * @uiColumnGroup - row173
                 * @uiHidden - true
                 */
                row173?: string;



                /**
                 * @uiColumnGroup - row173
                 * @uiHidden - true
                 */
                row173?: string;


                ////////////////////////////////////////////////////////////////////////////////////


                info?: any;

                /**
                * @uiLabel - ${this._("w_Member_StartDate")}
                * @uiPlaceHolder - ${this._("w_Member_StartDate")}
                * @uiColumnGroup - row5
                * @uiType - iv-form-date
                * @uiDisabled - ${
                  this.pageStep === EPageStep.add ||
                  this.pageStep === EPageStep.edit
                    ? "false"
                    : "true"
                }
                */
                startDate?: any;

                /**
                * @uiLabel - ${this._("w_Member_EndDate")}
                * @uiPlaceHolder - ${this._("w_Member_EndDate")}
                * @uiColumnGroup - row5
                * @uiType - iv-form-date
                * @uiDisabled - ${
                  this.pageStep === EPageStep.add ||
                  this.pageStep === EPageStep.edit
                    ? "false"
                    : "true"
                }
                */
                endDate?: any;

                /**
                 * @uiLabel - ${this._("w_Member_LastEditPerson")}
                 * @uiPlaceHolder - ${this._("w_Member_LastEditPerson")}
                 * @uiColumnGroup - row5
                 * @uiType - iv-form-label
                 */
                lastEditPerson?: string;

                /**
                 * @uiLabel - ${this._("w_Member_LastEditTime")}
                 * @uiPlaceHolder - ${this._("w_Member_LastEditTime")}
                 * @uiColumnGroup - row6
                 * @uiType - iv-form-label
                 */
                lastEditTime?: string;

                /**
                 * @uiColumnGroup - row6
                 * @uiHidden - true
                 */
                row62?: string;

                /**
                 * @uiColumnGroup - row6
                 * @uiHidden - true
                 */
                row63?: string;

                permissionTable?: any;

                premissionList?: any;

                tabItem?: any;

            }
        `;
  }

  ITabForm1() {
    return `
            interface {

                personInfo?: any;

                /**
                 * @uiLabel - ${this._("w_Member_ExtensionNumber")}
                 * @uiAttrs - { min: 0}
                 * @uiColumnGroup - row1
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                extensionNumber?: number;

                /**
                 * @uiLabel - ${this._("w_Member_MVPN")}
                 * @uiColumnGroup - row1
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                MVPN?: string;

                /**
                 * @uiLabel - ${this._("w_Member_Phone")}
                 * @uiColumnGroup - row1
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                phone?: string;

                /**
                 * @uiLabel - ${this._("w_Member_Email")}
                 * @uiColumnGroup - row2
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                email?: string;

                /**
                 * @uiLabel - ${this._("w_Member_Gender")}
                 * @uiColumnGroup - row2
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                gender?: string;

                /**
                 * @uiLabel - ${this._("w_Member_Birthday")}
                 * @uiColumnGroup - row2
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                birthday?: string;

                companyInfo?: any;

                /**
                 * @uiLabel - ${this._("w_Member_Department")}
                 * @uiColumnGroup - row4
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                department?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CostCenter")}
                 * @uiColumnGroup - row4
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                costCenter?: string;

                /**
                 * @uiLabel - ${this._("w_Member_Area")}
                 * @uiColumnGroup - row4
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                area?: string;

                /**
                 * @uiLabel - ${this._("w_Member_WorkArea")}
                 * @uiColumnGroup - row5
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                workArea?: string;

                /**
                 * @uiLabel - ${this._("w_Member_RegistrationDate")}
                 * @uiColumnGroup - row5
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                registrationDate?: string;

                /**
                 * @uiLabel - ${this._("w_Member_ResignationDate")}
                 * @uiColumnGroup - row5
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
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
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                carLicenseCategory?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CardLicense")}
                 * @uiColumnGroup - row1
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                cardLicense?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CarLicense")}
                 * @uiColumnGroup - row1
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                carLicense?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CarLicense1")}
                 * @uiColumnGroup - row2
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                carLicense1?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CarLicense2")}
                 * @uiColumnGroup - row2
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                carLicense2?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CarLicense3")}
                 * @uiColumnGroup - row2
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                carLicense3?: string;
                /*
                * @uiHidden - true
                */
                accountInfo?: any;

                /**
                 * @uiLabel - ${this._("w_Member_Account")}
                 * @uiColumnGroup - row2
                 * @uiHidden - true
                 */
                account?: string;

                /**
                 * @uiLabel - ${this._("w_Member_Password")}
                 * @uiColumnGroup - row2
                 * @uiType - iv-form-password
                 * @uiHidden - true
                 */
                password?: string;

                /**
                 * @uiColumnGroup - row2
                 * @uiHidden - true
                 */
                row23?: string;
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
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                resignationNote?: string;

                /**
                 * @uiLabel - ${this._("w_Member_ResignationRecordCardRecord")}
                 * @uiColumnGroup - row1
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                resignationRecordCardRecord?: string;

                /**
                 * @uiColumnGroup - row1
                 * @uiHidden - true
                 */
                row13?: string;

                /**
                 * @uiLabel - ${this._("ReasonForCard1")}
                 * @uiColumnGroup - row2
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                reasonForCard1?: string;

                /**
                 * @uiLabel - ${this._("w_Member_HistoryForCard1")}
                 * @uiColumnGroup - row2
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                historyForCard1?: string;

                /**
                 * @uiLabel - ${this._("w_Member_DateForCard1")}
                 * @uiColumnGroup - row2
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                dateForCard1?: string;

                /**
                 * @uiLabel - ${this._("ReasonForCard2")}
                 * @uiColumnGroup - row3
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                reasonForCard2?: string;

                /**
                 * @uiLabel - ${this._("w_Member_HistoryForCard2")}
                 * @uiColumnGroup - row3
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                historyForCard2?: string;

                /**
                 * @uiLabel - ${this._("w_Member_DateForCard2")}
                 * @uiColumnGroup - row3
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                dateForCard2?: string;

                /**
                 * @uiLabel - ${this._("ReasonForCard3")}
                 * @uiColumnGroup - row4
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                reasonForCard3?: string;

                /**
                 * @uiLabel - ${this._("w_Member_HistoryForCard3")}
                 * @uiColumnGroup - row4
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                historyForCard3?: string;

                /**
                 * @uiLabel - ${this._("w_Member_DateForCard3")}
                 * @uiColumnGroup - row4
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                dateForCard3?: string;

                carLicenseRecord?: any;

                /**
                 * @uiLabel - ${this._("w_Member_ReasonForApplication1")}
                 * @uiColumnGroup - row5
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                reasonForApplication1?: string;

                /**
                 * @uiLabel - ${this._("w_Member_DateForApplication1")}
                 * @uiColumnGroup - row5
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                dateForApplication1?: string;

                /**
                 * @uiColumnGroup - row5
                 * @uiHidden - true
                 */
                row53?: string;

                /**
                 * @uiLabel - ${this._("w_Member_ReasonForApplication2")}
                 * @uiColumnGroup - row6
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                reasonForApplication2?: string;

                /**
                 * @uiLabel - ${this._("w_Member_DateForApplication2")}
                 * @uiColumnGroup - row6
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                dateForApplication2?: string;

                /**
                 * @uiColumnGroup - row6
                 * @uiHidden - true
                 */
                row63?: string;

                /**
                 * @uiLabel - ${this._("w_Member_ReasonForApplication3")}
                 * @uiColumnGroup - row7
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                reasonForApplication3?: string;

                /**
                 * @uiLabel - ${this._("w_Member_DateForApplication3")}
                 * @uiColumnGroup - row7
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                dateForApplication3?: string;

                /**
                 * @uiColumnGroup - row7
                 * @uiHidden - true
                 */
                row73?: string;

                /**
                 * @uiLabel - ${this._("w_Member_ResignationRecordCarLicense")}
                 * @uiColumnGroup - row8
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                resignationRecordCarLicense?: string;

                /**
                 * @uiColumnGroup - row8
                 * @uiHidden - true
                 */
                row82?: string;

                 /**
                 * @uiColumnGroup - row8
                 * @uiHidden - true
                 */
                row83?: string;
            }
        `;
  }

  ITabForm4() {
    return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Member_CardTemplate")}
                 * @uiColumnGroup - row13
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                cardTemplate?: ${toEnumInterface(
                  this.cardTemplateSelectItem as any,
                  false
                )};

               /**
                * @uiColumnGroup - row13
                */
                imageSrcCard?:any;
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
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                censusRecord1?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CensusDate1")}
                 * @uiColumnGroup - row5
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                censusDate1?: string;

                /**
                 * @uiColumnGroup - row5
                 * @uiHidden - true
                 */
                row53?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CensusRecord2")}
                 * @uiColumnGroup - row6
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                censusRecord2?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CensusDate2")}
                 * @uiColumnGroup - row6
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                censusDate2?: string;

                /**
                 * @uiColumnGroup - row6
                 * @uiHidden - true
                 */
                row63?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CensusRecord3")}
                 * @uiColumnGroup - row7
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                censusRecord3?: string;

                /**
                 * @uiLabel - ${this._("w_Member_CensusDate3")}
                 * @uiColumnGroup - row7
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                censusDate3?: string;

                /**
                 * @uiColumnGroup - row7
                 * @uiHidden - true
                 */
                row73?: string;

               parkingViolation?: any;

                /**
                 * @uiLabel - ${this._("w_Member_InfoOfViolation1")}
                 * @uiColumnGroup - row15
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                infoOfViolation1?: string;

                /**
                 * @uiLabel - ${this._("w_Member_DateOfViolation1")}
                 * @uiColumnGroup - row15
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                dateOfViolation1?: string;

                /**
                 * @uiColumnGroup - row15
                 * @uiHidden - true
                 */
                row153?: string;

                /**
                 * @uiLabel - ${this._("w_Member_InfoOfViolation2")}
                 * @uiColumnGroup - row16
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                infoOfViolation2?: string;

                /**
                 * @uiLabel - ${this._("w_Member_DateOfViolation2")}
                 * @uiColumnGroup - row16
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                dateOfViolation2?: string;

                /**
                 * @uiColumnGroup - row16
                 * @uiHidden - true
                 */
                row163?: string;

                /**
                 * @uiLabel - ${this._("w_Member_InfoOfViolation3")}
                 * @uiColumnGroup - row17
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                infoOfViolation3?: string;

                /**
                 * @uiLabel - ${this._("w_Member_DateOfViolation3")}
                 * @uiColumnGroup - row17
                 * @uiType - iv-form-date
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 */
                dateOfViolation3?: string;

                /**
                 * @uiColumnGroup - row17
                 * @uiHidden - true
                 */
                row173?: string;

             }
        `;
  }

  IViewForm() {
    return `interface{}`;
  }
  filterInterface(): string {
    return `interface {
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._("w_Member_EmployeeNumber1")}
             */
            EmployeeNumber?: string;
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._("w_Member_CardNumber1")}
             */
            CardNumber?: string;
             /**
             * @uiColumnGroup - row2
             * @uiLabel - ${this._("w_Member_CardType1")}
             */
            CardType?: string;
            /**
             * @uiColumnGroup - row2
             * @uiLabel - ${this._("w_Member_ChineseName1")}
             */
            LastName?: string;
            /**
             * @uiColumnGroup - row3
             * @uiLabel - ${this._("w_Member_EnglishName1")}
             */
            FirstName?: string;
            /**
             * @uiColumnGroup - row3
             * @uiLabel - ${this._("w_Member_Department1")}
             */
            DepartmentName?:string;
            /**
             * @uiColumnGroup - row4
             * @uiLabel - ${this._("w_Member_CostCenter1")}
             */
            CostCenterName?:string;
            /**
             * @uiColumnGroup - row4
             * @uiLabel - ${this._("w_Member_WorkArea1")}
             */
            WorkAreaName?:string;
            /**
             * @uiColumnGroup - datefilter
             * @uiType - iv-form-date
             * @uiLabel - ${this._("w_Report_DateStart")}
             */
            StartDateStart?:Date;
            /**
             * @uiColumnGroup - datefilter
             * @uiType - iv-form-date
             * @uiLabel - ${this._("w_Interval")}
             */
            StartDateEnd?:Date;
            /**
             * @uiColumnGroup - datefilter
             * @uiType - iv-form-date
             * @uiLabel - ${this._("w_Report_DateEnd")}
             */
            EndDateStart?:Date;
            /**
             * @uiColumnGroup - datefilter
             * @uiType - iv-form-date
             * @uiLabel - ${this._("w_Interval")}
             */
            EndDateEnd?:Date;
        }`;
  }
  private isMounted: boolean = false;
  getParams: any = {};
  private doMounted() {
    this.isMounted = true;
  }
  onFilter($event) {
    if ($event.StartDateStart)
      $event.start1 = $event.StartDateStart.toISOString();
    if ($event.StartDateEnd) $event.end1 = $event.StartDateEnd.toISOString();
    if ($event.EndDateStart) $event.start2 = $event.EndDateStart.toISOString();
    if ($event.EndDateEnd) $event.end2 = $event.EndDateEnd.toISOString();

    this.getParams = $event;
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
  max-width: 250px;
  min-width: 200px;
  max-height: none;
  min-height: auto;
  height: 100%;
  margin-bottom: 10px;
}
</style>
