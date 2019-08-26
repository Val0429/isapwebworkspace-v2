<template>
    <iv-modal
        :visible.sync="visible"
        :label="_('w_Dialog_ErrorTitle')"
        @update:visible="doUpdateVisible"
    >
        <div
            class="content"
            v-html="content"
        />
        <template #footer>
            <b-button
                size="lg"
                @click="doUpdateVisible(false)"
            >{{ _("w_Confirm") }}</b-button>
        </template>
    </iv-modal>
</template>

<script lang="ts" src="./Error.vue.ts" />

<style lang="scss" scoped>
.content {
    margin-bottom: 30px;
}
</style>