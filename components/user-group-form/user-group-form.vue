<template>
    <iv-form-quick
        ref="group-list"
        @update:*="updateData"
        >
    <!-- 50) custom view templates with <template #view.* /> -->
    <!-- 51) custom edit / add template with <template #add.* /> -->
    </iv-form-quick>
</template>

<script lang="ts" src="./user-group-form.vue.ts" />