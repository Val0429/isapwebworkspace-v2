import { Vue, Component } from 'vue-property-decorator';
import { RegisterLoginRouter } from '@/../core';
import { ServerName, ServerVersion } from '@/../core/server';
import Dialog from '@/services/Dialog';
import Loading from '@/services/Loading';

enum EUserRole {
    SuperAdministrator = 'SuperAdministrator',
    Admin = 'Admin',
    User = 'User',
}

@RegisterLoginRouter({
    name: "_('w_Login_LoginTitle')",
    path: '/login',

    // Min server
    permission: '/user/user/login',

    // Master
    // permission: '/users/login',

    disableContainer: true,
})
@Component
export default class Login extends Vue {
    private version = `${ServerName} ${ServerVersion}`;
    private username: string = '';
    private password: string = '';

    async Login() {
        Loading.show();
        let param = {
            username: this.username,
            password: this.password,
        };
        await this.$login(param)
            .then(() => {
                Loading.hide();
                let userRole = '';
                if (this.$user.user != undefined && this.$user.user.roles[0] != undefined && this.$user.user.roles[0].name != undefined) {
                    userRole = this.$user.user.roles[0].name;
                }
                switch (userRole) {
                    case EUserRole.SuperAdministrator:
                        this.$router.push('/users/user');
                        break;
                    case EUserRole.Admin:
                        this.$router.push('/reports/traffic');
                        break;
                    case EUserRole.User:
                        this.$router.push('/reports/traffic');
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
                    Dialog.error(this._('w_Error_401'));
                }
            });
    }

    forgotPassword() {
        this.$router.push('/forgot_password');
    }
}
