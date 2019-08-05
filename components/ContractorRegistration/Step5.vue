<template>
    <div>
        <iv-form
            :interface="IStep5()"
            :value="inputFormData"
        >
            <template #file="{$attrs, $listeners}">
                <ul>
                    <span class="luTitle">{{_('w_ViewPTW_Step5_SupportingDocuments')}}</span>
                    　<li>{{_('w_ViewPTW_Step5_RiskAssessment')}}</li>
                    　<li>{{_('w_ViewPTW_Step5_MethodOfStatement')}}</li>
                    　<li>{{_('w_ViewPTW_Step5_SafeWorkProcedure')}}</li>
                    　<li>{{_('w_ViewPTW_Step5_AnyRelevantLicensesOrPasses')}}</li>
                    　<li>{{_('w_ViewPTW_Step5_BizsafeCertificate')}}</li>
                    　<li>{{_('w_ViewPTW_Step5_Others')}}</li>
                </ul>
                <ul>
                    <span class="luTitle">{{_('w_ViewPTW_Step5_SupportingDocuments')}}</span>
                    　<li>{{_('w_ViewPTW_Step5_RiskAssessment')}}</li>
                    　<li>{{_('w_ViewPTW_Step5_MethodOfStatement')}}</li>
                    　<li>{{_('w_ViewPTW_Step5_SafeWorkProcedure')}}</li>
                    　<li>{{_('w_ViewPTW_Step5_AnyRelevantLicensesOrPasses')}}</li>
                    　<li>{{_('w_ViewPTW_Step5_BizsafeCertificate')}}</li>
                    　<li>{{_('w_ViewPTW_Step5_Others')}}</li>
                </ul>
                <iv-form-file
                    v-bind="$attrs"
                    v-on="$listeners"
                    multiple
                    accept=".jpeg, .png, .pdf"
                    value="file"
                ></iv-form-file>
                <span>{{_('w_ViewPTW_Step5_supported')}}</span>
            </template>
        </iv-form>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

@Component({
    components: {}
})
export class Step5 extends Vue {
    inputFormData: any = {
        file: null
    };

    created() {}

    mounted() {}

    putFile() {
        console.log("putFile", this.inputFormData);
        this.$emit("putStep5File", this.inputFormData);
    }

    IStep5() {
        return `
           interface {
                /**
                * @uiLabel -  ${this._("w_ViewPTW_Step5_UploadFiles")}
                * @uiType - iv-form-file
                */
                file?:file
            }
       `;
    }
}

export default Step5;
Vue.component("step5", Step5);
</script>

<style lang="scss" scoped>
ul {
    li {
        margin: 20px;
    }
}
</style>
