<template>
    <iv-form-quick>
        <!-- 5) custom view templates with <template #view.* /> -->
        <template #view.roles="{$attrs, $listeners}">
            {{ $attrs.value.map(v => v.name).join(", ") }}
        </template>

        <template #view.title="{$attrs, $listeners}">
            {{ $attrs.value }}
        </template>

        <template #view.buttons="{$attrs, $listeners}">
            <img style="max-height: 100px; max-width: 100px" src="https://res.klook.com/image/upload/fl_lossy.progressive/q_auto/f_auto/c_fill/blogen/5-taipei-hotspots-new-cover.png" />
        </template>

        <!-- 6) custom edit / add template with <template #add.* /> -->

    </iv-form-quick>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, toEnumInterface } from "@/../core";
import { EFormQuick, IFormQuick } from '@/../components/form';
/// 0) config server
import SmartCommunityServer from "@/config/default/server";
const server = SmartCommunityServer.getDefault();

@Component
/// 1) class name
export default class Announcements extends Vue implements IFormQuick {
    /// 2) cgi path
    path: string = "/announcements";
    /// 3) i18n - view / edit / add
    tView: string = "w_Announcements";
    tAdd: string = "w_AnnouncementsAdd";
    tEdit: string = "w_AnnouncementsEdit";
    /// 4) possibility - edit / add / delete
    canAdd: boolean = true;
    canEdit: boolean = true;
    canDelete: boolean = true;
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {
                    /**
                     * @uiLabel - ${this._("wb_Back")}
                     */
                    objectId: string;
                    title: string;
                    content: string;
                    createdAt: Date;
                    updatedAt: Date;

                    buttons: any;
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    /**
                     * @uiType - iv-form-label
                     */
                    title: string;
                    content: string;
                }
                `;
        }
    }
    /// 7) pre-add 新增欄位的default值
    preAdd() {
        return {
            title: "iSAP"
        };
    }
    /// 8) post-add 寫入新增前要做甚麼調整
    postAdd(row) {
        return;
    }
    /// 9) pre-edit 送去修改表單前要做甚麼調整
    preEdit(row) {
        return;
    }
    /// 10) post-edit 寫入修改前要做甚麼調整
    postEdit(row) {
        return {
            objectId: row.objectId,
            title: row.title,
            content: row.content
        }
    }
    /// Done

    private server = server;
}
</script>


<style lang="scss" scoped>
</style>

