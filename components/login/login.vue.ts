import { Vue, Component } from 'vue-property-decorator';
import { RegisterLoginRouter } from '@/../core';
import { ServerName, ServerVersion } from '@/../core/server';
import { EUserRole } from '@/services/Role';
import Dialog from '@/services/Dialog';
import Loading from '@/services/Loading';
import RemeberMe from '@/services/RemeberMe';
import PackeageJSON from '@/package.json';
import RegexServices from '@/services/RegexServices';

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

    created() {
        this.showProject();
    }

    mounted() {
        this.initLoginInfo();
    }

    showForgotPassword() {
        let result = false;
        switch (PackeageJSON.flow) {
            case '/flow2':
                result = true;
                break;
        }
        return result;
    }

    showProject() {
        console.log(`Project: ${PackeageJSON.project[PackeageJSON.flow]}`);
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
                        setTimeout(() => this.$router.push(`/reports/dashboard`), 100);
                        break;
                    case EUserRole.Administrator:
                        setTimeout(() => this.$router.push(`/reports/dashboard`), 100);
                        break;
                    case EUserRole.TenantAdministrator:
                        setTimeout(() => this.$router.push(`/setups/account`), 100);
                        break;
                    case EUserRole.TenantUser:
                        setTimeout(() => this.$router.push(`/tenants/invitation`), 100);
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
