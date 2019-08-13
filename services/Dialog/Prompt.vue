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
                v-for="(value, index) in options"
                :key="'button' + index"
                size="lg"
                variant="secondary"
                @click="clickConfirm(index)"
            >{{value}}</b-button>
        </template>
    </iv-modal>
</template>

<script lang="ts" src="./Prompt.vue.ts" />

<style lang="scss" scoped>
.content {
    margin-bottom: 30px;
}
</style>