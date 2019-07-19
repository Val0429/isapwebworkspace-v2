import { Vue, Component } from "vue-property-decorator";
import { PermissionList} from '@/../src/constants/permissions';

@Component
export default class Redirector extends Vue{
    created(){
        //console.log("Redirector", this.$user);
        if(!this.$user.permissions || this.$user.permissions.length<=0) this.$router.push("/login");
        for(let perm of PermissionList.filter(x=>x.route)){            
            let getPerm = this.$user.permissions.find(x=>x.access.R===true && x.of.identifier == perm.key);
            if(!getPerm)continue;
            this.$router.push(perm.route);
            break;    
        }
    }
}