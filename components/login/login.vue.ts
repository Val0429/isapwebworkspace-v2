import { Vue, Component } from "vue-property-decorator";
import { RegisterLoginRouter } from '@/../core';
import { ServerName, ServerVersion } from '@/../core/server';
import { ModalResponse } from '@/../components/modal';
import { PermisisonList} from '@/../src/constants/permissions.ts';
@RegisterLoginRouter({
    name: "_('wb_Login')",
    path: "/login",
    // permission: "/user/user/login",
    disableContainer: true
})
@Component
export default class Login extends Vue {
    private version = `${ServerName} ${ServerVersion}`;
    private username: string = '';
    private password: string = '';

    async Login() {
        let result = await this.$login({
            username: this.username,
            password: this.password
        });
        if(!result.permissions || result.permissions.length<=0)this.$router.push("/");

        for(let perm of result.permissions.filter(x=>x.access.R===true)){            
            let getRouter = PermisisonList.find(x=>x.key == perm.of.identifier);
            if(!getRouter.route)continue;
            this.$router.push(getRouter.route);
            break;    
        }
        
        
        
    }
}
