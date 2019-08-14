<template>
    <CoreUIBase>
        <template #header>

            <div class="float-right navbar-nav" >
                <div class="navbar-nav-user-name">{{ $user && $user.user && $user.user.username ? $user.user.username : "" }}</div>
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
            <SidebarHeader label="iSAP Web Framework" />
            <SidebarNav>

                <!-- Dahsboard -->
                <SidebarNavItem
                    :label="_('w_Navigation_Dashboard')"
                    url="/dashboard"
                />

                <!-- Invitation -->
                <SidebarNavItem
                    :label="_('w_Navigation_Invitation')"
                    url="/invitation"
                />

                <!-- General Settings -->
                <SidebarNavItem
                    :label="_('w_Navigation_GeneralSettings')"
                    url="/settings"
                />

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
                margin-right: 10px;
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
