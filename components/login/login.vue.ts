import { Vue, Component } from 'vue-property-decorator';
import { RegisterLoginRouter } from '@/../core';
import { EUserRole } from '@/services/Role';
import Dialog from '@/services/Dialog';
import Loading from '@/services/Loading';
import RemeberMe from '@/services/RemeberMe';
import PackageJSON from '@/package.json';

enum ERemeberMe {
    rememberMe = 'rememberMe',
    noRemeberMe = 'noRemeberMe',
}

@RegisterLoginRouter({
    name: "_('w_Login_LoginTitle')",
    path: '/login',
    disableContainer: true,
    permission: '/user/web/login',
})
@Component
export default class Login extends Vue {
    private version: string = `${PackageJSON.description} ${PackageJSON.version}`;
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
        return true;
    }

    showProject() {}

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
                        setTimeout(() => this.$router.push(`/accounts`), 100);
                        break;
                    case EUserRole.VMS:
                        setTimeout(() => this.$router.push(`/my_profile`), 100);
                        break;
                    case EUserRole.Administrator:
                        setTimeout(() => this.$router.push(`/accounts`), 100);
                        break;
                    case EUserRole.TenantAdministrator:
                        setTimeout(() => this.$router.push(`/persons`), 100);
                        break;
                }
            })
            .catch((e: any) => {
                Loading.hide();
                if (e.err != undefined && e.err == 'Failed to fetch') {
                    Dialog.error(this._('w_Error_FailedToFetch'));
                    return true;
                }
                if (e.res != undefined && e.res.statusCode != undefined && (e.res.statusCode == 400 || e.res.statusCode == 401)) {
                    Dialog.error(this._('w_Login_Error_401'));
                    return true;
                }
                if (e.res != undefined && e.res.statusCode != undefined && e.res.statusCode == 404) {
                    Dialog.error(this._('w_Error_404'));
                    return true;
                }
            });
        this.$router.push('/');
    }

    forgotPassword() {
        this.$router.push('/forgot_password');
    }
}
