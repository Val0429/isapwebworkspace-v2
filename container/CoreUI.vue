<template>
    <CoreUIBase>
        <template #header>
            Hello iSAP
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
export default class CoreUI extends Vue {}
</script>
