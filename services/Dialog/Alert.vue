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
                @click="doUpdateVisible(false)"
            >{{ _("w_Confirm") }}</b-button>
        </template>
    </iv-modal>
</template>

<script lang="ts" src="./Alert.vue.ts" />

<style lang="scss" scoped>
.content {
    margin-bottom: 30px;
}
</style>