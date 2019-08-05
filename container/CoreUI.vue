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
                >{{ _('w_About_Copyright') }}</a>&copy;2019
            </div>
        </template>

        <template #nav>

            <SidebarHeader label="iSAP Web Framework" />

            <SidebarNav>

                <iv-permission :allow="['SystemAdministrator', 'Administrator']">
                    <SidebarNavItem
                        :label="_('w_Navigation_Reports')"
                        url="/reports"
                    >
                        <SidebarNavItem
                            :label="_('w_Navigation_Reports_Dashboard')"
                            url="/reports/dashboard"
                        />
                        <iv-permission :allow="['Administrator']">
                            <SidebarNavItem
                                :label="_('w_Navigation_Reports_Investigation')"
                                url="/reports/investigation"
                            />
                        </iv-permission>
                    </SidebarNavItem>
                </iv-permission>

                <iv-permission :allow="['SystemAdministrator', 'Administrator', 'TenantAdministrator']">
                    <SidebarNavItem
                        :label="_('w_Navigation_Setups')"
                        url="/setups"
                    >

                        <iv-permission :allow="['Administrator']">
                            <SidebarNavItem
                                :label="_('w_Navigation_Setups_Floor')"
                                url="/setups/floor"
                            />

                            <SidebarNavItem
                                :label="_('w_Navigation_Setups_Company')"
                                url="/setups/company"
                            />
                        </iv-permission>

                        <SidebarNavItem
                            :label="_('w_Navigation_Setups_Account')"
                            url="/setups/account"
                        />

                        <iv-permission :allow="['SystemAdministrator', 'Administrator']">

                            <SidebarNavItem
                                :label="_('w_Navigation_Setups_Kiosk')"
                                url="/setups/kiosk"
                            />

                            <SidebarNavItem
                                :label="_('w_Navigation_Setups_License')"
                                url="/setups/license"
                            />

                            <SidebarNavItem
                                :label="_('w_Navigation_Setups_FRS')"
                                url="/setups/frs"
                            />

                            <SidebarNavItem
                                :label="_('w_Navigation_Setups_Email')"
                                url="/setups/email"
                            />

                            <SidebarNavItem
                                :label="_('w_Navigation_Setups_SMS')"
                                url="/setups/sms"
                            />

                            <SidebarNavItem
                                :label="_('w_Navigation_Setups_SMSOnline')"
                                url="/setups/sms_online"
                            />

                            <SidebarNavItem
                                :label="_('w_Navigation_Setups_VisitorCard')"
                                url="/setups/visitor_card"
                            />

                        </iv-permission>

                    </SidebarNavItem>
                </iv-permission>

                <iv-permission :allow="['TenantUser']">
                    <SidebarNavItem
                        :label="_('w_Navigation_Tenants_Invitation')"
                        url="/tenants/invitation"
                    />

                    <SidebarNavItem
                        :label="_('w_Navigation_Tenants_Visitor')"
                        url="/tenants/visitor"
                    />
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
    logoutPath = "/users/logout";

    Logout() {
        try {
            this.$logout(this.logoutPath);
        } catch (e) {
            console.log(e);
        } finally {
            this.$router.push("/login");
        }
    }

    created() {}

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
