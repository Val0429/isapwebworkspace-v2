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
                <!-- <SidebarNavTitle label="Components" /> -->
                <!-- <SidebarNavItem url="/components">
                    <SidebarNavItem url="/components/forms" />
                </SidebarNavItem> -->

                <SidebarNavTitle label="基本元件" />
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

                <!-- Users -->
                <SidebarNavItem url="/users/user">
                    <SidebarNavItem url="/users/user"></SidebarNavItem>
                    <SidebarNavItem url="/users/user_group"></SidebarNavItem>
                </SidebarNavItem>


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
                <SidebarNavItem url="/home/about" />

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
