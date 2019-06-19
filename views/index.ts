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
import User from './components/acs/User.vue';
import Door from './components/acs/Door.vue';
import Elevator from './components/acs/Elevator.vue';
import TimeSchedule from './components/acs/TimeSchedule.vue';
import DoorGroup from './components/acs/DoorGroup.vue';
import PermissionTable from './components/acs/PermissionTable.vue';
import Reader from './components/acs/Reader.vue';
import SyncReceiver from './components/acs/SyncReceiver.vue';
import AccessLevel from './components/acs/AccessLevel.vue';

$({ path: '/', name: "Home", redirect: '/member' })();
$({ path: '/elevator', name: "_('w_Elevator')", icon: 'fa-building' })(Elevator);
    $({ path: '/door', name: "_('w_Door')", icon: 'fa-building' })(Door);
    $({ path: '/permissiontable', name: "_('w_PermissionTable')", icon: 'fa-building' })(PermissionTable);
    $({ path: '/doorgroup', name: "_('w_DoorGroup')", icon: 'fa-building' })(DoorGroup);
    $({ path: '/timeschedule', name: "_('w_TimeSchedule')", icon: 'fa-building' })(TimeSchedule);
    $({ path: '/member', name: "_('w_Member')", icon: 'fa-user' })(Member);
    $({ path: '/user', name: "_('w_User')", icon: 'fa-user' })(User);
    $({ path: '/reader', name: "_('w_Reader')", icon: 'fa-building' })(Reader);
    $({ path: '/syncreceiver', name: "_('w_SyncReceiver')", icon: 'fa-building' })(SyncReceiver);
    $({ path: '/accesslevel', name: "_('w_AccessLevel')", icon: 'fa-building' })(AccessLevel);

    $({ path: '/components', name: "Components", icon: 'isap-icon-add' })(Components);
    
        $({ path: '/components/forms', name: "Forms", icon: 'fa-facebook', permission: '/announcements' })(Forms);
        $({ path: '/components/step-progress', name: "Step Progress", icon: 'fa-twitter' })(StepProgress);
        $({ path: '/components/tab', name: "Tab", icon: 'fa-twitter' })(Tab);
        $({ path: '/components/toolbox', name: "Toolbox", icon: 'fa-twitter' })(Toolbox);
        $({ path: '/components/cards', name: "Cards", icon: 'fa-twitter' })(Cards);
        $({ path: '/components/cards/auto', name: "Auto Cards", icon: 'fa-twitter' })(AutoCards);
        $({ path: '/components/table', name: "Table", icon: 'fa-twitter' })(Table);
        $({ path: '/components/tree', name: "Tree", icon: 'fa-twitter' })(Tree);
        $({ path: '/components/transition', name: "Transition", icon: 'fa-twitter' })(Transition);
        $({ path: '/components/modal', name: "Modal", icon: 'fa-twitter' })(Modal);
        $({ path: '/components/utilities', name: "Utilities", icon: 'fa-twitter' })(Utilities);

    $({ path: '/menu-style/1', name: "選單特殊1", icon: 'fa-twitter', permission: '/test' })(Test);
