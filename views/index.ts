import { RegisterRouter as $ } from '@/../core';

import Components from './components/index.vue';
import Forms from './components/Forms.vue';
import StepProgress from './components/StepProgress.vue';
import Tab from './components/Tab.vue';
import Toolbox from './components/Toolbox.vue';
import Cards from './components/Cards.vue';
import AutoCards from './components/AutoCards.vue';
import Table from './components/Table.vue';
import Tree from './components/Tree.vue';
import Transition from './components/Transition.vue';
import Modal from './components/Modal.vue';
import Utilities from './components/Utilities.vue';
import Test from './components/Utilities.vue';
import Member from './components/acs/Member.vue';

import Door from './components/acs/Door.vue';
import Elevator from './components/acs/Elevator.vue';
import TimeSchedule from './components/acs/TimeSchedule.vue';
import DoorGroup from './components/acs/DoorGroup.vue';
import PermissionTable from './components/acs/PermissionTable.vue';
import Reader from './components/acs/Reader.vue';
import SyncReceiver from './components/acs/SyncReceiver.vue';
import Floor from './components/acs/Floor.vue';
import FloorGroup from './components/acs/FloorGroup.vue';
import ElevatorGroup from './components/acs/ElevatorGroup.vue';
import AttendanceReport from './components/acs/reports/AttendanceReport.vue';
import EmployeeReport from './components/acs/reports/EmployeeReport.vue';
import DoorReport from './components/acs/reports/DoorReport.vue';
import DoorGroupReport from './components/acs/reports/DoorGroupReport.vue';
import ContractorReport from './components/acs/reports/ContractorReport.vue';
import DemographicReport from './components/acs/reports/DemographicReport.vue';
import CardExpirationReport from './components/acs/reports/CardExpirationReport.vue';
import VisitorCardReport from './components/acs/reports/VisitorCardReport.vue';
import Redirector from '@/../src/components/login/redirector.vue';
import User from './components/acs/User.vue';
import UserPermission from './components/acs/UserPermission.vue';
import License from './components/bar/License.vue';
import QueryPermission from './components/acs/QueryPermission.vue';
import SystemLog from './components/acs/SystemLog.vue';
import SystemSettings from './components/acs/SystemSettings.vue';
// Demos
import DemoFETCardPrint from './Demos/DemoFETCardPrint.vue';
$({ path: '/demos/fet_card_print', name: 'FET ID Card Print', icon: 'fa-print', permission: false })(DemoFETCardPrint);

$({ path: '/', name: 'Home', redirect: '/redirector' })();
$({ path: '/redirector', name: 'redirector' })(Redirector);

$({ path: '/operationLog', name: "_('w_SystemLog')"})(SystemLog);
$({ path: '/elevator', name: "_('w_Elevator')"})(Elevator);
$({ path: '/floor', name: "_('w_Floor')"})(Floor);
$({ path: '/floorgroup', name: "_('w_FloorGroup')"})(FloorGroup);
    $({ path: '/door', name: "_('w_Door')"})(Door);
    $({ path: '/permissiontable', name: "_('w_PermissionTable')"})(PermissionTable);
    $({ path: '/doorgroup', name: "_('w_DoorGroup')"  })(DoorGroup);
    $({ path: '/timeschedule', name: "_('w_TimeSchedule')"})(TimeSchedule);    
    $({ path: '/elevatorgroup', name: "_('w_ElevatorGroup')"})(ElevatorGroup);
    $({ path: '/attendance', name: "_('w_AttendanceReport')"})(AttendanceReport);
    $({ path: '/employeereport', name: "_('w_EmployeeReport')"})(EmployeeReport);
    $({ path: '/doorreport', name: "_('w_DoorReport')"})(DoorReport);
    $({ path: '/doorgroupreport', name: "_('w_DoorGroupReport')"})(DoorGroupReport);
    $({ path: '/contractorreport', name: "_('w_ContractorReport')"})(ContractorReport);
    $({ path: '/demographicreport', name: "_('w_DemographicReport')"})(DemographicReport);
    $({ path: '/cardreport', name: "_('w_CardExpirationReport')"})(CardExpirationReport);
    $({ path: '/visitorreport', name: "_('w_VisitorCardReport')"})(VisitorCardReport);
    $({ path: '/license', name: "_('w_License')"})(License);
    $({ path: '/querypermission', name: "_('w_QueryPermission')"})(QueryPermission);
    $({ path: '/syssettings', name: "_('w_Settings')"})(SystemSettings);
    
// Users

$({ path: '/userpermission', name: "_('w_UserPermission')" })(UserPermission);
$({ path: '/user', name: "_('w_Navigation_Users_User')" })(User);

$({ path: '/member', name: "_('w_Member')" })(Member);
$({ path: '/user', name: "_('w_User')" })(User);
$({ path: '/reader', name: "_('w_Reader')"})(Reader);
$({ path: '/syncreceiver', name: "_('w_SyncReceiver')"})(SyncReceiver);

$({ path: '/member', name: "_('w_Member')" })(Member);
$({ path: '/user', name: "_('w_User')" })(User);
$({ path: '/reader', name: "_('w_Reader')"})(Reader);
$({ path: '/syncreceiver', name: "_('w_SyncReceiver')"})(SyncReceiver);
$({ path: '/components', name: 'Components', icon: 'isap-icon-add' })(Components);

$({ path: '/components/forms', name: 'Forms', icon: 'fa-facebook', permission: '/announcements' })(Forms);
$({ path: '/components/step-progress', name: 'Step Progress', icon: 'fa-twitter', permission: false })(StepProgress);
$({ path: '/components/tab', name: 'Tab', icon: 'fa-twitter', permission: false })(Tab);
$({ path: '/components/toolbox', name: 'Toolbox', icon: 'fa-twitter', permission: false })(Toolbox);
$({ path: '/components/cards', name: 'Cards', icon: 'fa-twitter', permission: false })(Cards);
$({ path: '/components/cards/auto', name: 'Auto Cards', icon: 'fa-twitter', permission: false })(AutoCards);
$({ path: '/components/table', name: 'Table', icon: 'fa-twitter', permission: false })(Table);
$({ path: '/components/tree', name: 'Tree', icon: 'fa-twitter', permission: false })(Tree);
$({ path: '/components/transition', name: 'Transition', icon: 'fa-twitter', permission: false })(Transition);
$({ path: '/components/modal', name: 'Modal', icon: 'fa-twitter', permission: false })(Modal);
$({ path: '/components/utilities', name: 'Utilities', icon: 'fa-twitter', permission: false })(Utilities);

$({ path: '/menu-style/1', name: '選單特殊1', icon: 'fa-twitter', permission: '/test' })(Test);
