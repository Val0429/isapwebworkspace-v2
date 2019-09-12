<template>
    <CoreUIBase>
        <template #header>
            <div class="float-right navbar-nav">
                <div class="navbar-nav-user-name">{{ $user && $user.user && $user.user.username ? $user.user.username : "" }}</div>
                <a href="/my_profile">
                    <img
                        class="img-avatar"
                        src="@/assets/images/default-user-icon.svg"
                    />
                </a>
                <b-button @click="logout">{{ _('w_Logout') }}</b-button>
            </div>
        </template>

        <template #footer>© 2019</template>

        <template #nav>
            <SidebarNav>
                <iv-permission :allow="['SystemAdministrator', 'Administrator']">
                    <SidebarNavItem
                        :label="_('m_Navigation_Accounts')"
                        url="/accounts"
                    />
                    <SidebarNavItem
                        :label="_('m_Navigation_Buildings')"
                        url="/buildings"
                    />
                    <SidebarNavItem
                        :label="_('m_Navigation_Floor')"
                        url="/floor"
                    />
                    <!-- <SidebarNavItem
                        :label="_('m_Navigation_Door')"
                        url="/door"
                    /> -->
                    <SidebarNavItem
                        :label="_('m_Navigation_Company')"
                        url="/company"
                    />
                </iv-permission>

                <SidebarNavItem
                    :label="_('m_Navigation_Persons')"
                    url="/persons"
                >
                    <SidebarNavItem
                        :label="_('m_Navigation_Persons_PersonList')"
                        url="/persons/personlist"
                    />

                    <SidebarNavItem
                        :label="_('m_Navigation_Persons_BlackList')"
                        url="/persons/blacklist"
                    />
                </SidebarNavItem>

                <iv-permission :allow="['SystemAdministrator', 'Administrator']">
                    <!-- <SidebarNavItem
<<<<<<< HEAD
                        :label="_('m_Navigation_Frs')"
=======
                        :label="_('m_Navigation_ISAPFrs')"
>>>>>>> 7bfab362b51dc204054f641242dcd7c0fb429267
                        url="/client/frs"
                    /> -->

                    <SidebarNavItem
                        :label="_('m_Navigation_HikVision')"
                        url="/client/hikvision"
                    />

                    <SidebarNavItem
                        :label="_('m_Navigation_Settings')"
                        url="/settings"
                    >
                        <SidebarNavItem
                            :label="_('m_Navigation_Settings_SuntecAppServer')"
                            url="/settings/suntec_app"
                        />
                        <SidebarNavItem
                            :label="_('m_Navigation_Settings_AcsServer')"
                            url="/settings/acs"
                        />
                        <SidebarNavItem
                            :label="_('m_Navigation_Settings_SmtpServer')"
                            url="/settings/smtp"
                        />
                        <SidebarNavItem
                            :label="_('m_Navigation_Settings_Frs')"
                            url="/settings/frs"
                        />
                        <SidebarNavItem
                            :label="_('m_Navigation_Settings_Vms')"
                            url="/settings/vms"
                        />

                        <SidebarNavItem
                            :label="_('m_Navigation_Frs')"
                            url="/settings/vms"
                        />

                        <SidebarNavItem
                            :label="_('m_Navigation_Settings_Email')"
                            url="/settings/email"
                        />
                        <SidebarNavItem
                            :label="_('m_Navigation_Settings_License')"
                            url="/settings/license"
                        />
                    </SidebarNavItem>
                </iv-permission>

                <!-- <SidebarNavItem
                    :label="_('m_Navigation_Reports')"
                    url="/reports"
                /> -->

                <iv-permission :allow="['SystemAdministrator', 'Administrator']">
                    <!-- <SidebarNavItem
                        :label="_('m_Navigation_Logs')"
                        url="/logs"
<<<<<<< HEAD
                    />
                </iv-permission> -->
=======
                    /> -->
                </iv-permission>
>>>>>>> 7bfab362b51dc204054f641242dcd7c0fb429267

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
    private async logout() {
        await this.$logout("/user/base/logout");
        this.$goHome();
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
.sidebar .nav-link {
    word-break: break-word;
    padding-left: calc(1.09375rem + 1rem + 0.875rem);
    i {
        margin-left: calc((0.875rem + 1rem) * -1);
    }
    .nav-dropdown-toggle {
        padding-left: 1rem;
    }
}
</style>