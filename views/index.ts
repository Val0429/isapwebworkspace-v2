import { RegisterRouter as $ } from '@/../core';
import packageJson from '@/package.json';

///////////////////////////////////////////////////////////////////

// Home
$({ path: '/', name: 'Home', redirect: '/login' })();

// Visitor Registration
import Potrait from './Registration/Potrait.vue';
$({ path: '/registration/potrait', name: "_('w_Navigation_Registration_Potrait')", icon: 'fa-code', disableContainer: true, permission: false })(Potrait);

// MyProfile
import Flow1MyProfile from './Flow1/MyProfile/MyProfile.vue';
import Flow2MyProfile from './Flow2/MyProfile/MyProfile.vue';
switch (packageJson.flow) {
    case '/flow2':
        $({ path: '/my_profile', name: "_('w_Navigation_MyProfile')", icon: 'fa-check' })(Flow2MyProfile);
        break;
    case '/flow1':
    default:
        $({ path: '/my_profile', name: "_('w_Navigation_MyProfile')", icon: 'fa-check' })(Flow1MyProfile);
        break;
}

// Reports

// Reports Flow1
import Flow1ReportsDashboard from './Flow1/Reports/ReportsDashboard.vue';
import Flow1ReportsInversigation from './Flow1/Reports/ReportsInversigation.vue';

// Reports Flow2
import Flow2ReportsDashboard from './Flow2/Reports/ReportsDashboard.vue';
import Flow2ReportsInversigation from './Flow2/Reports/ReportsInversigation.vue';

$({ path: '/reports', name: "_('w_Navigation_Reports')", icon: 'fa-cog', redirect: `/reports/dashboard${packageJson.flow}` })();
switch (packageJson.flow) {
    case '/flow2':
        $({ path: '/reports/dashboard', name: "_('w_Navigation_Reports_Dashboard')", icon: 'fa-tachometer' })(Flow2ReportsDashboard);
        $({ path: '/reports/investigation', name: "_('w_Navigation_Reports_Investigation')", icon: 'fa-eye' })(Flow2ReportsInversigation);
        break;
    case '/flow1':
    default:
        $({ path: '/reports/dashboard', name: "_('w_Navigation_Reports_Dashboard')", icon: 'fa-tachometer' })(Flow1ReportsDashboard);
        $({ path: '/reports/investigation', name: "_('w_Navigation_Reports_Investigation')", icon: 'fa-eye' })(Flow1ReportsInversigation);
        break;
}

// Setups
import SetupsEmail from './Setups/SetupsEmail.vue';
import SetupsFRS from './Setups/SetupsFRS.vue';
import SetupsLicense from './Setups/SetupsLicense.vue';
import SetupsSMS from './Setups/SetupsSMS.vue';
import SetupsSMSOnline from './Setups/SetupsSMSOnline.vue';

// Setups Flow1
import Flow1SetupsAccount from './Flow1/Setups/SetupsAccount.vue';
import Flow1SetupsPurposes from './Flow1/Setups/SetupsPurposes.vue';
import Flow1SetupsCompany from './Flow1/Setups/SetupsCompany.vue';
import Flow1SetupsFloor from './Flow1/Setups/SetupsFloor.vue';
import Flow1SetupsKiosk from './Flow1/Setups/SetupsKiosk.vue';
import Flow1SetupsVisitorCard from './Flow1/Setups/SetupsVisitorCard.vue';

// Setups Flow2
import Flow2SetupsAccount from './Flow2/Setups/SetupsAccount.vue';
import Flow2SetupsPurposes from './Flow2/Setups/SetupsPurposes.vue';
import Flow2SetupsBuilding from './Flow2/Setups/SetupsBuildines.vue';
import Flow2SetupsCompany from './Flow2/Setups/SetupsCompany.vue';
import Flow2SetupsFloor from './Flow2/Setups/SetupsFloor.vue';
import Flow2SetupsKiosk from './Flow2/Setups/SetupsKiosk.vue';
import Flow2SetupsOther from './Flow2/Setups/SetupsOther.vue';

$({ path: '/setups', name: "_('w_Navigation_Setups')", icon: 'fa-cog', redirect: `/setups/account${packageJson.flow}` })();

$({ path: '/setups/license', name: "_('w_Navigation_Setups_License')", icon: 'fa-certificate' })(SetupsLicense);
$({ path: '/setups/frs', name: "_('w_Navigation_Setups_FRS')", icon: 'fa-server' })(SetupsFRS);
$({ path: '/setups/email', name: "_('w_Navigation_Setups_Email')", icon: 'fa-inbox' })(SetupsEmail);
$({ path: '/setups/sms', name: "_('w_Navigation_Setups_SMS')", icon: 'fa-envelope' })(SetupsSMS);
$({ path: '/setups/sms_online', name: "_('w_Navigation_Setups_SMSOnline')", icon: 'fa-cloud' })(SetupsSMSOnline);

switch (packageJson.flow) {
    case '/flow2':
        $({ path: '/setups/account', name: "_('w_Navigation_Setups_Account')", icon: 'fa-user' })(Flow2SetupsAccount);
        $({ path: '/setups/purposes', name: "_('w_Navigation_Setups_Purposes')", icon: 'fa-tag' })(Flow2SetupsPurposes);
        $({ path: '/setups/buildings', name: "_('w_Navigation_Setups_Buildings')", icon: 'fa-tag' })(Flow2SetupsBuilding);
        $({ path: '/setups/floor', name: "_('w_Navigation_Setups_Floor')", icon: 'fa-building' })(Flow2SetupsFloor);
        $({ path: '/setups/company', name: "_('w_Navigation_Setups_Company')", icon: 'fa-industry' })(Flow2SetupsCompany);
        $({ path: '/setups/kiosk', name: "_('w_Navigation_Setups_Kiosk')", icon: 'fa-barcode' })(Flow2SetupsKiosk);
        $({ path: '/setups/other', name: "_('w_Navigation_Setups_Other')", icon: 'fa-industry' })(Flow2SetupsOther);
        break;
    case '/flow1':
    default:
        $({ path: '/setups/account', name: "_('w_Navigation_Setups_Account')", icon: 'fa-user' })(Flow1SetupsAccount);
        $({ path: '/setups/purposes', name: "_('w_Navigation_Setups_Purposes')", icon: 'fa-tag' })(Flow1SetupsPurposes);
        $({ path: '/setups/floor', name: "_('w_Navigation_Setups_Floor')", icon: 'fa-building' })(Flow1SetupsFloor);
        $({ path: '/setups/company', name: "_('w_Navigation_Setups_Company')", icon: 'fa-industry' })(Flow1SetupsCompany);
        $({ path: '/setups/kiosk', name: "_('w_Navigation_Setups_Kiosk')", icon: 'fa-barcode' })(Flow1SetupsKiosk);
        $({ path: '/setups/visitor_card', name: "_('w_Navigation_Setups_VisitorCard')", icon: 'fa-id-card' })(Flow1SetupsVisitorCard);
        break;
}

// Logs
import Flow2Logs from './Flow2/Logs/Logs.vue';
$({ path: '/logs', name: "_('w_Navigation_Logs')", icon: 'fa-user' })(Flow2Logs);

// Tenants
import Flow2TenantsInvitation from './Flow2/Tenants/TenantsInvitation.vue';
$({ path: '/tenants', name: "_('w_Navigation_Tenants')", icon: 'fa-users', redirect: '/tenants/invitation' })();
$({ path: '/tenants/invitation', name: "_('w_Navigation_Tenants_Invitation')", icon: 'fa-eye' })(Flow2TenantsInvitation);
