import { RegisterRouter as $ } from '@/../core';

// Home
$({ path: '/', name: 'Home', redirect: '/components' })();

// components
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

// components
$({ path: '/components', name: 'Components', icon: 'isap-icon-add' })(Components);
$({ path: '/components/forms', name: 'Forms', icon: 'fa-facebook', permission: '/announcements' })(Forms);
$({ path: '/components/step-progress', name: 'Step Progress', icon: 'fa-twitter' })(StepProgress);
$({ path: '/components/tab', name: 'Tab', icon: 'fa-twitter' })(Tab);
$({ path: '/components/toolbox', name: 'Toolbox', icon: 'fa-twitter' })(Toolbox);
$({ path: '/components/cards', name: 'Cards', icon: 'fa-twitter' })(Cards);
$({ path: '/components/cards/auto', name: 'Auto Cards', icon: 'fa-twitter' })(AutoCards);
$({ path: '/components/table', name: 'Table', icon: 'fa-twitter' })(Table);
$({ path: '/components/tree', name: 'Tree', icon: 'fa-twitter' })(Tree);
$({ path: '/components/transition', name: 'Transition', icon: 'fa-twitter' })(Transition);
$({ path: '/components/modal', name: 'Modal', icon: 'fa-twitter' })(Modal);
$({ path: '/components/utilities', name: 'Utilities', icon: 'fa-twitter' })(Utilities);
$({ path: '/menu-style/1', name: '選單特殊1', icon: 'fa-twitter', permission: '/test' })(Test);

// Demo
import DemoDialog from './Demos/DemoDialog.vue';
import DemoFilterConditionComponent from './Demos/DemoFilterConditionComponent.vue';
import DemoImageMap from './Demos/DemoImageMap.vue';
import DemoLoading from './Demos/DemoLoading.vue';
import DemoRegionTreeSelect from './Demos/DemoRegionTreeSelect.vue';
import DemoROI from './Demos/DemoROI.vue';
import DemoSortSelect from './Demos/DemoSortSelect.vue';
import DemoEncrypt from './Demos/DemoEncrypt.vue';
import DemoDatetimeServices from './Demos/DemoDatetimeServices.vue';

$({ path: '/demos', name: 'Demo', redirect: '/demos/region-tree-select' })();
$({ path: '/demos/dialog', name: 'Dialog', permission: false })(DemoDialog);
$({ path: '/demos/report_filter_condition_component', name: 'Filter Condition Component' })(DemoFilterConditionComponent);
$({ path: '/demos/image-map', name: 'ImageMap', permission: false })(DemoImageMap);
$({ path: '/demos/loading', name: 'Loading', permission: false })(DemoLoading);
$({ path: '/demos/region-tree-select', name: 'Region Tree Select', permission: false })(DemoRegionTreeSelect);
$({ path: '/demos/roi', name: 'ROI', permission: false })(DemoROI);
$({ path: '/demos/sort_select', name: 'Sort Select', permission: false })(DemoSortSelect);
$({ path: '/demos/encrypt', name: 'SHA', permission: false })(DemoEncrypt);
$({ path: '/demos/datetime', name: 'SHA', permission: false })(DemoDatetimeServices);
