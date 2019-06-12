<template>
    <CoreUIBase>
        <template #header>
            <b-navbar-nav class="nav navbar-nav ml-auto">
                <div class="navbar-nav-user-name">{{ $user && $user.username ? $user.username : "" }}</div>
                <a href="/my_profile">
                    <img
                        class="img-avatar"
                        src="@/assets/images/default-user-icon.svg"
                    />
                </a>
                <b-button @click="logout">{{ _('w_Logout') }}</b-button>
            </b-navbar-nav>
        </template>

        <template #footer>
            iSAP
        </template>

        <template #nav>
            <SidebarHeader :label="_('w_Navigation_Label')" />
            <SidebarNav>
                <!-- <SidebarNavTitle label="Components" /> -->
                <!-- <SidebarNavItem url="/components">
                    <SidebarNavItem url="/components/forms" />
                </SidebarNavItem> -->

                <!-- <SidebarNavTitle label="基本元件" />
                <SidebarNavItem url="/components" />
                <SidebarNavItem url="/components/forms" />
                <SidebarNavItem url="/components/step-progress" />
                <SidebarNavItem url="/components/toolbox" />
                <SidebarNavItem url="/components/cards" />
                <SidebarNavItem url="/components/cards/auto" />
                <SidebarNavItem url="/components/table" />
                <SidebarNavItem url="/components/tree" />
                <SidebarNavItem url="/components/transition" />
                <SidebarNavItem url="/components/modal" />
                <SidebarNavItem url="/components/utilities" />

                <SidebarNavTitle label="選單特殊樣式" />
                <SidebarNavItem url="/menu-style/1" />
                <SidebarNavItem url="/menu-style/2" />

                <SidebarNavItem url="/home">
                    <SidebarNavItem url="/home">
                        <SidebarNavItem url="/home/about" />
                        <SidebarNavItem url="/home" />
                        <SidebarNavItem url="/home/about" />
                    </SidebarNavItem>
                    <SidebarNavItem url="/home/about" />
                    <SidebarNavItem url="/home" />
                    <SidebarNavItem url="/home/about" />
                </SidebarNavItem>
                <SidebarNavItem url="/home/about" /> -->

                <!-- Region -->
                <SidebarNavItem
                    :label="_('w_Navigation_Region')"
                    url="/region"
                />

                <!-- Site -->
                <SidebarNavItem
                    :label="_('w_Navigation_Site')"
                    url="/site"
                />

                <!-- Users -->
                <SidebarNavItem
                    :label="_('w_Navigation_Users')"
                    url="/users/user"
                >
                    <SidebarNavItem
                        :label="_('w_Navigation_User')"
                        url="/users/user"
                    />
                    <SidebarNavItem
                        :label="_('w_Navigation_UserGroup')"
                        url="/users/user_group"
                    />
                </SidebarNavItem>

                <!-- Business Operation -->
                <SidebarNavItem
                    :label="_('w_Navigation_BusinessOperation')"
                    url="/business_operations/campaign_setting"
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

                <!-- Server -->
                <SidebarNavItem
                    :label="_('w_Navigation_Server')"
                    url="/server/cms_server"
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
                        :label="_('w_Navigation_Server_HDServer')"
                        url="/server/hd_server"
                    />
                </SidebarNavItem>

                <!-- Setting -->
                <SidebarNavItem
                    :label="_('w_Navigation_Setting')"
                    url="/setting/mail_server"
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
                    <SidebarNavItem
                        :label="_('w_Navigation_Setting_Backup')"
                        url="/setting/backup"
                    />
                    <SidebarNavItem
                        :label="_('w_Navigation_Setting_Restore')"
                        url="/setting/restore"
                    />
                    <SidebarNavItem
                        :label="_('w_Navigation_Setting_License')"
                        url="/setting/license"
                    />
                    <SidebarNavItem
                        :label="_('w_Navigation_Setting_Tag')"
                        url="/setting/tag"
                    />
                </SidebarNavItem>

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
    logout() {
        // this.$login
        console.log("Waitting logout function in framework");
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
</style>
