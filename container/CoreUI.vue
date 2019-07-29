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
                    <!-- <SidebarNavItem
                        :label="_('w_Navigation_Dashboards')"
                        url="/dashboards"
                    /> -->

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

                    <!-- Rule Engine -->
                    <SidebarNavItem
                        :label="_('w_Navigation_RuleEngine')"
                        url="/rule_engine"
                    >
                        <SidebarNavItem
                            :label="_('w_Navigation_RuleEngine_Traffic')"
                            url="/rule_engine/traffic"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_RuleEngine_demographic')"
                            url="/rule_engine/demographic"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_RuleEngine_heatmap')"
                            url="/rule_engine/heatmap"
                        />
                        <SidebarNavItem
                            :label="_('w_Navigation_RuleEngine_repeat_visitor')"
                            url="/rule_engine/repeat_visitor"
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

    // WebSocket Alive
    showLoadingSecond = 3000;
    wsOpenStatus: boolean = false;
    ws: Ws = new Ws({
        url: "",
        OnOpen: async (e: Event): Promise<void> => {
            this.setWsOpenStatus(true);
            console.log("WS Alive Open");
        },
        OnMessage: async (e: MessageEvent): Promise<void> => {
            if (e.data.length > 0) {
                this.handleWs(e.data);
            }
        },
        OnError: async (e: Event): Promise<void> => {
            this.setWsOpenStatus(false);
            console.log("WS Alive Error");
        },
        OnClose: async (e: CloseEvent): Promise<void> => {
            this.setWsOpenStatus(false);
            console.log("WS Alive Colse");
        }
    });

    mounted() {
        setTimeout(this.initWS, this.showLoadingSecond);
    }

    beforeDestroy() {
        this.ws.Close();
    }

    initWS() {
        if (this.$user.sessionId != undefined) {
            let url = `ws://${ServerConfig.host}:${ServerConfig.port}/server/alive?sessionId=${this.$user.sessionId}`;
            this.ws.url = url;
            this.ws.Connect();
        }
    }

    setWsOpenStatus(value: boolean) {
        this.wsOpenStatus = value;
        if (value) {
            Loading.hide();
        } else {
            setTimeout(this.setLoading, this.showLoadingSecond);
        }
    }

    setLoading() {
        if (!this.wsOpenStatus) {
            Loading.show();
        }
    }

    handleWs(wsData: string) {
        Loading.hide();
        try {
            let data: any = JSON.parse(wsData);
            if (data.statusCode != undefined && data.statusCode == 401) {
                this.Logout();
            }
        } catch (e) {
            console.log("WS handle error: ", e);
        }
    }
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
