<template>
    <CoreUIBase>
        <template #header>
            <div
                v-if="$user && $user.user"
                class="container-fluid role"
            >
                {{ $user.user.username }}
                <i class="fa fa-user-circle" />
                <b-button @click="logout">Logout</b-button>
            </div>
        </template>

        <template #footer>
            © 2019
        </template>

        <template #nav>
            <SidebarNav>
                <SidebarNavItem url="/dashboard/dashboard" />

                <SidebarNavTitle :label="_('m_Navagation_Persons')" />
                <SidebarNavItem url="/persons/person" />
                <SidebarNavItem url="/persons/Stranger" />

                <SidebarNavTitle :label="_('m_Navagation_Users')" />
                <SidebarNavItem url="/users/user" />
                <SidebarNavItem url="/users/userGroup" />

                <SidebarNavTitle :label="_('m_Navagation_Region')" />
                <SidebarNavItem url="/region/site" />

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
        await this.$logout();
        this.$goHome();
    }
}
</script>

<style lang="scss" scope>
.role {
    font-size: 16px;
    text-align: right;
    line-height: 20px;
    i {
        font-size: 20px;
        padding: {
            left: 2px;
            right: 20px;
        }
    }
}
</style>