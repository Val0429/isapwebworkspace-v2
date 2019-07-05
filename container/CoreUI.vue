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
                <SidebarNavItem :label="_('w_Permission')">
                    <SidebarNavItem v-for="(item,index) in menuNavigations.filter(x=>x.group=='Permission')" v-bind:key="index" :url="item.url"/>
                </SidebarNavItem>
                <SidebarNavItem :label="_('w_Report')">
                    <SidebarNavItem v-for="(item,index) in menuNavigations.filter(x=>x.group=='Report')" v-bind:key="b+index" :url="item.url"/>
                </SidebarNavItem>
                <SidebarNavItem :label="_('w_AccessLevel')">
                    <SidebarNavItem v-for="(item,index) in menuNavigations.filter(x=>x.group=='AccessLevel')" v-bind:key="c+index" :url="item.url"/>
                </SidebarNavItem>
                <SidebarNavItem :label="_('w_Setting')">
                    <SidebarNavItem v-for="(item,index) in menuNavigations.filter(x=>x.group=='Setting')" v-bind:key="d+index" :url="item.url"/>
                </SidebarNavItem>
             </SidebarNav> 
        </template>
    </CoreUIBase>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { CoreUI as CoreUIBase,
    SidebarHeader, SidebarNav, SidebarNavTitle, SidebarNavDivider, SidebarNavItem
} from '@/../containers/CoreUI';
import { PermissionName, PermissionList} from '@/../src/constants/permissions';

@Component({
    components: {
        CoreUIBase,
        SidebarHeader, SidebarNav, SidebarNavTitle, SidebarNavDivider, SidebarNavItem
    }
})
export default class CoreUI extends Vue {

    menuNavigations = [];
    
    async logout() {
        //this.checkPermission();
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
    checkPermission(){
         this.menuNavigations=[];
        //console.log("checkPermission user", this.$user);
        if(!this.$user || !this.$user.permissions)return;
        for(let perm of PermissionList.filter(x=>x.route)){
            let menu = this.$user.permissions.find(x=>x.access.R === true && x.of.identifier == perm.key);
            if(!menu)continue;
            this.menuNavigations.push({url:perm.route, group:perm.group});
        }
    }
    @Watch('$route', {immediate:true, deep: true })
    onRouteChange(to, from){
        this.checkPermission();
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