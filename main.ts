import { Vue, Language } from "@/../core";
import Dialog from "@/services/Dialog/Dialog";
import debug from '@/config/default/debug';


if(debug.prodMode){
    Vue.config.errorHandler = (error, vm, info) => {
        let lang = new Language();
        console.error("Vue.config.errorHandler", vm.$route, error);
        let err :any = error as any;
        if(err.res && err.res.statusCode && err.res.statusCode===401 && vm.$route.fullPath!=="/login") {        
            console.error("redirected to login");
            alert(lang.translate("w_RedirectToLoginMessage"));
            vm.$router.push("/login");
        }
        
    }
    //remove console log
    window.console.log = function(){}
}
