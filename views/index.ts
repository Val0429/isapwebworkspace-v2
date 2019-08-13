import { RegisterRouter as $ } from '@/../core';

// Dashboard
import Dashboard from './Dashboard/Dashboard.vue';

// Invitation
import Invitation from './Invitation/Invitation.vue';

// ContractorRegistration
import ContractorRegistration from './ContractorRegistration/ContractorRegistration.vue';

// General Settings
import GeneralSettings from './GeneralSettings/GeneralSettings.vue';

///////////////////////////////////////////////////////////////////

// Home
$({ path: '/', name: 'Home', redirect: '/dashboard' })();

$({ path: '/dashboard', name: "_('w_Navigation_Dashboard')", icon: 'fa-check' })(Dashboard);

$({ path: '/invitation', name: "_('w_Navigation_Invitation')", icon: 'fa-code' })(Invitation);

$({ path: '/settings', name: "_('w_Navigation_GeneralSettings')", icon: 'fa-check' })(GeneralSettings);

$({ path: '/contractorRegistration', name: "_('w_Navigation_ContractorRegistration')", icon: 'fa-code', disableContainer: true, permission: false })(ContractorRegistration);
