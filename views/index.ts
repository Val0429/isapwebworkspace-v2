import { RegisterRouter as $ } from '@/../core';

// // components
// import Components from './components/index.vue';
// import Forms from './components/Forms.vue';
// import StepProgress from './components/StepProgress.vue';
// import Tab from './components/Tab.vue';
// import Toolbox from './components/Toolbox.vue';
// import Cards from './components/Cards.vue';
// import AutoCards from './components/AutoCards.vue';
// import Table from './components/Table.vue';
// import Tree from './components/Tree.vue';
// import Transition from './components/Transition.vue';
// import Modal from './components/Modal.vue';
// import Utilities from './components/Utilities.vue';
// import Test from './components/Utilities.vue';

// // Demo
// import DemoDialog from './Demos/DemoDialog.vue';
// import DemoFilterConditionComponent from './Demos/DemoFilterConditionComponent.vue';
// import DemoImageMap from './Demos/DemoImageMap.vue';
// import DemoLoading from './Demos/DemoLoading.vue';
// import DemoRegionTreeSelect from './Demos/DemoRegionTreeSelect.vue';
// import DemoROI from './Demos/DemoROI.vue';
// import DemoSortSelect from './Demos/DemoSortSelect.vue';
// import DemoEncrypt from './Demos/DemoEncrypt.vue';

// Guest
import ForgotPassword from './Guest/ForgotPassword.vue';
import Verify from './Guest/Verify.vue';

// MyProfile
import MyProfile from './MyProfile/MyProfile.vue';

// Dashboard

// Analysis

// Report
import ReportTemplate from './Report/ReportTemplate.vue';
import ReportTraffic from './Report/ReportTraffic.vue';
import ReportDwellTime from './Report/ReportDwellTime.vue';
import ReportDemographic from './Report/ReportDemographic.vue';
import ReportHeatmap from './Report/ReportHeatmap.vue';
import ReportOccupancy from './Report/ReportOccupancy.vue';
import ReportRepeatVisitor from './Report/ReportRepeatVisitor.vue';
import ReportVIPTracking from './Report/ReportVIPTracking.vue';
import ReportCampaign from './Report/ReportCampaign.vue';

// Users
import User from './Users/User.vue';
import UserGroup from './Users/UserGroup.vue';

// Sites
import Site from './Sites/Site.vue';

// Regions
import Region from './Regions/Region.vue';

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

// Rule Engine
import RuleEngineTraffic from './RuleEngine/RuleEngineTraffic.vue';
import RuleEngineDemographic from './RuleEngine/RuleEngineDemographic.vue';
import RuleEngineHeatmap from './RuleEngine/RuleEngineHeatmap.vue';
import RuleEngineRepeatVisitor from './RuleEngine/RuleEnigneRepeatVisitor.vue';

// BusinessOperation
import CampaignSetting from './BusinessOperation/CampaignSetting.vue';
import SalesRecords from './BusinessOperation/SalesRecords.vue';
import GeneralOfficeHour from './BusinessOperation/GeneralOfficeHour.vue';

// Setting
import MailServer from './Setting/MailServer.vue';
import SMS from './Setting/SMS.vue';
import Weather from './Setting/Weather.vue';
// import Backup from './Setting/Backup.vue';
// import Restore from './Setting/Restore.vue';
import License from './Setting/License.vue';
import Tag from './Setting/Tags.vue';

// ============================================================= //

// Home
$({ path: '/', name: 'Home', redirect: '/region' })();

// Guest
$({ path: '/forgot_password', name: 'ForgotPassword', disableContainer: true, permission: false })(ForgotPassword);
$({ path: '/verify', name: 'Verify', disableContainer: true, permission: false })(Verify);

// MyProfile
$({ path: '/my_profile', name: 'MyProfile', icon: 'fa-twitter' })(MyProfile);

// // Components
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

// // Demo
// $({ path: '/demos', name: 'Demo', redirect: '/demos/region-tree-select' })();
// $({ path: '/demos/dialog', name: 'Dialog', permission: false })(DemoDialog);
// $({ path: '/demos/report_filter_condition_component', name: 'Filter Condition Component' })(DemoFilterConditionComponent);
// $({ path: '/demos/image-map', name: 'ImageMap', permission: false })(DemoImageMap);
// $({ path: '/demos/loading', name: 'Loading', permission: false })(DemoLoading);
// $({ path: '/demos/region-tree-select', name: 'Region Tree Select', permission: false })(DemoRegionTreeSelect);
// $({ path: '/demos/roi', name: 'ROI', permission: false })(DemoROI);
// $({ path: '/demos/sort_select', name: 'Sort Select', permission: false })(DemoSortSelect);
// $({ path: '/demos/encrypt', name: 'SHA', permission: false })(DemoEncrypt);

// // Dashboard
// $({ path: '/dashboards', name: "_('w_Navigation_Dashboards')", icon: 'fa-question', redirect: '/login' })();

// // Analysis
// $({ path: '/analysises', name: "_('w_Navigation_Analysises')", icon: 'fa-question', redirect: '/login' })();

// Report
$({ path: '/reports', name: "_('w_Navigation_Reports')", icon: 'fa-code', redirect: '/reports/report_template' })();
$({ path: '/reports/traffic', name: "_('w_Navigation_Report_Traffic')", icon: 'fa-check' })(ReportTraffic);
$({ path: '/reports/dwell_time', name: "_('w_Navigation_Report_DwellTime')", icon: 'fa-code' })(ReportDwellTime);
$({ path: '/reports/demographic', name: "_('w_Navigation_Report_Demographic')", icon: 'fa-code' })(ReportDemographic);
$({ path: '/reports/heatmap', name: "_('w_Navigation_Report_Heatmap')", icon: 'fa-code' })(ReportHeatmap);
$({ path: '/reports/occupancy', name: "_('w_Navigation_Report_Occupancy')", icon: 'fa-check' })(ReportOccupancy);
$({ path: '/reports/vip_black_list', name: "_('w_Navigation_Report_VIPBlackList')", icon: 'fa-code' })(ReportVIPTracking);
$({ path: '/reports/repeat_visitor', name: "_('w_Navigation_Report_RepeatVisitor')", icon: 'fa-check' })(ReportRepeatVisitor);
$({ path: '/reports/campaign', name: "_('w_Navigation_Report_Campaign')", icon: 'fa-check' })(ReportCampaign);
$({ path: '/reports/report_template', name: "_('w_Navigation_Report_ReportTemplate')", icon: 'fa-check' })(ReportTemplate);

// Users
$({ path: '/users', name: "_('w_Navigation_Users')", redirect: '/users/user' })();
$({ path: '/users/user', name: "_('w_Navigation_Users_User')" })(User);
$({ path: '/users/user_group', name: "_('w_Navigation_Users_UserGroup')" })(UserGroup);

// Sites
$({ path: '/site', name: "_('w_Navigation_Site')" })(Site);

// Regions
$({ path: '/region', name: "_('w_Navigation_Region')" })(Region);

// Server
$({ path: '/server', name: "_('w_Navigation_Server')", icon: 'fa-code', redirect: '/server/cms_server' })();
$({ path: '/server/cms_server', name: "_('w_Navigation_Server_CMSServer')", icon: 'fa-check' })(CMSServer);
$({ path: '/server/frs_manager_server', name: "_('w_Navigation_Server_FRSManagerServer')", icon: 'fa-question', redirect: '/login' })();
$({ path: '/server/frs_server', name: "_('w_Navigation_Server_FRSServer')", icon: 'fa-check' })(FRSServer);
$({ path: '/server/demographic_server', name: "_('w_Navigation_Server_DemographicServer')", icon: 'fa-check' })(DemographicServer);
$({ path: '/server/hd_server', name: "_('w_Navigation_Server_HDServer')", icon: 'fa-check' })(HumanDetectionServer);

// Video Source (c)
$({ path: '/video_sources', name: "_('w_Navigation_VideoSources')", icon: 'fa-code', redirect: '/login' })();
$({ path: '/video_sources/people_counting', name: "_('w_Navigation_VideoSources_PeopleCounting')", icon: 'fa-check' })(PeopleCounting);
$({ path: '/video_sources/demographic', name: "_('w_Navigation_VideoSources_Demographic')", icon: 'fa-check' })(Demographic);
$({ path: '/video_sources/dwell_time', name: "_('w_Navigation_VideoSources_DwellTime')", icon: 'fa-check' })(DwellTime);
$({ path: '/video_sources/human_detection', name: "_('w_Navigation_VideoSources_HumanDetection')", icon: 'fa-check' })(HumanDetection);
$({ path: '/video_sources/heatmap', name: "_('w_Navigation_VideoSources_Heatmap')", icon: 'fa-check' })(Heatmap);
$({ path: '/video_sources/face_recognition', name: "_('w_Navigation_VideoSources_FaceRecognition')", icon: 'fa-code' })(FaceRecognition);

// Rule Engine
$({ path: '/rule_engine', name: "_('w_Navigation_RuleEngine')", icon: 'fa-code', redirect: '/rule_engine/traffic' })();
$({ path: '/rule_engine/traffic', name: "_('w_Navigation_RuleEngine')", icon: 'fa-code' })(RuleEngineTraffic);
$({ path: '/rule_engine/demographic', name: "_('w_Navigation_RuleEngine')", icon: 'fa-code' })(RuleEngineDemographic);
$({ path: '/rule_engine/heatmap', name: "_('w_Navigation_RuleEngine')", icon: 'fa-code' })(RuleEngineHeatmap);
$({ path: '/rule_engine/repeat_visitor', name: "_('w_Navigation_RuleEngine')", icon: 'fa-code' })(RuleEngineRepeatVisitor);

// Business Operation
$({ path: '/business_operations', name: "_('w_Navigation_BusinessOperation')", redirect: '/business_operations/campaign_setting' })();
$({ path: '/business_operations/campaign_setting', name: "_('w_Navigation_BO_CampaignSetting')", icon: 'fa-check' })(CampaignSetting);
$({ path: '/business_operations/sales_records', name: "_('w_Navigation_BO_SalesRecords')", icon: 'fa-check' })(SalesRecords);
$({ path: '/business_operations/general_office_hour', name: "_('w_Navigation_BO_GeneralOfficeHour')", icon: 'fa-check' })(GeneralOfficeHour);

// Setting
$({ path: '/setting', name: "_('w_Navigation_Setting')", icon: 'fa-code', redirect: '/setting/mail_server' })();
$({ path: '/setting/mail_server', name: "_('w_Navigation_Setting_MailServer')", icon: 'fa-check' })(MailServer);
$({ path: '/setting/sms', name: "_('w_Navigation_Setting_SMS')", icon: 'fa-check' })(SMS);
$({ path: '/setting/weather', name: "_('w_Navigation_Setting_Weather')", icon: 'fa-check' })(Weather);
// $({ path: '/setting/backup', name: "_('w_Navigation_Setting_Backup')", icon: 'fa-question' })(Backup);
// $({ path: '/setting/restore', name: "_('w_Navigation_Setting_Restore')", icon: 'fa-question' })(Restore);
$({ path: '/setting/license', name: "_('w_Navigation_Setting_License')", icon: 'fa-check' })(License);
$({ path: '/setting/tag', name: "_('w_Navigation_Setting_Tag')", icon: 'fa-check' })(Tag);
