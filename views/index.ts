import { RegisterRouter as $ } from '@/../core';

// Dashboard
import Dashboard from './Dashboard/Dashboard.vue';

// Invitation
import Invitation from './Invitation/Invitation.vue';

// General Settings
import GeneralSettings from './GeneralSettings/GeneralSettings.vue';

///////////////////////////////////////////////////////////////////

// Home
$({ path: '/', name: 'Home', redirect: '/dashboard' })();

$({ path: '/dashboard', name: "_('w_Navigation_Dashboard')", icon: 'fa-code', permission: false })(Dashboard);

$({ path: '/invitation', name: "_('w_Navigation_Invitation')", icon: 'fa-code', permission: false })(Invitation);

$({ path: '/settings', name: "_('w_Navigation_GeneralSettings')", icon: 'fa-code', permission: false })(GeneralSettings);
