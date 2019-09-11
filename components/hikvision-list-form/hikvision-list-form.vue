<template>
    <iv-form-quick
        ref="account-list"
        @update:*="doSubmit($event)"
    >
        <!-- 50) custom view templates with <template #view.* /> -->
        <!-- 51) custom edit / add template with <template #add.* /> -->
    </iv-form-quick>
</template>

<script lang="ts" src="./hikvision-list-form.vue.ts" />