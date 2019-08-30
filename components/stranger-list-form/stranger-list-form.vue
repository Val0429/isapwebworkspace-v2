<template>
    <iv-form-quick
        ref="quick"
        >
    <!-- 50) custom view templates with <template #view.* /> -->
    <template #view.snapshot="{$attrs}">
        <img :src="getSnapshotUrl($attrs.value)" style="max-width:50px; max-height: 50px;" />
    </template>
    <!-- 51) custom edit / add template with <template #add.* /> -->
    </iv-form-quick>
</template>

<script lang="ts" src="./stranger-list-form.vue.ts" />