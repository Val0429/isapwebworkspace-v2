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
                <SidebarNavItem url="/components" />

                <SidebarNavTitle label="人員管理" />
                <SidebarNavItem url="/persons/person" />
                <SidebarNavItem url="/persons/Stranger" />

                <SidebarNavTitle label="使用者管理" />
                <SidebarNavItem url="/users/user" />
                <SidebarNavItem url="/users/userGroup" />

                <SidebarNavTitle label="區域管理" />
                <SidebarNavItem url="/region/site" />

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
