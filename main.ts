import { Vue, Language, Model } from "@/../core";
import Dialog from "@/services/Dialog/Dialog";

Vue.config.errorHandler = (error, vm, info) => {
    console.error("Vue.config.errorHandler", vm.$route, error);
    let res :any = (error as any).res;
    if(res.statusCode && res.statusCode===401 && vm.$route.fullPath!=="/login") {
        let lang = new Language();
        console.error("redirected to login");
        if(confirm(lang.translate("w_RedirectToLoginMessage"))) vm.$router.push("/login");
    }
}

