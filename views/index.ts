import { RegisterRouter as $ } from '@/../core';

// Home
$({ path: '/', name: 'Home', redirect: '/login' })();

// Login
import ForgotPassword from './Security/ForgotPassword.vue';
$({ path: '/forgot_password', name: "_('w_Login_ForgotPassword')", disableContainer: true, permission: false })(ForgotPassword);

// components
import MyProfile from './components/MyProfile.vue';
import Accounts from './components/Accounts.vue';
import SetupsBuilding from './components/SetupsBuildings.vue';
import SetupsFloor from './components/SetupsFloor.vue';
import SetupsDoor from './components/SetupsDoor.vue';
import SetupsCompany from './components/SetupsCompany.vue';
import PersonsPersonList from './Persons/PersonList.vue';
import PersonsBlackList from './Persons/BlackList.vue';
import IsapFrs from './components/IsapFrs.vue';
import HikVision from './components/HikVision.vue';
import SettingsSuntec from './Settings/SettingsSuntec.vue';
import SettingsAcs from './Settings/SettingsAcs.vue';
import SettingsSmtp from './Settings/SettingsSmtp.vue';
import SettingsVms from './Settings/SettingsVms.vue';
import SettingsFrs from './Settings/SettingsFrs.vue';
import SettingsEmail from './Settings/SettingsEmail.vue';
import SettingsLicense from './Settings/SettingsLicense.vue';

import ReportsInversigation from './components/ReportsInversigation.vue';
import Logs from './Logs/Logs.vue';

$({ path: '/my_profile', name: "_('m_Navigation_MyProfile')", icon: 'fa-user', permission: true })(MyProfile);
$({ path: '/accounts', name: "_('m_Navigation_Accounts')", icon: 'fa-id-badge', permission: true })(Accounts);
$({ path: '/buildings', name: "_('m_Navigation_Buildings')", icon: 'fa-building', permission: true })(SetupsBuilding);
$({ path: '/floor', name: "_('m_Navigation_Floor')", icon: 'fa-level-up', permission: true })(SetupsFloor);
$({ path: '/door', name: "_('m_Navigation_Door')", icon: 'fa-columns', permission: true })(SetupsDoor);
$({ path: '/company', name: "_('m_Navigation_Company')", icon: 'fa-industry', permission: true })(SetupsCompany);
$({ path: '/persons', name: "_('m_Navigation_Persons')", permission: true, redirect: '/persons/personlist' })();
$({ path: '/persons/personlist', name: "_('m_Navigation_Persons_PersonList')", icon: 'fa-user', permission: true })(PersonsPersonList);
$({ path: '/persons/blacklist', name: "_('m_Navigation_Persons_BlackList')", icon: 'fa-ban', permission: true })(PersonsBlackList);

$({ path: '/client', name: "_('m_Navigation_Server')", permission: true, redirect: '/client/frs' })();
$({ path: '/client/frs', name: "_('m_Navigation_Frs')", icon: 'fa-server', permission: true })(IsapFrs);
$({ path: '/client/hikvision', name: "_('m_Navigation_HikVision')", icon: 'fa-server', permission: true })(HikVision);

$({ path: '/settings', name: "_('m_Navigation_Settings')", permission: true, redirect: '/settings/email' })();
$({ path: '/settings/suntec_app', name: "_('m_Navigation_Settings_SuntecAppServer')", icon: 'fa-server', permission: true })(SettingsSuntec);
$({ path: '/settings/acs', name: "_('m_Navigation_Settings_AcsServer')", icon: 'fa-server', permission: true })(SettingsAcs);
$({ path: '/settings/smtp', name: "_('m_Navigation_Settings_SmtpServer')", icon: 'fa-server', permission: true })(SettingsSmtp);
$({ path: '/settings/vms', name: "_('m_Navigation_Settings_Vms')", icon: 'fa-server', permission: true })(SettingsVms);
$({ path: '/settings/frs', name: "_('m_Navigation_Settings_Frs')", icon: 'fa-server', permission: true })(SettingsFrs);
$({ path: '/settings/email', name: "_('m_Navigation_Settings_Email')", icon: 'fa-inbox', permission: true })(SettingsEmail);
$({ path: '/settings/license', name: "_('m_Navigation_Settings_License')", icon: 'fa-certificate', permission: true })(SettingsLicense);

$({ path: '/reports', name: "_('m_Navigation_Reports')", icon: 'fa-flag', permission: true })(ReportsInversigation);
$({ path: '/logs', name: "_('m_Navigation_Logs')", icon: 'fa-clipboard', permission: true })(Logs);
