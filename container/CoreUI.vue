<template>
    <CoreUIBase>
        <template #header>
            <div class="float-right navbar-nav">
                <div class="navbar-nav-user-name">{{ $user && $user.user && $user.user.name ? $user.user.name : "" }}</div>
                <a href="/my_profile">
                    <img
                        class="img-avatar"
                        src="@/assets/images/default-user-icon.svg"
                    />
                </a>
                <b-button @click="Logout">{{ _('w_Logout') }}</b-button>
            </div>
        </template>

        <template #footer>
            <div class="footer-copy">
                <a
                    href="http://www.isapsolution.com/"
                    target="_blank"
                >www.isapsolution.com</a>&copy;2019
            </div>
        </template>

        <template #nav>
            <SidebarHeader :label="_('w_Navigation_Label')" />
            <SidebarNav>

                <!-- Rules : SuperAdministrator, Admin, User -->

                <iv-permission :allow="['Admin', 'User']">

                    <!-- Dashboard -->
                    <SidebarNavItem
                        :label="_('w_Navigation_Dashboards')"
                        url="/dashboards"
                    >
                        <SidebarNavItem
                            :label="_('w_DashboardOverview_Overview')"
                            url="/dashboards/overview"
                        />
                        <SidebarNavItem
                            :label="_('w_DashboardMap_Map')"
                            url="/dashboards/map"
                        />
                    </SidebarNavItem>

                    <!-- Analysis -->
                    <!-- <SidebarNavItem
                        :label="_('w_Navigation_Analysises')"
                        url="/analysises"
                    /> -->

                    <!-- Report -->
                    <SidebarNavItem
                        :label="_('w_Navigation_Report')"
                        url="/reports"
                    >
                        <SidebarNavItem
                            :label="_('w_Navigation_Report_Traffic')"
                            url="/reports/traffic"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Report_DwellTime')"
                            url="/reports/dwell_time"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Report_Demographic')"
                            url="/reports/demographic"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Report_Heatmap')"
                            url="/reports/heatmap"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Report_Occupancy')"
                            url="/reports/occupancy"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Report_VIPBlackList')"
                            url="/reports/vip_black_list"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Report_RepeatVisitor')"
                            url="/reports/repeat_visitor"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Report_Campaign')"
                            url="/reports/campaign"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Report_ReportTemplate')"
                            url="/reports/report_template"
                        />
                    </SidebarNavItem>

                    <!-- Tools -->
                    <SidebarNavItem
                        :label="_('w_Navigation_Tools')"
                        url="/tools"
                    >
                        <SidebarNavItem
                            :label="_('w_Navigation_Tools_Traffic')"
                            url="/tools/tool_traffic"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Tools_Demographic')"
                            url="/tools/tool_demographic"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Tools_RepeatVisitor')"
                            url="/tools/tool_repeatVisitor"
                        />
                    </SidebarNavItem>

                </iv-permission>

                <iv-permission :allow="['SuperAdministrator', 'Admin']">

                    <!-- Users -->
                    <SidebarNavItem
                        :label="_('w_Navigation_Users')"
                        url="/users"
                    >
                        <SidebarNavItem
                            :label="_('w_Navigation_Users_User')"
                            url="/users/user"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Users_UserGroup')"
                            url="/users/user_group"
                        />
                    </SidebarNavItem>

                    <!-- Site -->
                    <SidebarNavItem
                        :label="_('w_Navigation_Site')"
                        url="/site"
                    />

                    <!-- Region -->
                    <SidebarNavItem
                        :label="_('w_Navigation_Region')"
                        url="/region"
                    />

                    <!-- Server -->
                    <SidebarNavItem
                        :label="_('w_Navigation_Server')"
                        url="/server"
                    >
                        <SidebarNavItem
                            :label="_('w_Navigation_Server_CMSServer')"
                            url="/server/cms_server"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Server_FRSServer')"
                            url="/server/frs_server"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Server_FRSManagerServer')"
                            url="/server/frs_manager_server"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Server_DemographicServer')"
                            url="/server/demographic_server"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Server_HDServer')"
                            url="/server/hd_server"
                        />

                    </SidebarNavItem>

                    <!-- Video Source -->
                    <SidebarNavItem
                        :label="_('w_Navigation_VideoSources')"
                        url="/video_sources"
                    >
                        <SidebarNavItem
                            :label="_('w_Navigation_VideoSources_PeopleCounting')"
                            url="/video_sources/people_counting"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_VideoSources_Demographic')"
                            url="/video_sources/demographic"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_VideoSources_DwellTime')"
                            url="/video_sources/dwell_time"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_VideoSources_HumanDetection')"
                            url="/video_sources/human_detection"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_VideoSources_Heatmap')"
                            url="/video_sources/heatmap"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_VideoSources_FaceRecognition')"
                            url="/video_sources/face_recognition"
                        />
                    </SidebarNavItem>

                    <!-- Rule and Actions -->
                    <SidebarNavItem
                        :label="_('w_Navigation_RuleAndActions')"
                        url="/rule_actions"
                    >
                        <SidebarNavItem
                            :label="_('w_Navigation_RuleAndActions_Traffic')"
                            url="/rule_actions/traffic"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_RuleAndActions_Occupancy')"
                            url="/rule_actions/occupancy"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_RuleAndActions_VipBlacklist')"
                            url="/rule_actions/vip_blacklist"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_RuleAndActions_RepeatVisitor')"
                            url="/rule_actions/repeat_visitor"
                        />
                    </SidebarNavItem>

                    <!-- Business Operation -->
                    <SidebarNavItem
                        :label="_('w_Navigation_BusinessOperation')"
                        url="/business_operations"
                    >
                        <SidebarNavItem
                            :label="_('w_Navigation_BO_CampaignSetting')"
                            url="/business_operations/campaign_setting"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_BO_SalesRecords')"
                            url="/business_operations/sales_records"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_BO_GeneralOfficeHour')"
                            url="/business_operations/general_office_hour"
                        />
                    </SidebarNavItem>

                    <!-- Setting -->
                    <SidebarNavItem
                        :label="_('w_Navigation_Setting')"
                        url="/setting"
                    >
                        <SidebarNavItem
                            :label="_('w_Navigation_Setting_System')"
                            url="/setting/system"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Setting_MailServer')"
                            url="/setting/mail_server"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Setting_SMS')"
                            url="/setting/sms"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Setting_Weather')"
                            url="/setting/weather"
                        />
                        <!-- <SidebarNavItem
                            :label="_('w_Navigation_Setting_Backup')"
                            url="/setting/backup"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Setting_Restore')"
                            url="/setting/restore"
                        /> -->
                        <SidebarNavItem
                            :label="_('w_Navigation_Setting_License')"
                            url="/setting/license"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_Setting_Tag')"
                            url="/setting/tag"
                        />
                    </SidebarNavItem>

                </iv-permission>

            </SidebarNav>

        </template>
    </CoreUIBase>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
    CoreUI as CoreUIBase,
    SidebarHeader,
    SidebarNav,
    SidebarNavTitle,
    SidebarNavDivider,
    SidebarNavItem
} from "@/../containers/CoreUI";

import { Ws } from "@/services/WebSocket/Ws";
import ServerConfig from "@/services/ServerConfig";
import Loading from "@/services/Loading";

@Component({
    components: {
        CoreUIBase,
        SidebarHeader,
        SidebarNav,
        SidebarNavTitle,
        SidebarNavDivider,
        SidebarNavItem
    }
})
export default class CoreUI extends Vue {
    // Logout
    logoutPath = "/user/base/logout";

    Logout() {
        try {
            this.$logout(this.logoutPath);
        } catch (e) {
            console.log(e);
        } finally {
            this.$router.push("/login");
        }
    }

    mounted() {}

    beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.app-header {
    .navbar-nav {
        padding-right: 20px;
        -ms-flex-direction: row;
        flex-direction: row;
        -ms-flex-align: center;
        align-items: center;

        .navbar-nav-user-name {
            font-weight: bold;
            font-size: 1rem;
        }

        img.img-avatar {
            height: 35px;
            margin: 0 10px;
        }
    }
}
.footer-copy {
    padding: 10px;
}
</style>
