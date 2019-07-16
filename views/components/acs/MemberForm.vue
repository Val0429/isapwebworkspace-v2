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
        @update:cardCertificate="onCardCertificateUpdate($event)"
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
import moment from 'moment';
import { CustomFields } from "@/../src/constants/customfields";
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
    this.canAdd = this.$user.permissions.find(x => x.access.C === true && x.of.identifier == this.permissionName) != undefined;
    this.canEdit = this.$user.permissions.find(x => x.access.U === true && x.of.identifier == this.permissionName) != undefined;
    this.canDelete = this.$user.permissions.find(x => x.access.D === true && x.of.identifier == this.permissionName) != undefined;
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
  workGroupSelectItems:any[]=[];
  workGroupSelectItem: any = {};
  cardTemplateSelectItem: any = {
    permanent: ITemplateCard.permanent,
    contract: ITemplateCard.contract
  };
  workGroupIdSelectItem: any = {};
  cardProfileOptions: any = {};
  certificateOptions: any = {};
  carLicenseOptions: any = {};
  credentialProfiles :any[]=[];
  createReason1Options: any = {};
  createReason2Options: any = {};
  createReason3Options: any = {};

  applyReason1Options: any = {};
  applyReason2Options: any = {};
  applyReason3Options: any = {};

  inputTestEmail: string = "";
  newImg = new Image();
  newImgSrc = "";
  imageSrcCard = "";
  premissionOptions: ISortSelectOption[] = [];
  tabMounted: boolean = false;
  doTabMount() {
    this.tabMounted = true;
  }

  inputFormData: any = {};
  defaultFormData:any = {
    // Master
    objectId: undefined,
    premissionSelected: [],
    personType: "2000000006",
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
    cardCertificate: "2",
    profileName:"",
    technologyCode:"",
    pinMode:0,
    pinDigit:0,    
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
    this.inputFormData = Object.assign({}, this.defaultFormData);
  }

  created() {}

  async mounted() {
    await Promise.all([
      this.initSelectItemWorkGroup(),      
      this.initDropDownList("Certification").then(res=>this.certificateOptions=res),
      this.initDropDownList("ProfileId","key").then(res=>this.cardProfileOptions=res),
      this.initDropDownList("License").then(res=>this.carLicenseOptions=res),      
      this.initDropDownList("CreateReason1").then(res=>this.createReason1Options=res),
      this.initDropDownList("CreateReason2").then(res=>this.createReason2Options=res),
      this.initDropDownList("CreateReason3").then(res=>this.createReason3Options=res),
      this.initDropDownList("ApplyReason1").then(res=>this.applyReason1Options=res),
      this.initDropDownList("ApplyReason2").then(res=>this.applyReason2Options=res),
      this.initDropDownList("ApplyReason3").then(res=>this.applyReason3Options=res)
    ]);
    await this.initCredentialProfile();
  }
  //@Watch("inputFormData.cardCertificate", {immediate:true})
  onCardCertificateUpdate(value:any){
    let profile = this.credentialProfiles.find(x=>x.Token == value);
    if(!profile)return;
    this.inputFormData.deviceNumber = profile.FacilityCode;
    this.inputFormData.pinDigit = profile.PINDigits;
    this.inputFormData.profileName = profile.Name;
    this.inputFormData.technologyCode = profile.CardTechnologyCode;
    let pinMode =0;
    switch(profile.PINModeValue.Name){
        case "CARD" : pinMode=1;break;
        case "PIN AS CARD" : pinMode=2;break;
        case "CARD AND PIN" : pinMode=4;break;
    }
    this.inputFormData.pinMode=pinMode;
    
  }
  async initSelectItemWorkGroup() {
    this.workGroupSelectItem = {};
    this.workGroupSelectItems=[];
    await this.$server
      .R("/acs/workgroup")
      .then((response: any) => {
        if (response != undefined) {
          this.workGroupSelectItems = response.results;
          for (const returnValue of response.results) {
            // 自定義 sitesSelectItem 的 key 的方式
            this.workGroupSelectItem[returnValue.groupid.toString()] =
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
  async initCredentialProfile() {
    this.credentialProfiles=[];
    let response:any = await this.$server.R("/acs/credentialprofiles" as any, {});
    this.credentialProfiles = response.results;
  }
  async initDropDownList(type:string,key:string="name", value:string="name") {     
      let resp:any = await this.$server .R("/acs/dropdownlist", { type });
      let result = {};
       for(let res of resp.results){
         result[res[key]]=res[value];
       }
       return result;
    }

  selectedItem(data) {
    this.isSelected = data;
    this.selectedDetail = [];
    this.selectedDetail = data;
  }
  getFieldValue(fieldName:string, customFields:any[], isDate:boolean=false){
      
      let exists = customFields.find(x=>x.FiledName == fieldName);
      
      if(!exists)return isDate ? null : "";

      try{        
        return isDate ? new Date(exists.FieldValue) :exists.FieldValue;
      }catch(err){
        console.error(err);
        return isDate ? null : "";
      }
      
  }
  getInputData() {
    this.clearInputData();

    if (!this.selectedDetail[0]) return;
      let detailData = this.selectedDetail[0];

      // Master form      
      this.inputFormData.objectId = detailData.objectId;      

      if (detailData.AccessRules) {
        for (let rule of detailData.AccessRules) {
              this.inputFormData.premissionSelected.push(rule.RuleToken ? rule.RuleToken: rule);            
        }
      }
      
      this.inputFormData.personType = (detailData.PrimaryWorkgroupId || 2000000006).toString();
      this.inputFormData.employeeNumber = detailData.EmployeeNumber;      
      this.inputFormData.chineseName = detailData.LastName;
      this.inputFormData.englishName = detailData.FirstName;
      
    
      if (detailData.Credentials && detailData.Credentials.length>0){        
        console.log("detailData.Credentials[0]",detailData.Credentials[0])
        this.inputFormData.cardNumber = detailData.Credentials[0].CardNumber;
        this.inputFormData.cardAllNumber = detailData.Credentials[0].CardNumber;
        this.inputFormData.cardCertificate = (detailData.Credentials[0].ProfileId || 2).toString();
        this.inputFormData.deviceNumber = detailData.Credentials[0].FacilityCode;
        this.inputFormData.pinDigit = detailData.Credentials[0].PinDigit;
        this.inputFormData.profileName = detailData.Credentials[0].ProfileName;
        this.inputFormData.technologyCode = detailData.Credentials[0].CardTechnologyCode;    
        this.inputFormData.pinMode = detailData.Credentials[0].PinMode;
        this.inputFormData.startDate = detailData.Credentials[0].StartDate;
        this.inputFormData.endDate = detailData.Credentials[0].StartDate;
        this.inputFormData.pin = detailData.Credentials[0].Pin || "0";
      }

      if (detailData.StartDate) {
        try {
          this.inputFormData.startDate = new Date(detailData.StartDate);
        } catch (e) {
          console.log(e);
        }
      }

      if (detailData.EndDate) {
        try {
          this.inputFormData.endDate = new Date(detailData.EndDate);
        } catch (e) {
          console.log(e);
        }
      }

      // tab1      
      this.inputFormData.extensionNumber = detailData.PhoneNumber;
      this.inputFormData.phone = detailData.MobileNumber;            
      this.inputFormData.email = detailData.Email;
      
      if (detailData.DateOfBirth) {
        try {
          this.inputFormData.birthday = new Date(detailData.DateOfBirth);
        } catch (e) {
          console.log(e);
        }
      }

      // tab2
      if (detailData.PersonalDetails && detailData.PersonalDetails.UserDetails) {
        this.inputFormData.account = detailData.PersonalDetails.UserDetails.UserName;
        this.inputFormData.password = detailData.PersonalDetails.UserDetails.Password;
      }
      //custom fields
      if (!detailData.CustomFields || detailData.CustomFields.length<=0) return;
      for(let field of CustomFields){
        this.inputFormData[field.name] = this.getFieldValue(field.fieldName, detailData.CustomFields, field.date);
      }           
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
    this.initPremission();
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
    
    let tempPersonalDetails: any = {
          Address: "",
          ContactDetails: {
              Email: this.inputFormData.email || "",
              MobileNumber: this.inputFormData.MobileNumber || "",
              MobileServiceProviderId: "0",
              PagerNumber: "",
              PagerServiceProviderId: "0",
              PhoneNumber: this.inputFormData.PhoneNumber || "",
              },
              DateOfBirth: this.inputFormData.birthday && !isNaN(this.inputFormData.birthday.getTime()) ? this.inputFormData.birthday.toISOString(): "",
              PayrollNumber: "",
              Title: "",
              UserDetails: {
                  Password: this.inputFormData.password || "",
                  UserName: this.inputFormData.account || ""
              }
    };
    
    let credential = {
          CardNumber: this.inputFormData.cardNumber,
          Pin: this.inputFormData.pin || "0",
          FacilityCode: parseInt(this.inputFormData.deviceNumber),
          ProfileId: !isNaN(parseInt(this.inputFormData.cardCertificate)) ? parseInt(this.inputFormData.cardCertificate) : 0,
          ProfileName : this.inputFormData.profileName,
          CardTechnologyCode : this.inputFormData.technologyCode,
          PinMode: this.inputFormData.pinMode,          
          PinDigit:this.inputFormData.pinDigit,
          EndDate:this.inputFormData.endDate || moment("2100-12-31 23:59:59", 'YYYY-MM-DD HH:mm:ss').toDate(),
          StartDate:this.inputFormData.startDate || new Date()
        };
    let tempCredentials: any = [];
    if (this.selectedDetail[0] && this.selectedDetail[0].Credentials && this.selectedDetail[0].Credentials.length>0) {
      tempCredentials = this.selectedDetail[0].Credentials;
      tempCredentials[0] = credential;
    } else {      
      tempCredentials = [credential];
    }

    let tempCustomFieldsList: any = [];
    for(let field of CustomFields){
      if(field.date){
        let dt = !isNaN(this.inputFormData[field.name].getTime()) ? this.inputFormData[field.name].toISOString() : "";
        tempCustomFieldsList.push({FiledName:field.fieldName,  FieldValue:dt});
      }else{
        tempCustomFieldsList.push({FiledName:field.fieldName, FieldValue:this.inputFormData[field.name] || ""});
      }
    }
   
    let member = {        
        // master
        objectId: this.inputFormData.objectId,
        AccessRules: this.inputFormData.premissionSelected,
        PrimaryWorkgroupId:parseInt(this.inputFormData.personType),
        ApbWorkgroupId:parseInt(this.inputFormData.personType),
        PrimaryWorkgroupName: this.workGroupSelectItems.find(x=>x.groupid==parseInt(this.inputFormData.personType)).groupname,
        EmployeeNumber: this.inputFormData.employeeNumber,
        LastName: this.inputFormData.chineseName,
        FirstName: this.inputFormData.englishName,
        StartDate: this.inputFormData.startDate || new Date(),
        EndDate: this.inputFormData.endDate || moment("2100-12-31 23:59:59", 'YYYY-MM-DD HH:mm:ss').toDate(),
        // EndDate: this.inputFormData.EndDate,

        // tab1
        extensionNumber: this.inputFormData.PhoneNumber,
        phone: this.inputFormData.MobileNumber,
        Email: this.inputFormData.email,
        DateOfBirth: this.inputFormData.birthday,
        SmartCardProfileId:"",
        Status:1,
        //new addition
        GeneralInformation:"",
        Attributes:{},
        NonPartitionWorkGroups:[],
        NonPartitionWorkgroupAccessRules:[],
        PrimaryWorkGroupAccessRule:[],       
        Token: "-1",
        Vehicle1: {},
        Vehicle2: {},
        VisitorDetails: {
            VisitorCardStatus: 0,
            VisitorCustomValues: {}
        },
        TraceDetails: {},
        // special
        Credentials: tempCredentials,
        PersonalDetails: tempPersonalDetails,
        CustomFields: tempCustomFieldsList
      };
    if (this.selectedDetail[0] && this.selectedDetail[0].objectId) {
      // master
      member.objectId = this.selectedDetail[0].objectId;
      await this.$server
        .U("/acs/member", member)
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
      await this.$server
        .C("/acs/member", member)
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
                cardType?: ${toEnumInterface(this.certificateOptions as any, false)};



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
                  this.cardProfileOptions as any,
                  false
                )};


                /**
                 * @uiHidden - true
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
                 */
                carLicenseCategory?: ${toEnumInterface(this.carLicenseOptions, false)};

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
                 */
                reasonForCard1?: ${toEnumInterface(this.createReason1Options, false)};

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
                 */
                reasonForCard2?: ${toEnumInterface(this.createReason2Options, false)};

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
                 */
                reasonForCard3?: ${toEnumInterface(this.createReason3Options, false)};

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
                 */
                reasonForApplication1?: ${toEnumInterface(this.applyReason1Options, false)};;

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
                 */
                reasonForApplication2?: ${toEnumInterface(this.applyReason2Options, false)};;

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
                 */
                reasonForApplication3?: ${toEnumInterface(this.applyReason3Options, false)};;

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
            CardType?: ${toEnumInterface(this.certificateOptions as any, false)};
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
    
    let params = $event;
    for (const key in params) {
      let value = params[key];
      if(!value)continue;
      let indexOfhash = value.indexOf('#');
      if(indexOfhash>-1)params[key]=value.substr(0, indexOfhash);
    }
    this.getParams = params;
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
