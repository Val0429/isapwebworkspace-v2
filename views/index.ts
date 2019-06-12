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

// Guest
import ForgotPassword from './ForgotPassword/ForgotPassword.vue';

// Users
import User from './Users/User.vue';
import UserGroup from './Users/UserGroup.vue';

// BusinessOperation
import CampaignSetting from './BusinessOperation/CampaignSetting.vue';
import SalesRecords from './BusinessOperation/SalesRecords.vue';
import GeneralOfficeHour from './BusinessOperation/GeneralOfficeHour.vue';

// Regions
import Region from './Regions/Region.vue';

// Sites
import Site from './Sites/Site.vue';

// Server
import CMSServer from './Server/CMSServer.vue';
import FRSServer from './Server/FRSServer.vue';
import HumanDetectionServer from './Server/HumanDetectionServer.vue';

// Setting
import MailServer from './Setting/MailServer.vue';
import SMS from './Setting/SMS.vue';
import Weather from './Setting/Weather.vue';
import Backup from './Setting/Backup.vue';
import Restore from './Setting/Restore.vue';
import License from './Setting/License.vue';
import Tag from './Setting/Tags.vue';

// MyProfile
import MyProfile from './MyProfile/MyProfile.vue';

// ============================================================= //

// Home
$({ path: '/', name: 'Home', redirect: '/region' })();

// Guest
$({ path: '/forgot_password', name: 'ForgotPassword', disableContainer: true, permission: false })(ForgotPassword);

// MyProfile
$({ path: '/my_profile', name: 'MyProfile', icon: 'fa-twitter' })(MyProfile);

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
// $({ path: '/components/modal', name: 'Modal', icon: 'fa-twitter' })(Modal);
// $({ path: '/components/utilities', name: 'Utilities', icon: 'fa-twitter' })(Utilities);
// $({ path: '/menu-style/1', name: '選單特殊1', icon: 'fa-twitter', permission: '/test' })(Test);

// Demo
$({ path: '/demos/region-tree-select', name: 'Demo_RegionTreeSelect', icon: 'fa-check', permission: false })(DemoRegionTreeSelect);
$({ path: '/demos/image-map', name: 'Demo_ImageMap', icon: 'fa-check', permission: false })(DemoImageMap);
$({ path: '/demos/roi', name: 'Demo_ROI', icon: 'fa-check', permission: false })(DemoROI);
$({ path: '/demos/dialog', name: 'Demo_Dialog', icon: 'fa-check', permission: false })(DemoDialog);

// Dashboard
$({ path: '/dashboards', name: 'Dashboards', icon: 'fa-question', redirect: '/login' })();

// Analysis
$({ path: '/analysises', name: 'Analysises', icon: 'fa-question', redirect: '/login' })();

// Report
$({ path: '/reports', name: 'Reports', icon: 'fa-question', redirect: '/login' })();

// Users
$({ path: '/users', name: 'Users', icon: 'fa-check', redirect: '/login' })();
$({ path: '/users/user', name: 'Users_User', icon: 'fa-check' })(User);
$({ path: '/users/user_group', name: 'Users_UserGroup', icon: 'fa-check' })(UserGroup);

// Business Operation
$({ path: '/business_operations', name: 'BusinessOperation', icon: 'fa-close', redirect: '/business_operations/campaign_setting' })();
$({ path: '/business_operations/campaign_setting', name: 'BO_CampaignSetting', icon: 'fa-check' })(CampaignSetting);
$({ path: '/business_operations/sales_records', name: 'BO_SalesRecords', icon: 'fa-close' })(SalesRecords);
$({ path: '/business_operations/general_office_hour', name: 'BO_GeneralOfficeHour', icon: 'fa-check' })(GeneralOfficeHour);

// Sites
$({ path: '/site', name: 'Site', icon: 'fa-check' })(Site);

// Regions
$({ path: '/region', name: 'Region', icon: 'fa-check' })(Region);

// Video Source (c)
$({ path: '/video_sources', name: 'VideoSources', icon: 'fa-bug', redirect: '/login' })();
$({ path: '/video_sources/people_counting', name: 'VideoSources_PeopleCounting', icon: 'fa-close', redirect: '/login' })();
$({ path: '/video_sources/demographic', name: 'VideoSources_Demographic', icon: 'fa-close', redirect: '/login' })();
$({ path: '/video_sources/heatmap', name: 'VideoSources_Heatmap', icon: 'fa-close', redirect: '/login' })();
$({ path: '/video_sources/face_recognition', name: 'VideoSources_FaceRecognition', icon: 'fa-close', redirect: '/login' })();
$({ path: '/video_sources/cms', name: 'VideoSources_CMS', icon: 'fa-close', redirect: '/login' })();
$({ path: '/video_sources/vip', name: 'VideoSources_VIP', icon: 'fa-close', redirect: '/login' })();

// Rules and Action (?)
$({ path: '/rules_actions', name: 'RulesActions', icon: 'fa-question', redirect: '/login' })();

// Setting
$({ path: '/setting', name: 'Setting', icon: 'fa-close', redirect: '/setting/mail_server' })();
$({ path: '/setting/mail_server', name: 'Setting_MailServer', icon: 'fa-check' })(MailServer);
$({ path: '/setting/sms', name: 'Setting_SMS', icon: 'fa-check' })(SMS);
$({ path: '/setting/weather', name: 'Setting_Weather', icon: 'fa-check' })(Weather);
$({ path: '/setting/backup', name: 'Setting_Backup', icon: 'fa-question' })(Backup);
$({ path: '/setting/restore', name: 'Setting_Restore', icon: 'fa-question' })(Restore);
$({ path: '/setting/license', name: 'Setting_License', icon: 'fa-check' })(License);
$({ path: '/setting/tag', name: 'Setting_Tag', icon: 'fa-check' })(Tag);

// Server
$({ path: '/server', name: 'Server', icon: 'fa-close', redirect: '/server/cms_server' })();
$({ path: '/server/cms_server', name: 'Server_CMSServer', icon: 'fa-check' })(CMSServer);
$({ path: '/server/frs_manager_server', name: 'Server_FRSManagerServer', icon: 'fa-close', redirect: '/login' })();
$({ path: '/server/frs_server', name: 'Server_FRSServer', icon: 'fa-check' })(FRSServer);
$({ path: '/server/hd_server', name: 'Server_HDServer', icon: 'fa-check' })(HumanDetectionServer);
