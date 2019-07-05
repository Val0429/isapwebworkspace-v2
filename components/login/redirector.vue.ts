import { Vue, Component } from "vue-property-decorator";
import { PermissionList} from '@/../src/constants/permissions';

@Component
export default class Redirector extends Vue{
    created(){
        //console.log("Redirector", this.$user);
        if(!this.$user.permissions || this.$user.permissions.length<=0) this.$router.push("/login");
        for(let perm of this.$user.permissions.filter(x=>x.access.R===true)){            
            let getRouter = PermissionList.find(x=>x.key == perm.of.identifier);
            if(!getRouter.route)continue;
            this.$router.push(getRouter.route);
            break;    
        }
    }
}