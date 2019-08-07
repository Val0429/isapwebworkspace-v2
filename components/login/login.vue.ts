import { Vue, Component } from 'vue-property-decorator';
import { RegisterLoginRouter } from '@/../core';
import { ServerName, ServerVersion } from '@/../core/server';
import { EUserRole } from '@/services/Role';
import Dialog from '@/services/Dialog';
import Loading from '@/services/Loading';

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
                console.log('!!! check', this.$user.user != undefined, this.$user.user.roles != undefined, this.$user.user.roles[0] != undefined, this.$user.user.roles[0].name);
                if (this.$user.user != undefined && this.$user.user.roles != undefined && this.$user.user.roles[0] != undefined && this.$user.user.roles[0].name != undefined) {
                    userRole = this.$user.user.roles[0].name;
                }
                console.log('!!! userRole', userRole, EUserRole.TenantUser, userRole == EUserRole.TenantUser);
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
                    Dialog.error(this._('w_FailedToFetch'));
                    return true;
                }
                if (e.res != undefined && e.res.statusCode != undefined && e.res.statusCode == 401) {
                    Dialog.error(this._('w_UserSession_Empty'));
                }
            });
    }

    forgotPassword() {
        this.$router.push('/forgot_password');
    }
}
