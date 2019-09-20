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
import Overview from './Dashboard/Overview.vue';
import Map from './Dashboard/Map.vue';

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

// Tools
import ToolTraffic from './Tools/ToolTraffic.vue';
import ToolRepeatVisitor from './Tools/ToolRepeatVisitor.vue';
import ToolDemographic from './Tools/ToolDemographic.vue';
import ToolOccupancy from './Tools/ToolOccupancy.vue';
import ToolDwellTime from './Tools/ToolDwellTime.vue';

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
import FRSManager from './Server/FRSManager.vue';

// Video Source
import PeopleCounting from './VideoSource/PeopleCounting.vue';
import Demographic from './VideoSource/Demographic.vue';
import DwellTime from './VideoSource/DwellTime.vue';
import FaceRecognition from './VideoSource/FaceRecognition.vue';
import Heatmap from './VideoSource/Heatmap.vue';
import HumanDetection from './VideoSource/HumanDetection.vue';

// Rule and Actions
import RuleAndActionsTraffic from './RuleAndActions/RuleAndActionsTraffic.vue';
import RuleAndActionsOccupancy from './RuleAndActions/RuleAndActionsOccupancy.vue';
import RuleAndActionsVipBlacklist from './RuleAndActions/RuleAndActionsVipBlacklist.vue';
import RuleAndActionsRepeatVisitor from './RuleAndActions/RuleAndActionsRepeatVisitor.vue';

// BusinessOperation
import CampaignSetting from './BusinessOperation/CampaignSetting.vue';
import SalesRecords from './BusinessOperation/SalesRecords.vue';
import GeneralOfficeHour from './BusinessOperation/GeneralOfficeHour.vue';

// Setting
import MailServer from './Setting/MailServer.vue';
import SMS from './Setting/SMS.vue';
import Weather from './Setting/Weather.vue';
import System from './Setting/System.vue';
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
$({ path: '/dashboards', name: "_('w_Navigation_Dashboards')", icon: 'fa-code', redirect: '/dashboards/overview' })();
$({ path: '/dashboards/overview', name: "_('w_DashboardOverview_Overview')", icon: 'fa-code' })(Overview);
$({ path: '/dashboards/map', name: "_('w_DashboardMap_Map')", icon: 'fa-code' })(Map);

// // Analysis
// $({ path: '/analysises', name: "_('w_Navigation_Analysises')", icon: 'fa-question', redirect: '/login' })();

// Report
$({ path: '/reports', name: "_('w_Navigation_Reports')", icon: 'fa-code', redirect: '/reports/report_template' })();
$({ path: '/reports/traffic', name: "_('w_Navigation_Report_Traffic')", icon: 'fa-check' })(ReportTraffic);
$({ path: '/reports/dwell_time', name: "_('w_Navigation_Report_DwellTime')", icon: 'fa-check' })(ReportDwellTime);
$({ path: '/reports/demographic', name: "_('w_Navigation_Report_Demographic')", icon: 'fa-check' })(ReportDemographic);
$({ path: '/reports/heatmap', name: "_('w_Navigation_Report_Heatmap')", icon: 'fa-check' })(ReportHeatmap);
$({ path: '/reports/occupancy', name: "_('w_Navigation_Report_Occupancy')", icon: 'fa-check' })(ReportOccupancy);
$({ path: '/reports/vip_black_list', name: "_('w_Navigation_Report_VIPBlackList')", icon: 'fa-code' })(ReportVIPTracking);
$({ path: '/reports/repeat_visitor', name: "_('w_Navigation_Report_RepeatVisitor')", icon: 'fa-check' })(ReportRepeatVisitor);
$({ path: '/reports/campaign', name: "_('w_Navigation_Report_Campaign')", icon: 'fa-check' })(ReportCampaign);
$({ path: '/reports/report_template', name: "_('w_Navigation_Report_ReportTemplate')", icon: 'fa-check' })(ReportTemplate);

//  Tool
$({ path: '/tools', name: "_('w_Navigation_Tools')", icon: 'fa-code', redirect: '/tools/toolTraffic' })();
$({ path: '/tools/tool_traffic', name: "_('w_Navigation_Tools_Traffic')", icon: 'fa-check' })(ToolTraffic);
$({ path: '/tools/tool_demographic', name: "_('w_Navigation_Tools_Demographic')", icon: 'fa-check' })(ToolDemographic);
$({ path: '/tools/tool_repeatVisitor', name: "_('w_Navigation_Tools_RepeatVisitor')", icon: 'fa-check' })(ToolRepeatVisitor);
$({ path: '/tools/tool_occupancy', name: "_('w_Navigation_Tools_Occupancy')", icon: 'fa-code' })(ToolOccupancy);
$({ path: '/tools/tool_dwellTime', name: "_('w_Navigation_Tools_DwellTime')", icon: 'fa-code' })(ToolDwellTime);

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
$({ path: '/server/frs_manager_server', name: "_('w_Navigation_Server_FRSManagerServer')", icon: 'fa-code' })(FRSManager);
$({ path: '/server/frs_server', name: "_('w_Navigation_Server_FRSServer')", icon: 'fa-check' })(FRSServer);
$({ path: '/server/demographic_server', name: "_('w_Navigation_Server_DemographicServer')", icon: 'fa-check' })(DemographicServer);
$({ path: '/server/hd_server', name: "_('w_Navigation_Server_HDServer')", icon: 'fa-check' })(HumanDetectionServer);

// Video Source (c)
$({ path: '/video_sources', name: "_('w_Navigation_VideoSources')", icon: 'fa-code', redirect: '/login' })();
$({ path: '/video_sources/people_counting', name: "_('w_Navigation_VideoSources_PeopleCounting')", icon: 'fa-code' })(PeopleCounting);
$({ path: '/video_sources/demographic', name: "_('w_Navigation_VideoSources_Demographic')", icon: 'fa-check' })(Demographic);
$({ path: '/video_sources/dwell_time', name: "_('w_Navigation_VideoSources_DwellTime')", icon: 'fa-check' })(DwellTime);
$({ path: '/video_sources/human_detection', name: "_('w_Navigation_VideoSources_HumanDetection')", icon: 'fa-check' })(HumanDetection);
$({ path: '/video_sources/heatmap', name: "_('w_Navigation_VideoSources_Heatmap')", icon: 'fa-check' })(Heatmap);
$({ path: '/video_sources/face_recognition', name: "_('w_Navigation_VideoSources_FaceRecognition')", icon: 'fa-check' })(FaceRecognition);

// Rule Engine
$({ path: '/rule_actions', name: "_('w_Navigation_RuleAndActions')", icon: 'fa-code', redirect: '/rule_actions/traffic' })();
$({ path: '/rule_actions/traffic', name: "_('w_Navigation_RuleAndActions_Traffic')", icon: 'fa-code' })(RuleAndActionsTraffic);
$({ path: '/rule_actions/occupancy', name: "_('w_Navigation_RuleAndActions_Occupancy')", icon: 'fa-code' })(RuleAndActionsOccupancy);
$({ path: '/rule_actions/vip_blacklist', name: "_('w_Navigation_RuleAndActions_VipBlacklist')", icon: 'fa-code' })(RuleAndActionsVipBlacklist);
$({ path: '/rule_actions/repeat_visitor', name: "_('w_Navigation_RuleAndActions_RepeatVisitor')", icon: 'fa-code' })(RuleAndActionsRepeatVisitor);

// Business Operation
$({ path: '/business_operations', name: "_('w_Navigation_BusinessOperation')", redirect: '/business_operations/campaign_setting' })();
$({ path: '/business_operations/campaign_setting', name: "_('w_Navigation_BO_CampaignSetting')", icon: 'fa-check' })(CampaignSetting);
$({ path: '/business_operations/sales_records', name: "_('w_Navigation_BO_SalesRecords')", icon: 'fa-check' })(SalesRecords);
$({ path: '/business_operations/general_office_hour', name: "_('w_Navigation_BO_GeneralOfficeHour')", icon: 'fa-check' })(GeneralOfficeHour);

// Setting
$({ path: '/setting', name: "_('w_Navigation_Setting')", redirect: '/setting/mail_server' })();
$({ path: '/setting/mail_server', name: "_('w_Navigation_Setting_MailServer')" })(MailServer);
$({ path: '/setting/sms', name: "_('w_Navigation_Setting_SMS')" })(SMS);
$({ path: '/setting/weather', name: "_('w_Navigation_Setting_Weather')" })(Weather);
// $({ path: '/setting/backup', name: "_('w_Navigation_Setting_Backup')", icon: 'fa-question' })(Backup);
// $({ path: '/setting/restore', name: "_('w_Navigation_Setting_Restore')", icon: 'fa-question' })(Restore);
$({ path: '/setting/license', name: "_('w_Navigation_Setting_License')" })(License);
$({ path: '/setting/tag', name: "_('w_Navigation_Setting_Tag')" })(Tag);
$({ path: '/setting/system', name: "_('w_Navigation_Setting_System')" })(System);
