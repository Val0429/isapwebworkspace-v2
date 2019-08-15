import { Vue, Language } from "@/../core";
import Dialog from "@/services/Dialog/Dialog";
import debug from '@/config/default/debug';


if(debug.prodMode){
    Vue.config.errorHandler = async (error, vm, info) => {
        let lang = new Language();
        console.error("Vue.config.errorHandler", vm.$route, error);
        let err :any = error as any;
        if(err.res && err.res.statusCode && err.res.statusCode===401 ) {       
            if(vm.$route.fullPath!=="/login") {
                console.error("redirected to login");
                await Dialog.confirm(
                    lang.translate("w_RedirectToLoginMessage"),
                    lang.translate("w_Error"),
                    () => {
                        vm.$router.push("/login");
                    }
                  );
            }
            else{
                await Dialog.error(lang.translate("w_Error_LoginFailed"));
            }
            
        }
        if(err.res && err.res.statusCode && (err.res.statusCode===400||err.res.statusCode===500) && err.body ) { 
            await Dialog.error(err.body);            
        }
        
    }
    //remove console log
//if(debug.prodMode){
    window.console.log = function(){}
}
