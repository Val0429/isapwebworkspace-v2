import { Vue, Component } from 'vue-property-decorator';
import { RegisterLoginRouter } from '@/../core';
import { ServerName, ServerVersion } from '@/../core/server';
import Dialog from '@/services/Dialog';
import Loading from '@/services/Loading';

@RegisterLoginRouter({
    name: "_('w_Login_LoginTitle')",
    path: '/login',
    permission: '/user/user/login',
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
                this.$router.push('/');
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
