<template>
    <CoreUIBase>
        <template #header>
            Hello iSAP
        </template>

        <template #footer>
            iSAP
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
                >
                    <SidebarNavItem
                        :label="_('w_Navigation_GeneralSettings_Background')"
                        url="/settings/background"
                    />

                    <SidebarNavItem
                        :label="_('w_Navigation_GeneralSettings_RemoveWorker')"
                        url="/settings/remove_worker"
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
