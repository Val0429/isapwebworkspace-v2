<template>
    <CoreUIBase>
        <template #header>
            <div class="float-right navbar-nav">
                <div class="navbar-nav-user-name">{{ $user && $user.username ? $user.username : "" }}</div>
                <a href="/my_profile">
                    <img
                        class="img-avatar"
                        src="@/assets/images/default-user-icon.svg"
                    />
                </a>
                <b-button @click="logout">{{ _('w_Logout') }}</b-button>
            </div>
        </template>

        <template #footer>
            iSAP
        </template>

        <template #nav>
            <SidebarHeader label="Menu" />
            <SidebarNav>
                
                <SidebarNavItem url="/employeereport" />
                <SidebarNavItem url="/doorreport" />
                <SidebarNavItem url="/doorgroupreport" />
                <SidebarNavItem url="/cardreport" />          
                <SidebarNavItem url="/contractorreport" />
                <SidebarNavItem url="/demographicreport" />
                <SidebarNavItem url="/attendance" />      
                <SidebarNavItem url="/visitorreport" />
                
                <SidebarNavItem url="/permissiontable" />
                <SidebarNavItem url="/member" />
                <SidebarNavItem url="/region" />
                <SidebarNavItem url="/site" />
                <SidebarNavItem url="/doorgroup" />
                <SidebarNavItem url="/door" />
                <SidebarNavItem url="/reader" />
                
                
                <SidebarNavItem url="/elevatorgroup" />
                <SidebarNavItem url="/elevator" />
                
                <SidebarNavItem url="/floor" />
                <SidebarNavItem url="/syncreceiver" />
                <SidebarNavItem url="/user" />

                <!-- <SidebarNavItem url="/timeschedule" /> -->
                <!-- <SidebarNavItem url="/accesslevel" /> -->                
                
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
    async logout() {
        try{
            let sessionId=this.$server.getSessionId();
            await this.$server.C("/users/logout",{sessionId})
            console.log("logout");
            this.$router.push({ path: "/login" });
        }
        catch(e){
            console.error("logout", e);
            this.$router.push({ path: "/login" });
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