<template>
    <CoreUIBase>
        <template #header>
            FET ACS
        </template>

        <template #footer>
            iSAP
        </template>

        <template #nav>
            <SidebarHeader label="Menu" />
            <SidebarNav>
                <SidebarNavItem url="/member" />
                <SidebarNavItem url="/user" />
                <SidebarNavItem url="/door" />
                <SidebarNavItem url="/doorgroup" />
                <SidebarNavItem url="/elevator" />
                <SidebarNavItem url="/timeschedule" />
                <SidebarNavItem url="/permissiontable" />
            </SidebarNav>
        </template>
    </CoreUIBase>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { CoreUI as CoreUIBase,
    SidebarHeader, SidebarNav, SidebarNavTitle, SidebarNavDivider, SidebarNavItem
} from '@/../containers/CoreUI';

@Component({
    components: {
        CoreUIBase,
        SidebarHeader, SidebarNav, SidebarNavTitle, SidebarNavDivider, SidebarNavItem
    }
})
export default class CoreUI extends Vue {

}
</script>
