<template>
  <div class="animated fadeIn">
    <iv-modal :label="_('w_MemberFields')" :visible.sync="exportVisible">
      <h3>{{_("w_Download_Notify")}}</h3>
            <iv-form
                  ref="fieldForm"
                    :interface="exportInterface()"
                    @submit="exportToExcel($event)"
                >
                <template #fieldSelection="{$attrs, $listeners}">
                  <iv-sort-select
                    v-if="fieldOptions.length > 0"
                    v-model="fieldSelected"
                    class="col-md-12"
                    :options="fieldOptions"
                  ></iv-sort-select>
                </template>
                </iv-form>
                
        </iv-modal>
        
        <iv-modal :label="_('w_MemberFields')" :visible.sync="importVisible">
            <iv-form
                  ref="importForm"
                    :interface="importInterface()"
                    @submit="importMember($event)"
                >
                <template #data="{$attrs, $listeners}">
                    <div class="upload_file">
                        <b-form-file
                            v-bind="$attrs"
                            v-on="$listeners"
                            @change="handleXlsxFile($event)"
                        >
                        </b-form-file>
                    </div>

                </template>
                </iv-form>
                {{_("w_Import_RecordCount")}}:{{this.importRecords.length}}
        </iv-modal>
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
           <iv-toolbox-element-base
              v-bind="$attrs"
              :title="_('wb_Import')"
              icon="fa fa-upload"
              v-show="true"
              :variant="'light'"
              :size="'sm'"
              @click="showImportDialog()"
          />
        <iv-toolbox-export :disabled="!submitClicked" @click="showExportDialog()"/>
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
        <template #startDate="{$attrs, $listeners}">
          {{momento($attrs.value).format("YYYY-MM-DD")}}
        </template>
        <template #endDate="{$attrs, $listeners}">
            {{momento($attrs.value).format("YYYY-MM-DD")}}
        </template>
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
        @submit="doSave($event)"
      >
        <template #infoCard="{ $attr }">
          <h4 class="ml-3 mt-4 font-weight-bold">{{ _('w_Member_Info') }}</h4>
        </template>

        <template #info="{ $attr }">
          <h4 class="ml-3 mt-4 font-weight-bold">{{ _('w_Member_Info') }}</h4>
        </template>

        <template #imageSrc="{ $attrs, $listeners}" v-if="inputFormData.cardholderPortrait">
          <label class="col-md-12">{{_("w_Member_PersonPic")}}</label>
          <img class="imgSide" v-bind="$attrs" v-on="$listeners"
             :src="inputFormData.cardholderPortrait.indexOf(',')>-1?inputFormData.cardholderPortrait:('data:image/png;base64,'+inputFormData.cardholderPortrait)" />
        </template>

        <template #permissionTable="{ $attr }">
          <h4 class="ml-3 mt-4 font-weight-bold">{{ _('w_Member_PermissionTable') }}</h4>
        </template>

        <template #premissionList>               
          <iv-sort-select
            v-if="permissionOptions.length > 0"
            v-model="permissionSelected"
            class="col-md-12"
            :options="permissionOptions"
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
import * as XLSX from 'xlsx';
// Sort Select
import { ISortSelectOption } from "@/components/SortSelect";
import SortSelect from "@/components/SortSelect/SortSelect.vue";
import ServerConfig from "@/services/ServerConfig";
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
export default class Member extends Vue {
  serverUrl = ServerConfig.url;
  momento = moment;
  
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
  exportVisible:boolean=false;
  inputTestEmail: string = "";
  newImg = new Image();  
  imageSrcCard = "";
  permissionOptions: ISortSelectOption[] = [];
  tabMounted: boolean = false;
  doTabMount() {
    this.tabMounted = true;
  }
  permissionSelected:any[]=[];
  inputFormData: any = {};
  defaultFormData:any = {
    cardCertificate: "2",
    cardNumber:"",
    endDate:"",
    startDate:""
  };

  clearInputData() {    
    this.permissionSelected=[];    
    this.inputFormData = Object.assign({}, this.defaultFormData);
    let defaultWg=this.workGroupSelectItems.find(x=>x.groupname=="正職");
    this.inputFormData.personType = defaultWg ? defaultWg.groupid.toString() : 1;
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
  async getMemberFields(){
    if(this.savedFieldOptions.length==0){
      let memberFields:any = await this.$server.R("/acs/memberfields" as any, {});
      for(let key of memberFields){
        if(this.excludeFields.find(x=>x==key))continue;
        this.savedFieldOptions.push({value:key, text:this._(key as any)});
      }
      //to trigger option changed
      this.fieldOptions=this.savedFieldOptions;
    }
    console.log("savedFieldOptions", this.savedFieldOptions);
  }
  async showExportDialog(){
    await this.getMemberFields();
    this.exportVisible=true;
  }
  importVisible:boolean=false;
  async showImportDialog(){
    if(this.storedPermissionOptions.length==0) await this.initPremission();
    await this.getMemberFields();
    this.importVisible=true;
  }
  importRecords:any[]=[];
  handleXlsxFile(e) {
    this.importRecords=[];
    let records = this.importRecords;
    let fieldOptions = this.savedFieldOptions;
    let storedPermissionOptions = this.storedPermissionOptions;
    var files = e.target.files, f = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
    var data = new Uint8Array((e.target as any).result);
    var workbook = XLSX.read(data, {type: 'array'});
    /* DO SOMETHING WITH workbook HERE */
     var sheet_name_list = workbook.SheetNames;
     console.log(sheet_name_list[0]);
    let rawJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    console.log("rawJson", rawJson.splice(0,1));
    for(let record of rawJson){
        let newRecord:any={};
        
        for(const key of fieldOptions.map(x=>x.value)){
          if(key=="permissionTable"){
             newRecord["tempPermissionTable"]=record[key];
            let accessRules=[];
            let permTables = record[key].split(",");
            for(let permTable of permTables){
                if(!permTable)continue;
                let exist = storedPermissionOptions.find(x=>x.text == permTable);
                accessRules.push(exist ? exist.value : permTable);
            }
            newRecord[key]=accessRules;
           
          }
          else newRecord[key]=record[key];
          
        }
        records.push(newRecord);
    }
    console.log(records);
  };
  reader.readAsArrayBuffer(f);
}
  importInterface(){
    return `
      interface {        
        data:any;
      }
    `; 
  }
  exportInterface(){
    return `
      interface {        
        fieldSelection?:any[];
      }
    `; 
  }
  async exportToExcel($event){
    console.log("exportToExcel", $event);
        if(this.fieldSelected.length==0)return;
        if(this.storedPermissionOptions.length==0) await this.initPremission();
        let extraHeader:any={};
        for(let field of this.fieldSelected){          
          extraHeader[field]=this._(field as any);
        }
        let resp:any = await this.$server.C("/acs/exportmember" as any, 
                            { 
                              filter: this.getParams, 
                              fieldSelected:this.fieldSelected,
                              storedPermissionOptions:this.storedPermissionOptions,
                              extraHeader
                            });
       if(resp.file){
         let downloadFileFunc = async()=>{
           try{
              
              let respCheckFile:any = await this.$server.R("/acs/exportmember" as any, {fileName:resp.file});
              console.log("respCheckFile", respCheckFile.ready);
              if(!respCheckFile.ready) throw new Error("file is not ready");    
              window.location.href = this.serverUrl+"files/"+resp.file+"?sessionId="+this.$user.sessionId;
              
           }catch(err){
             console.error("error checking file", err);
             setTimeout(downloadFileFunc, 3000);
           }
         };
         
         setTimeout(downloadFileFunc, 3000);
       }
        this.exportVisible=false;
        this.fieldSelected=[];
        this.fieldOptions = this.savedFieldOptions;
  }
  async importMember($event){
    if(this.importRecords.length==0)return;
    let promises =[];
    for(let record of this.importRecords){
        if(!record.employeeNumber){
          record.importResult="failed";
          continue;
        }
        let empNoCheck:any = await this.$server.R("/acs/member",{eEmployeeNumber:record.employeeNumber});
        if(empNoCheck.results.length>0){
            let exist = empNoCheck.results.find(x=>x.employeeNumber == record.employeeNumber);
            record.objectId = exist.objectId;
        }
        promises.push(this.saveAddOrEdit(record, record.permissionTable, false, false)
            .then(()=>{
              record.importResult=record.objectId?"updated": "created";
              record.permissionTable = record.tempPermissionTable;
              delete(record.objectId);
              delete(record.tempPermissionTable);
              }));
    }
    await Promise.all(promises);
    let headers=[];
        let extraHeader:any={};
        for(let field of Object.keys(this.importRecords[0])){
          headers.push(field);
          extraHeader[field]=this._(field as any);
        }
        this.importRecords.unshift(extraHeader);
        
    let workbook = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet([headers]);        
        XLSX.utils.sheet_add_json(ws, this.importRecords,  {skipHeader: true, origin: "A2"});
        XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");    
        XLSX.writeFile(workbook, `importresult.xlsx`);
    this.importVisible=false;
  }
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
            this.workGroupSelectItem[returnValue.groupid.toString()] =
              returnValue.groupname;
          }
        }
      });
  }
  async initCredentialProfile() {
    this.credentialProfiles=[];
    let response:any = await this.$server.R("/acs/credentialprofiles" as any, {});
    this.credentialProfiles = response.results;
  }
  async initDropDownList(type:string,key:string="name", value:string="name") {
      let resp:any = await this.$server .R("/acs/dropdownlist", { type });
      if(type=="ProfileId"){                    
          let p35bit=resp.results.find(x=>x.name=="35 bit");
          this.defaultFormData.cardCertificate=p35bit ? p35bit.key.toString() : '0';
      }
      let result = {};
       for(let res of resp.results){
         result[res[key]]=res[value];
       }
       return result;
    }
  savedFieldOptions=[];
  fieldOptions=[];
  fieldSelected=[];
  excludeFields = ["cardAllNumber","pinDigit","profileName", 
              "technologyCode", "token", "status","permissionTable.tablename",
              "createdAt","updatedAt","isImageChanged",
              "pinMode","primaryWorkgroupId",
              "cardholderPortrait"];
  selectedItem(data) {
    this.isSelected = data;
    this.selectedDetail = data;
  }
  
  async getInputData() {
    this.clearInputData();

    if (!this.selectedDetail[0]) return;
      let resp:any = await this.$server.R("/acs/member", {objectId:this.selectedDetail[0].objectId, showImage:"true"}) ;
       // Master form      
      this.inputFormData = resp.results[0];
      console.log("image", this.inputFormData.cardholderPortrait ? this.inputFormData.cardholderPortrait.substr(0,100): "")
     

      if (this.inputFormData.permissionTable) {
        console.log("pushing from access rules")
        for (let rule of this.inputFormData.permissionTable) {
              this.permissionSelected.push(rule.objectId);            
        }
      }
      if(this.inputFormData.lastEditTime){
        this.inputFormData.lastEditTime = moment(this.inputFormData.lastEditTime).format("YYYY-MM-DD HH:mm:ss");
      }
      let defaultWg=this.workGroupSelectItems.find(x=>x.groupname=="正職");
      this.inputFormData.personType = (this.inputFormData.primaryWorkgroupId || (defaultWg ? defaultWg.groupid : 1)).toString();
              
  }

  tempSaveInputData(data) {
    switch (data.key) {  
      
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
        default:
          this.inputFormData[data.key] = data.value;
          break;
    }
  }

  async pageToAdd() {
    this.pageStep = EPageStep.add;
    this.clearInputData();
    await this.initPremission();
  }
  storedPermissionOptions:any[]=[];
  async initPremission() {
    if(this.storedPermissionOptions.length==0){
      await this.$server
        .R("/acs/permissiontable", {"paging.all":"true","system":0})
        .then((response: any) => {
          this.storedPermissionOptions=response.results
          .filter((x, index, self)=>{ return x.objectId && x.tablename && self.indexOf(x)===index})
          .map(content=>{
            return{
              value: content.objectId,
              text: content.tablename
          }})        
        });
    }
    //force on options change triggerred
    this.permissionOptions = Object.assign([],this.storedPermissionOptions);
    
  }

  async pageToEdit() {
    await this.getInputData();
    await this.initPremission();
    this.pageStep = EPageStep.edit;
  }

  async pageToView() {
    await this.getInputData();
    await this.initPremission();
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
    let parent=this;
    if (file) {
      ImageBase64.fileToBase64(file, (base64 = "") => {
        if (base64 != "") {
          this.newImg = new Image();
          this.newImg.src = base64;
          this.newImg.onload = () => {
            parent.inputFormData.cardholderPortrait = base64;
            parent.inputFormData.isImageChanged=true;
            
          };
        } else {
          Dialog.error(this._("w_Member_ErrorUploadFile"));
        }
      });
    }
  }
  testDate(date, splitter:string="."){
      try{    
       let dt = new Date(date);
       return dt.toISOString().split(splitter)[0];
    }catch (err){
        return "";
    }
  }
  async doSave($event){
    await this.saveAddOrEdit(this.inputFormData, this.permissionSelected);
  }
  async saveAddOrEdit(inputFormData:any, accessRules:string[], checkDuplication:boolean=true,refreshAfterwards:boolean=true) {
    inputFormData.permissionTable = accessRules;
    let defaultWg=this.workGroupSelectItems.find(x=>x.groupname=="正職");
    this.inputFormData.personType = parseInt(this.inputFormData.personType || defaultWg.groupid );
    if (inputFormData.objectId) {
      if(checkDuplication){
        let isDuplicateFound = await this.checkDuplication(inputFormData);
        if(isDuplicateFound)return;
      }
      
      await this.$server
        .U("/acs/member", inputFormData)
        .then((response: any) => {
          if(refreshAfterwards)this.pageToList();
        });
    } 
    else {
      if(checkDuplication){
        let isDuplicateFound = await this.checkDuplication(inputFormData);
        if(isDuplicateFound)return;
      }
      
      await this.$server
        .C("/acs/member", inputFormData)
        .then((response: any) => {
          if(refreshAfterwards)this.pageToList();
        });
    }
  }
  async checkDuplication(member:any):Promise<boolean>{
    console.log("employee number check", member.employeeNumber);
    let empNoDuplication:any = await this.$server.R("/acs/member",{eEmployeeNumber:member.employeeNumber});
      if(empNoDuplication.results.length>0){        
        let isDuplicate = member.objectId ? empNoDuplication.results[0].objectId!=member.objectId : true;
        if(isDuplicate){
          alert(this._("w_Error_DuplicateEmployeeNumber"));
          return isDuplicate;
        }
      }
      if(!member.cardNumber)return false;
      console.log("card number check", member.cardNumber);
      let cardDuplication:any = await this.$server.R("/acs/member",{eCardNumber:member.cardNumber});
      if(cardDuplication.results.length>0){          
        let isDuplicate = member.objectId ? cardDuplication.results[0].objectId!=member.objectId : true;          
        if(isDuplicate)alert(this._("w_Error_DuplicateCardNumber"));
        return isDuplicate;
      }
      
      return false; 
  }
  async doDelete() {
     if(this.selectedDetail.length==0) return;
    await Dialog.confirm(     
      this._("w_Member_DeleteConfirm"),
      this._("w_DeleteConfirm"),
      async () => {
        let promises = [];
        for(let member of this.selectedDetail){
          promises.push(this.$server
            .D("/acs/member", {
              objectId: member.objectId
            }))
        }
          await Promise.all(promises);
           this.pageToList(); 
        }
      
    );
  }


 
  ITableList() {
    return `
            interface {

                /**
                 * @uiLabel - ${this._("employeeNumber")}
                 */
                employeeNumber: string;

                /**
                 * @uiLabel - ${this._("cardNumber")}
                 */
                cardNumber: string;

                /**
                 * @uiLabel - ${this._("primaryWorkgroupName")}
                 */
                primaryWorkgroupName: string;

                /**
                 * @uiLabel - ${this._("chineseName")}
                 */
                chineseName: string;

                /**
                 * @uiLabel - ${this._("englishName")}
                 */
                englishName: string;

                /**
                 * @uiLabel - ${this._("department")}
                 */
                department: string;

                /**
                 * @uiLabel - ${this._("costCenter")}
                 */
                costCenter: string;

                /**
                 * @uiLabel - ${this._("startDate")}
                 */
                startDate: string;

                /**
                 * @uiLabel - ${this._("endDate")}
                 */
                endDate: string;

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
                 * @uiLabel - ${this._("companyName")}
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
                 * @uiLabel - ${this._("personType")}
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
                 * @uiLabel - ${this._("employeeNumber")}
                 * @uiColumnGroup - row1
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                employeeNumber: string;

                /**
                 * @uiLabel - ${this._("chineseName")}
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
                 * @uiLabel - ${this._("englishName")}
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
                 * @uiLabel - ${this._("cardType")}
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
                * @uiLabel - ${this._("personPhoto")}
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
                 * @uiLabel - ${this._("cardCustodian")}
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
                 * @uiLabel - ${this._("void")}
                 * @uiColumnGroup - row3
                 */
                void?: boolean;

               /**
                * @uiColumnGroup - row13
                */
                imageSrc?:any;



                ////////////////////////////////////////////////////////////////////////////////////


                infoCard?: any;


                /**
                 * @uiLabel - ${this._("cardNumber")}
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
                 * @uiLabel - ${this._("cardCertificate")}
                 * @uiColumnGroup - row33
                 * @uiDisabled - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "false"
                     : "true"
                 }
                 * @uiHidden - ${!this.inputFormData.cardNumber || this.inputFormData.cardNumber=="" ? "true":"false"}
                 */
                cardCertificate?: ${toEnumInterface(
                  this.cardProfileOptions as any,
                  false
                )};


                /**
                 * @uiLabel - ${this._("pin")}
                 * @uiColumnGroup - row33
                 * @uiDisabled - ${!this.inputFormData.cardNumber || this.inputFormData.cardNumber=="" ? "true":"false"}
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                pin?: string;

                /**
                 * @uiLabel - ${this._("allCardNumber")}
                 * @uiColumnGroup - row173
                 * @uiType - ${
                   this.pageStep === EPageStep.add ||
                   this.pageStep === EPageStep.edit
                     ? "iv-form-string"
                     : "iv-form-label"
                 }
                 */
                allCardNumber?: string;

                



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
                * @uiLabel - ${this._("startDate")}
                * @uiPlaceHolder - ${this._("startDate")}
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
                * @uiLabel - ${this._("endDate")}
                * @uiPlaceHolder - ${this._("endDate")}
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
                 * @uiLabel - ${this._("lastEditPerson")}
                 * @uiPlaceHolder - ${this._("lastEditPerson")}
                 * @uiColumnGroup - row5
                 * @uiType - iv-form-label
                 */
                lastEditPerson?: string;

                /**
                 * @uiLabel - ${this._("lastEditTime")}
                 * @uiPlaceHolder - ${this._("lastEditTime")}
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
                 * @uiLabel - ${this._("extensionNumber")}
                 * @uiAttrs - { min: 0}
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
                 * @uiLabel - ${this._("MVPN")}
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
                 * @uiLabel - ${this._("phone")}
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
                 * @uiLabel - ${this._("email")}
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
                 * @uiLabel - ${this._("gender")}
                 * @uiColumnGroup - row2
                 */
                gender?: ${toEnumInterface({"男":"男","女":"女"},false)};

                /**
                 * @uiLabel - ${this._("birthday")}
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
                 * @uiLabel - ${this._("department")}
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
                 * @uiLabel - ${this._("costCenter")}
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
                 * @uiLabel - ${this._("area")}
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
                 * @uiLabel - ${this._("workArea")}
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
                 * @uiLabel - ${this._("registrationDate")}
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
                 * @uiLabel - ${this._("resignationDate")}
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
                 * @uiLabel - ${this._("carLicenseCategory")}
                 * @uiColumnGroup - row1
                 */
                carLicenseCategory?: ${toEnumInterface(this.carLicenseOptions, false)};

                /**
                 * @uiLabel - ${this._("cardLicense")}
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
                 * @uiLabel - ${this._("carLicense")}
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
                 * @uiLabel - ${this._("carLicense1")}
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
                 * @uiLabel - ${this._("carLicense2")}
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
                 * @uiLabel - ${this._("carLicense3")}
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
                 * @uiLabel - ${this._("account")}
                 * @uiColumnGroup - row2
                 * @uiHidden - true
                 */
                account?: string;

                /**
                 * @uiLabel - ${this._("password")}
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
                 * @uiLabel - ${this._("resignationNote")}
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
                 * @uiLabel - ${this._("resignationRecordCardRecord")}
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
                 * @uiLabel - ${this._("reasonForCard1")}
                 * @uiColumnGroup - row2
                 */
                reasonForCard1?: ${toEnumInterface(this.createReason1Options, false)};

                /**
                 * @uiLabel - ${this._("historyForCard1")}
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
                 * @uiLabel - ${this._("dateForCard1")}
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
                 * @uiLabel - ${this._("reasonForCard2")}
                 * @uiColumnGroup - row3
                 */
                reasonForCard2?: ${toEnumInterface(this.createReason2Options, false)};

                /**
                 * @uiLabel - ${this._("historyForCard2")}
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
                 * @uiLabel - ${this._("dateForCard2")}
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
                 * @uiLabel - ${this._("reasonForCard3")}
                 * @uiColumnGroup - row4
                 */
                reasonForCard3?: ${toEnumInterface(this.createReason3Options, false)};

                /**
                 * @uiLabel - ${this._("historyForCard3")}
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
                 * @uiLabel - ${this._("dateForCard3")}
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
                 * @uiLabel - ${this._("reasonForApplication1")}
                 * @uiColumnGroup - row5
                 */
                reasonForApplication1?: ${toEnumInterface(this.applyReason1Options, false)};;

                /**
                 * @uiLabel - ${this._("dateForApplication1")}
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
                 * @uiLabel - ${this._("reasonForApplication2")}
                 * @uiColumnGroup - row6
                 */
                reasonForApplication2?: ${toEnumInterface(this.applyReason2Options, false)};;

                /**
                 * @uiLabel - ${this._("dateForApplication2")}
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
                 * @uiLabel - ${this._("reasonForApplication3")}
                 * @uiColumnGroup - row7
                 */
                reasonForApplication3?: ${toEnumInterface(this.applyReason3Options, false)};;

                /**
                 * @uiLabel - ${this._("dateForApplication3")}
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
                 * @uiLabel - ${this._("resignationRecordCarLicense")}
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
                 * @uiLabel - ${this._("censusRecord1")}
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
                 * @uiLabel - ${this._("censusDate1")}
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
                 * @uiLabel - ${this._("censusRecord2")}
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
                 * @uiLabel - ${this._("censusDate2")}
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
                 * @uiLabel - ${this._("censusRecord3")}
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
                 * @uiLabel - ${this._("censusDate3")}
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
                 * @uiLabel - ${this._("infoOfViolation1")}
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
                 * @uiLabel - ${this._("dateOfViolation1")}
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
                 * @uiLabel - ${this._("infoOfViolation2")}
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
                 * @uiLabel - ${this._("dateOfViolation2")}
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
                 * @uiLabel - ${this._("infoOfViolation3")}
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
                 * @uiLabel - ${this._("dateOfViolation3")}
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
             * @uiLabel - ${this._("employeeNumber")}
             */
            EmployeeNumber?: string;
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._("cardNumber")}
             */
            CardNumber?: string;
             /**
             * @uiColumnGroup - row2
             * @uiLabel - ${this._("personType")}
             */
            PersonType?: ${toEnumInterface(
                  this.workGroupSelectItem as any,
                  false
                )};
            /**
             * @uiColumnGroup - row2
             * @uiLabel - ${this._("chineseName")}
             */
            LastName?: string;
            /**
             * @uiColumnGroup - row3
             * @uiLabel - ${this._("englishName")}
             */
            FirstName?: string;
            /**
             * @uiColumnGroup - row3
             * @uiLabel - ${this._("department")}
             */
            DepartmentName?:string;
            /**
             * @uiColumnGroup - row4
             * @uiLabel - ${this._("costCenter")}
             */
            CostCenterName?:string;
            /**
             * @uiColumnGroup - row4
             * @uiLabel - ${this._("workArea")}
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
  private submitClicked: boolean = false;
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
    // for (const key in params) {
    //   let value = params[key];
    //   if(!value)continue;
    //   let indexOfhash = value.indexOf('#');
    //   if(indexOfhash>-1)params[key]=value.substr(0, indexOfhash);
    // }
    this.getParams = params;
    this.submitClicked=true;
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
