import { RegisterRouter as $ } from '@/../core';

///////////////////////////////////////////////////////////////////

// Home
$({ path: '/', name: 'Home', redirect: '/login' })();

// Visitor Registration
import Potrait from './Registration/Potrait.vue';

$({ path: '/registration/potrait', name: "_('w_Navigation_Registration_Potrait')", icon: 'fa-code', disableContainer: true, permission: false })(Potrait);

// MyProfile
import MyProfile from './MyProfile/MyProfile.vue';

$({ path: '/my_profile', name: "_('w_Navigation_MyProfile')", icon: 'fa-check' })(MyProfile);

// Reports
import ReportsDashboard from './Reports/ReportsDashboard.vue';
import ReportsInversigation from './Reports/ReportsInversigation.vue';

$({ path: '/reports', name: "_('w_Navigation_Reports')", icon: 'fa-columns', redirect: '/reports/dashboard' })();
$({ path: '/reports/dashboard', name: "_('w_Navigation_Reports_Dashboard')", icon: 'fa-tachometer' })(ReportsDashboard);
$({ path: '/reports/investigation', name: "_('w_Navigation_Reports_Investigation')", icon: 'fa-eye' })(ReportsInversigation);

// Setups
import SetupsAccount from './Setups/SetupsAccount.vue';
import SetupsCompany from './Setups/SetupsCompany.vue';
import SetupsEmail from './Setups/SetupsEmail.vue';
import SetupsFloor from './Setups/SetupsFloor.vue';
import SetupsFRS from './Setups/SetupsFRS.vue';
import SetupsKiosk from './Setups/SetupsKiosk.vue';
import SetupsLicense from './Setups/SetupsLicense.vue';
import SetupsSMS from './Setups/SetupsSMS.vue';
import SetupsSMSOnline from './Setups/SetupsSMSOnline.vue';
import SetupsVisitorCard from './Setups/SetupsVisitorCard.vue';

$({ path: '/setups', name: "_('w_Navigation_Setups')", icon: 'fa-cog', redirect: '/setups/account' })();
$({ path: '/setups/floor', name: "_('w_Navigation_Setups_Floor')", icon: 'fa-building' })(SetupsFloor);
$({ path: '/setups/company', name: "_('w_Navigation_Setups_Company')", icon: 'fa-industry' })(SetupsCompany);
$({ path: '/setups/account', name: "_('w_Navigation_Setups_Account')", icon: 'fa-user' })(SetupsAccount);
$({ path: '/setups/kiosk', name: "_('w_Navigation_Setups_Kiosk')", icon: 'fa-barcode' })(SetupsKiosk);
$({ path: '/setups/license', name: "_('w_Navigation_Setups_License')", icon: 'fa-certificate' })(SetupsLicense);
$({ path: '/setups/frs', name: "_('w_Navigation_Setups_FRS')", icon: 'fa-server' })(SetupsFRS);
$({ path: '/setups/email', name: "_('w_Navigation_Setups_Email')", icon: 'fa-inbox' })(SetupsEmail);
$({ path: '/setups/sms', name: "_('w_Navigation_Setups_SMS')", icon: 'fa-envelope' })(SetupsSMS);
$({ path: '/setups/sms_online', name: "_('w_Navigation_Setups_SMSOnline')", icon: 'fa-cloud' })(SetupsSMSOnline);
$({ path: '/setups/visitor_card', name: "_('w_Navigation_Setups_VisitorCard')", icon: 'fa-id-card' })(SetupsVisitorCard);

// Tenants
import TenantsInvitation from './Tenants/TenantsInvitation.vue';
import TenantsVisitor from './Tenants/TenantsVisitor.vue';

$({ path: '/tenants', name: "_('w_Navigation_Tenants')", icon: 'fa-check', redirect: '/tenants/invitation' })();
$({ path: '/tenants/invitation', name: "_('w_Navigation_Tenants_Invitation')", icon: 'fa-check' })(TenantsInvitation);
$({ path: '/tenants/visitor', name: "_('w_Navigation_Tenants_Visitor')", icon: 'fa-check' })(TenantsVisitor);
