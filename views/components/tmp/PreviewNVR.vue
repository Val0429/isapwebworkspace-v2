<template>
    <iv-form-quick-preview>
        <!-- 5) custom view templates with <template #view.* /> -->

        <!-- 6) custom edit / add template with <template #add.* /> -->

    </iv-form-quick-preview>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, toEnumInterface } from "@/../core";
import { EFormQuickPreview, IFormQuickPreview } from '@/../components/form';
/// 0) config server
import SmartCommunityServer from "@/config/default/server";
const server = SmartCommunityServer.getDefault();

@Component
/// 1) class name
export default class PreviewNVR extends Vue implements IFormQuickPreview {
    /// 2) cgi path
    path: string = "/test/me";
    /// 3) i18n - view / edit / add
    tView: string = "w_TestMe";
    tPreview: string = "w_TestMeAdd";
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuickPreview) {
        switch (type) {
            case EFormQuickPreview.View:
                return `
                interface {
                    teststr: string;
                    testnumber: number;
                    /**
                     * @uiType - iv-cell-switch
                     */
                    testboolean: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                }

                `;
            case EFormQuickPreview.Preview:
                return `
                interface {
                    /**
                     * @uiType - iv-form-label
                     */
                    teststr: string;
                    /**
                     * @uiType - iv-form-label
                     */
                    testnumber: number;
                    /**
                     * @uiType - iv-form-switch
                     * @uiEnabled - false
                     */
                    testboolean: boolean;
                }
                `;
        }
    }
    /// 9) pre-edit 送去修改表單前要做甚麼調整
    prePreview(row) {
        return {
            ...row,
            teststr: '*****'
        }
    }
    /// Done

    private server = server;
}
</script>


<style lang="scss" scoped>
</style>

