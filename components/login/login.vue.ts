<<<<<<< HEAD
import { Vue, Component } from 'vue-property-decorator';
=======
import { Vue, Component } from "vue-property-decorator";
>>>>>>> master
import { RegisterLoginRouter } from '@/../core';
import { ServerName, ServerVersion } from '@/../core/server';

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
        await this.$login({
            username: this.username,
            password: this.password,
        });
        this.$router.push('/');
    }

    forgotPassword() {
        this.$router.push('/forgot_password');
    }
}
