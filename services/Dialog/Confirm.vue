<template>
    <iv-modal
        :visible.sync="visible"
        :label="label"
        @update:visible="doUpdateVisible"
    >
        <div
            class="content"
            v-html="content"
        />
        <template #footer>
            <b-button
                size="lg"
                variant="default"
                @click="doUpdateVisible(false)"
            >{{ _("w_Cancel") }}</b-button>
            <b-button
                size="lg"
                variant="secondary"
                @click="clickConfirm()"
            >{{ _("w_Confirm") }}</b-button>
        </template>
    </iv-modal>
</template>

<script lang="ts" src="./Confirm.vue.ts" />

<style lang="scss" scoped>
.content {
    margin-bottom: 30px;
}
</style>