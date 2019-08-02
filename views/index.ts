import { RegisterRouter as $ } from '@/../core';

// Dashboard
import Dashboard from './Dashboard/Dashboard.vue';

// Invitation
import Invitation from './Invitation/Invitation.vue';

// General Settings
import GeneralSettingsBackground from './GeneralSettings/GeneralSettingsBackground.vue';
import GeneralSettingsRemoveWorker from './GeneralSettings/GeneralSettingsRemoveWorker.vue';

///////////////////////////////////////////////////////////////////

// Home
$({ path: '/', name: 'Home', redirect: '/dashboard' })();

$({ path: '/dashboard', name: "_('w_Navigation_Dashboard')", icon: 'fa-code', permission: false })(Dashboard);

$({ path: '/invitation', name: "_('w_Navigation_Invitation')", icon: 'fa-code', permission: false })(Invitation);

$({ path: '/settings', name: "_('w_Navigation_GeneralSettings')", icon: 'fa-code', redirect: '/settings/background' })();
$({ path: '/settings/background', name: "_('w_Navigation_GeneralSettings_Background')", icon: 'fa-code', permission: false })(GeneralSettingsBackground);
$({ path: '/settings/remove_worker', name: "_('w_Navigation_GeneralSettings_RemoveWorker')", icon: 'fa-code', permission: false })(GeneralSettingsRemoveWorker);
