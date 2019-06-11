import { RegisterRouter as $ } from '@/../core';

import Components from './components/index.vue';
import Forms from './components/Forms.vue';
import StepProgress from './components/StepProgress.vue';
import Toolbox from './components/Toolbox.vue';
import Cards from './components/Cards.vue';
import AutoCards from './components/AutoCards.vue';
import Table from './components/Table.vue';
import Tree from './components/Tree.vue';
import Transition from './components/Transition.vue';
import Modal from './components/Modal.vue';
import Utilities from './components/Utilities.vue';
import Test from './components/Utilities.vue';

// Demo
import DemoRegionTreeSelect from './Demos/DemoRegionTreeSelect.vue';
import DemoImageMap from './Demos/DemoImageMap.vue';
import DemoROI from './Demos/DemoROI.vue';
import DemoDialog from './Demos/DemoDialog.vue';

// Users
import User from './Users/User.vue';
import UserGroup from './Users/UserGroup.vue';

// Regions
import Region from './Regions/Region.vue';

// ============================================================= //

// Home
$({ path: '/', name: 'Home', redirect: '/components' })();

// Components
// $({ path: '/components', name: 'Components', icon: 'isap-icon-add' })(Components);
// $({ path: '/components/forms', name: 'Forms', icon: 'fa-facebook', permission: '/announcements' })(Forms);
// $({ path: '/components/step-progress', name: 'Step Progress', icon: 'fa-twitter' })(StepProgress);
// $({ path: '/components/toolbox', name: 'Toolbox', icon: 'fa-twitter' })(Toolbox);
// $({ path: '/components/cards', name: 'Cards', icon: 'fa-twitter' })(Cards);
// $({ path: '/components/cards/auto', name: 'Auto Cards', icon: 'fa-twitter' })(AutoCards);
// $({ path: '/components/table', name: 'Table', icon: 'fa-twitter' })(Table);
// $({ path: '/components/tree', name: 'Tree', icon: 'fa-twitter' })(Tree);
// $({ path: '/components/transition', name: 'Transition', icon: 'fa-twitter' })(Transition);
$({ path: '/components/modal', name: 'Modal', icon: 'fa-twitter' })(Modal);
// $({ path: '/components/utilities', name: 'Utilities', icon: 'fa-twitter' })(Utilities);
// $({ path: '/menu-style/1', name: '選單特殊1', icon: 'fa-twitter', permission: '/test' })(Test);

// Demo
$({ path: '/demos/region-tree-select', name: 'DemoRegionTreeSelect', icon: 'fa-twitter', permission: false })(DemoRegionTreeSelect);
$({ path: '/demos/image-map', name: 'DemoImageMap', icon: 'fa-twitter', permission: false })(DemoImageMap);
$({ path: '/demos/roi', name: 'DemoROI', icon: 'fa-twitter', permission: false })(DemoROI);
$({ path: '/demos/dialog', name: 'DemoDialog', icon: 'fa-twitter', permission: false })(DemoDialog);

// Users
$({ path: '/users', name: 'Users', icon: 'fa-twitter' })(User);
$({ path: '/users/user', name: 'User', icon: 'fa-twitter' })(User);
$({ path: '/users/user_group', name: 'UserGroup', icon: 'fa-twitter' })(UserGroup);

// Regions
$({ path: '/region', name: 'Region', icon: 'fa-twitter' })(Region);
