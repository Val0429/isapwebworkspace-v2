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
import AccessLevel from './components/acs/AccessLevel.vue';
import Floor from './components/acs/Floor.vue';
import ElevatorGroup from './components/acs/ElevatorGroup.vue';
import AttendanceRecord from './components/acs/reports/AttendanceRecord.vue';
import EmployeeReport from './components/acs/reports/EmployeeReport.vue';
import DoorReport from './components/acs/reports/DoorReport.vue';
import DoorGroupReport from './components/acs/reports/DoorGroupReport.vue';
import ContractorReport from './components/acs/reports/ContractorReport.vue';
import DemographicReport from './components/acs/reports/DemographicReport.vue';
import CardExpirationReport from './components/acs/reports/CardExpirationReport.vue';
import VisitorCardReport from './components/acs/reports/VisitorCardReport.vue';

import User from './components/bar/User.vue';
import Site from './components/bar/Site.vue';
import Region from './components/bar/Region.vue';

// Demos
import DemoFETCardPrint from './Demos/DemoFETCardPrint.vue';
$({ path: '/demos/fet_card_print', name: 'FET ID Card Print', icon: 'fa-print', permission: false })(DemoFETCardPrint);

$({ path: '/', name: 'Home', redirect: '/member' })();
$({ path: '/elevator', name: "_('w_Elevator')", icon: 'fa-building' })(Elevator);
$({ path: '/floor', name: "_('w_Floor')", icon: 'fa-building' })(Floor);
    $({ path: '/door', name: "_('w_Door')", icon: 'fa-building' })(Door);
    $({ path: '/permissiontable', name: "_('w_PermissionTable')", icon: 'fa-building' })(PermissionTable);
    $({ path: '/doorgroup', name: "_('w_DoorGroup')", icon: 'fa-building' })(DoorGroup);
    $({ path: '/timeschedule', name: "_('w_TimeSchedule')", icon: 'fa-building' })(TimeSchedule);    
    $({ path: '/elevatorgroup', name: "_('w_ElevatorGroup')", icon: 'fa-building' })(ElevatorGroup);
    $({ path: '/attendance', name: "_('w_AttendanceRecord')", icon: 'fa-building' })(AttendanceRecord);
    $({ path: '/employeereport', name: "_('w_EmployeeReport')", icon: 'fa-building' })(EmployeeReport);
    $({ path: '/doorreport', name: "_('w_DoorReport')", icon: 'fa-building' })(DoorReport);
    $({ path: '/doorgroupreport', name: "_('w_DoorGroupReport')", icon: 'fa-building' })(DoorGroupReport);
    $({ path: '/contractorreport', name: "_('w_ContractorReport')", icon: 'fa-building' })(ContractorReport);
    $({ path: '/demographicreport', name: "_('w_DemographicReport')", icon: 'fa-building' })(DemographicReport);
    $({ path: '/cardreport', name: "_('w_CardExpirationReport')", icon: 'fa-building' })(CardExpirationReport);
    $({ path: '/visitorreport', name: "_('w_VisitorCardReport')", icon: 'fa-building' })(VisitorCardReport);
    
// Users
$({ path: '/user', name: "_('w_Navigation_Users_User')", icon: 'fa-user' })(User);

// Sites
$({ path: '/site', name: "_('w_Navigation_Site')", icon: 'fa-check' })(Site);

// Regions
$({ path: '/region', name: "_('w_Navigation_Region')", icon: 'fa-check' })(Region);

$({ path: '/member', name: "_('w_Member')", icon: 'fa-user' })(Member);
$({ path: '/user', name: "_('w_User')", icon: 'fa-user' })(User);
$({ path: '/reader', name: "_('w_Reader')", icon: 'fa-building' })(Reader);
$({ path: '/syncreceiver', name: "_('w_SyncReceiver')", icon: 'fa-building' })(SyncReceiver);
$({ path: '/accesslevel', name: "_('w_AccessLevel')", icon: 'fa-building' })(AccessLevel);

$({ path: '/member', name: "_('w_Member')", icon: 'fa-user' })(Member);
$({ path: '/user', name: "_('w_User')", icon: 'fa-user' })(User);
$({ path: '/reader', name: "_('w_Reader')", icon: 'fa-building' })(Reader);
$({ path: '/syncreceiver', name: "_('w_SyncReceiver')", icon: 'fa-building' })(SyncReceiver);
$({ path: '/accesslevel', name: "_('w_AccessLevel')", icon: 'fa-building' })(AccessLevel);

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
