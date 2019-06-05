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

$({ path: '/', name: "Home", redirect: '/components' })();

    $({ path: '/components', name: "Components", icon: 'isap-icon-add' })(Components);
        $({ path: '/components/forms', name: "Forms", icon: 'fa-facebook', permission: '/announcements' })(Forms);
        $({ path: '/components/step-progress', name: "Step Progress", icon: 'fa-twitter' })(StepProgress);
        $({ path: '/components/toolbox', name: "Toolbox", icon: 'fa-twitter' })(Toolbox);
        $({ path: '/components/cards', name: "Cards", icon: 'fa-twitter' })(Cards);
        $({ path: '/components/cards/auto', name: "Auto Cards", icon: 'fa-twitter' })(AutoCards);
        $({ path: '/components/table', name: "Table", icon: 'fa-twitter' })(Table);
        $({ path: '/components/tree', name: "Tree", icon: 'fa-twitter' })(Tree);
        $({ path: '/components/transition', name: "Transition", icon: 'fa-twitter' })(Transition);
        $({ path: '/components/modal', name: "Modal", icon: 'fa-twitter' })(Modal);
        $({ path: '/components/utilities', name: "Utilities", icon: 'fa-twitter' })(Utilities);

    $({ path: '/menu-style/1', name: "選單特殊1", icon: 'fa-twitter', permission: '/test' })(Test);
