import { Vue, Component } from 'vue-property-decorator';
import { RegisterLoginRouter } from '@/../core';
import { ServerName, ServerVersion } from '@/../core/server';
import { EUserRole } from '@/services/Role';
import Dialog from '@/services/Dialog';
import Loading from '@/services/Loading';
import RemeberMe from '@/services/RemeberMe';

enum ERemeberMe {
    rememberMe = 'rememberMe',
    noRemeberMe = 'noRemeberMe',
}

@RegisterLoginRouter({
    name: "_('w_Login_LoginTitle')",
    path: '/login',
    disableContainer: true,
})
@Component
export default class Login extends Vue {
    private version = `${ServerName} ${ServerVersion}`;
    private username: string = '';
    private password: string = '';
    private remeberMe: string = ERemeberMe.noRemeberMe;
    private eRemeberMe: any = ERemeberMe;

    created() {}

    mounted() {
        this.initLoginInfo();
    }

    initLoginInfo() {
        let loginInfo = RemeberMe.getLogin();
        this.username = loginInfo.username;
        this.password = loginInfo.password;
        if (loginInfo.username != '' && loginInfo.password != '') {
            this.remeberMe = ERemeberMe.rememberMe;
        }
    }

    async Login() {
        Loading.show();
        let param = {
            username: this.username,
            password: this.password,
        };

        if (this.remeberMe == ERemeberMe.noRemeberMe) {
            RemeberMe.clearLogin();
        }

        await this.$login({
            username: this.username,
            password: this.password,
        })
            .then(() => {
                Loading.hide();

                if (this.remeberMe == ERemeberMe.rememberMe) {
                    RemeberMe.saveLogin(param);
                }
                let userRole = '';
                if (this.$user.user != undefined && this.$user.user.roles != undefined && this.$user.user.roles[0] != undefined && this.$user.user.roles[0].name != undefined) {
                    userRole = this.$user.user.roles[0].name;
                }

                switch (userRole) {
                    case EUserRole.SystemAdministrator:
                        this.$router.push('/reports/dashboard');
                        break;
                    case EUserRole.Administrator:
                        this.$router.push('/reports/dashboard');
                        break;
                    case EUserRole.TenantAdministrator:
                        this.$router.push('/setups/account');
                        break;
                    case EUserRole.TenantUser:
                        this.$router.push('/tenants/invitation');
                        break;
                    case EUserRole.Visitor:
                        Dialog.error(this._('w_User_VisitorCannotLogin'));
                        break;
                }
            })
            .catch((e: any) => {
                Loading.hide();
                console.log(e);
                if (e.err != undefined && e.err == 'Failed to fetch') {
                    Dialog.error(this._('w_Error_FailedToFetch'));
                    return true;
                }
                if (e.res != undefined && e.res.statusCode != undefined && e.res.statusCode == 401) {
                    Dialog.error(this._('w_Error_401'));
                }
                if (e.res != undefined && e.res.statusCode != undefined && e.res.statusCode == 400) {
                    Dialog.error(this._('w_Error_404'));
                }
            });
        this.$router.push('/');
    }

    forgotPassword() {
        this.$router.push('/forgot_password');
    }
}
