import { RegisterRouter as $ } from '@/../core';

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

// Demos
import DragSelect from './Demos/DragSelect.vue';

///////////////////////////////////////////////////////////////////

// Home
$({ path: '/', name: 'Home', redirect: '/components' })();

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

// Demos
$({ path: '/demos', name: 'Demos', icon: 'fa-check', redirect: '/demos/drag_select' })();
$({ path: '/demos/drag_select', name: 'Drag Select', icon: 'fa-check', permission: false })(DragSelect);
