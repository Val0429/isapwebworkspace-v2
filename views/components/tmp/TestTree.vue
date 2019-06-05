<template>
    <iv-form-quick-tree>
        <!-- 5) custom view templates with <template #view.* /> -->
        <template #view.title="{$attrs}">
            {{ $attrs.name }}
        </template>

        <!-- 6) custom edit / add template with <template #add.* /> -->

    </iv-form-quick-tree>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, toEnumInterface, Prop } from "@/../core";
import { EFormQuickTree, IFormQuickTree } from '@/../components/form';
/// 0) config server
import SmartCommunityServer from "@/config/default/server";
const server = SmartCommunityServer.getDefault();

@Component
/// 1) class name
export default class TestTree extends Vue implements IFormQuickTree {
    /// 2) cgi path
    path: string = "/test/region";
    groupByField: string = "pid";
    @Prop({
        type: String,
        required: true,
    })
    groupBy: string;
    /// 3) i18n - view / edit / add
    tView: string = "w_TestMe";
    tAdd: string = "w_TestMeAdd";
    tEdit: string = "w_TestMeEdit";
    /// 4) possibility - edit / add / delete
    canAdd: boolean = true;
    canEdit: boolean = true;
    canDelete: boolean = true;
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuickTree) {
        switch (type) {
            case EFormQuickTree.Add:
            case EFormQuickTree.Edit:
                return `
                interface {
                    name: string;
                    description: string;
                }
                `;
        }
    }
    /// 7) pre-add 新增欄位的default值
    preAdd() {
        return;
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
        return;
    }
    /// Done

    private server = server;
}
</script>