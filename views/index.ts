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

// Demo
import DemoRegionTreeSelect from './Demos/DemoRegionTreeSelect.vue';
import DemoImageMap from './Demos/DemoImageMap.vue';
import DemoROI from './Demos/DemoROI.vue';
import DemoDialog from './Demos/DemoDialog.vue';
import DemoSortSelect from './Demos/DemoSortSelect.vue';

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
import DemographicServer from './Server/DemographicServer.vue';
import HumanDetectionServer from './Server/HumanDetectionServer.vue';

// Video Source
import PeopleCounting from './VideoSource/PeopleCounting.vue';
import Demographic from './VideoSource/Demographic.vue';
import DwellTime from './VideoSource/DwellTime.vue';
import FaceRecognition from './VideoSource/FaceRecognition.vue';
import Heatmap from './VideoSource/Heatmap.vue';
import HumanDetection from './VideoSource/HumanDetection.vue';
import CMS from './VideoSource/CMS.vue';
import VIP from './VideoSource/VIP.vue';
import VIP_Stranger_Visitor from './VideoSource/VIP_Stranger_Visitor.vue';

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

// Report
import ReportTemplate from './Report/ReportTemplate.vue';

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
$({ path: '/demos', name: 'Demo', icon: 'fa-check', redirect: '/demos/region-tree-select' })();
$({ path: '/demos/region-tree-select', name: 'Region Tree Select', icon: 'fa-check', permission: false })(DemoRegionTreeSelect);
$({ path: '/demos/image-map', name: 'ImageMap', icon: 'fa-check', permission: false })(DemoImageMap);
$({ path: '/demos/roi', name: 'ROI', icon: 'fa-check', permission: false })(DemoROI);
$({ path: '/demos/dialog', name: 'Dialog', icon: 'fa-check', permission: false })(DemoDialog);
$({ path: '/demos/sort_select', name: 'Sort Select', icon: 'fa-check', permission: false })(DemoSortSelect);

// Dashboard
$({ path: '/dashboards', name: "_('w_Navigation_Dashboards')", icon: 'fa-question', redirect: '/login' })();

// Analysis
$({ path: '/analysises', name: "_('w_Navigation_Analysises')", icon: 'fa-question', redirect: '/login' })();

// Report
$({ path: '/reports', name: "_('w_Navigation_Reports')", icon: 'fa-close', redirect: '/reports/report_template' })();
$({ path: '/reports/report_template', name: "_('w_Navigation_Report_ReportTemplate')", icon: 'fa-close' })(ReportTemplate);
$({ path: '/reports/traffic', name: "_('w_Navigation_Report_Traffic')", icon: 'fa-close' })();
$({ path: '/reports/dwell_time', name: "_('w_Navigation_Report_DwellTime')", icon: 'fa-close' })();
$({ path: '/reports/demographic', name: "_('w_Navigation_Report_Demographic')", icon: 'fa-close' })();
$({ path: '/reports/heatmap', name: "_('w_Navigation_Report_Heatmap')", icon: 'fa-close' })();
$({ path: '/reports/occupancy', name: "_('w_Navigation_Report_Occupancy')", icon: 'fa-close' })();
$({ path: '/reports/vip_black_list', name: "_('w_Navigation_Report_VIPBlackList')", icon: 'fa-close' })();
$({ path: '/reports/report_visitor', name: "_('w_Navigation_Report_RepeatVisitor')", icon: 'fa-close' })();
$({ path: '/reports/campaign', name: "_('w_Navigation_Report_Campaign')", icon: 'fa-close' })();

// Users
$({ path: '/users', name: "_('w_Navigation_Users')", icon: 'fa-check', redirect: '/users/user' })();
$({ path: '/users/user', name: "_('w_Navigation_Users_User')", icon: 'fa-check' })(User);
$({ path: '/users/user_group', name: "_('w_Navigation_Users_UserGroup')", icon: 'fa-check' })(UserGroup);

// Sites
$({ path: '/site', name: "_('w_Navigation_Site')", icon: 'fa-check' })(Site);

// Regions
$({ path: '/region', name: "_('w_Navigation_Region')", icon: 'fa-check' })(Region);

// Video Source (c)
$({ path: '/video_sources', name: 'VideoSources', icon: 'fa-close', redirect: '/login' })();
$({ path: '/video_sources/people_counting', name: 'VideoSources_PeopleCounting', icon: 'fa-check' })(PeopleCounting);
$({ path: '/video_sources/demographic', name: 'VideoSources_Demographic', icon: 'fa-check' })(Demographic);
$({ path: '/video_sources/human_detection', name: 'VideoSources_HumanDetection', icon: 'fa-check' })(HumanDetection);
$({ path: '/video_sources/heatmap', name: 'VideoSources_Heatmap', icon: 'fa-check' })(Heatmap);
$({ path: '/video_sources/face_recognition', name: 'VideoSources_FaceRecognition', icon: 'fa-close', redirect: '/login' })(FaceRecognition);
$({ path: '/video_sources/cms', name: 'VideoSources_CMS', icon: 'fa-close', redirect: '/login' })(CMS);
$({ path: '/video_sources/vip', name: 'VideoSources_VIP', icon: 'fa-close', redirect: '/login' })(VIP);
$({ path: '/video_sources/dwell_time', name: 'VideoSources_DwellTime', icon: 'fa-check' })(DwellTime);
$({ path: '/video_sources/vip_stranger_visitor', name: 'VideoSources_VIP_Stranger_Visitor', icon: 'fa-check' })(VIP_Stranger_Visitor);

// Rules and Action (?)
$({ path: '/rules_actions', name: "_('w_Navigation_RulesActions')", icon: 'fa-question', redirect: '/login' })();

// Business Operation
$({ path: '/business_operations', name: "_('w_Navigation_BusinessOperation')", icon: 'fa-bug', redirect: '/business_operations/campaign_setting' })();
$({ path: '/business_operations/campaign_setting', name: "_('w_Navigation_BO_CampaignSetting')", icon: 'fa-check' })(CampaignSetting);
$({ path: '/business_operations/sales_records', name: "_('w_Navigation_BO_SalesRecords')", icon: 'fa-close' })(SalesRecords);
$({ path: '/business_operations/general_office_hour', name: "_('w_Navigation_BO_GeneralOfficeHour')", icon: 'fa-check' })(GeneralOfficeHour);

// Setting
$({ path: '/setting', name: "_('w_Navigation_Setting')", icon: 'fa-bug', redirect: '/setting/mail_server' })();
$({ path: '/setting/mail_server', name: "_('w_Navigation_Setting_MailServer')", icon: 'fa-check' })(MailServer);
$({ path: '/setting/sms', name: "_('w_Navigation_Setting_SMS')", icon: 'fa-check' })(SMS);
$({ path: '/setting/weather', name: "_('w_Navigation_Setting_Weather')", icon: 'fa-check' })(Weather);
$({ path: '/setting/backup', name: "_('w_Navigation_Setting_Backup')", icon: 'fa-question' })(Backup);
$({ path: '/setting/restore', name: "_('w_Navigation_Setting_Restore')", icon: 'fa-question' })(Restore);
$({ path: '/setting/license', name: "_('w_Navigation_Setting_License')", icon: 'fa-check' })(License);
$({ path: '/setting/tag', name: "_('w_Navigation_Setting_Tag')", icon: 'fa-check' })(Tag);

// Server
$({ path: '/server', name: "_('w_Navigation_Server')", icon: 'fa-bug', redirect: '/server/cms_server' })();
$({ path: '/server/cms_server', name: "_('w_Navigation_Server_CMSServer')", icon: 'fa-check' })(CMSServer);
$({ path: '/server/frs_manager_server', name: "_('w_Navigation_Server_FRSManagerServer')", icon: 'fa-close', redirect: '/login' })();
$({ path: '/server/frs_server', name: "_('w_Navigation_Server_FRSServer')", icon: 'fa-check' })(FRSServer);
$({ path: '/server/demographic_server', name: "_('w_Navigation_Server_DemographicServer')", icon: 'fa-check' })(DemographicServer);
$({ path: '/server/hd_server', name: "_('w_Navigation_Server_HDServer')", icon: 'fa-check' })(HumanDetectionServer);
