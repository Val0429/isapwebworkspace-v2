<template>
    <div>
        <iv-form
            :interface="IStep5()"
            :value="inputFormData"
            @update:file="putFile($event)"
        >
            <template #file="{$attrs, $listeners}">
<!--                <ul >-->
<!--                    <span>{{_('w_ViewPTW_Step5_SupportingDocuments')}}</span>-->
<!--                    　<li>{{_('w_ViewPTW_Step5_RiskAssessment')}}</li>-->
<!--                    　<li>{{_('w_ViewPTW_Step5_MethodOfStatement')}}</li>-->
<!--                    　<li>{{_('w_ViewPTW_Step5_SafeWorkProcedure')}}</li>-->
<!--                    　<li>{{_('w_ViewPTW_Step5_AnyRelevantLicensesOrPasses')}}</li>-->
<!--                    　<li>{{_('w_ViewPTW_Step5_BizsafeCertificate')}}</li>-->
<!--                    　<li>{{_('w_ViewPTW_Step5_Others')}}</li>-->
<!--                </ul>-->
                <ul :hidden="!permission">
                    <span>{{_('w_ViewPTW_Step5_SupportingDocument')}}</span>
                    　<li>{{_('w_ViewPTW_Step5_Forms')}}</li>
                    　<li>{{_('w_ViewPTW_Step5_License')}}</li>
                    　<li>{{_('w_ViewPTW_Step5_Others')}}</li>
                </ul>
                <iv-form-file
                    v-bind="$attrs"
                    v-on="$listeners"
                    :disabled="true"
                    multiple
                    accept=".jpeg,.jpg, .png, .pdf"
                    value="file"
                ></iv-form-file>

            </template>
        </iv-form>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

@Component({
    components: {}
})
export class ViewStep5 extends Vue {
    // Prop
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {}
    })
    selectedDetail: any;

    @Prop({
        type: Boolean,
        default: function() {
            return false;
        }
    })
    permission: boolean;

    inputFormData: any = {
        file: null
    };

    created() {}

    mounted() {}

    putFile(data) {
        console.log("putFile", data);

        // Min 收 base64 的 string[]
        this.$emit("putStep5File", data);
    }

    IStep5() {
        return `
           interface {
                /**
                * @uiLabel -  ${this._("w_ViewPTW_Step5_UploadFiles")}
                * @uiPlaceHolder -   ${this._("w_ViewPTW_Step5_supported")}
                * @uiType - iv-form-file
                */
                file?:file
            }
       `;
    }
}

export default ViewStep5;
Vue.component("view-step5", ViewStep5);
</script>

<style lang="scss" scoped>
ul {
    span {
        margin-left: -25px;
    }
    li {
        margin-top: 20px;
    }
}

.font-red {
    color: red;
}
</style>
