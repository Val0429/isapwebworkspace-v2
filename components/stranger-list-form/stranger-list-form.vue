<template>
    <iv-form-quick
        ref="quick"
        @update:*="updateData()"
        >
    <!-- 50) custom view templates with <template #view.* /> -->
    <!-- 51) custom edit / add template with <template #add.* /> -->
    </iv-form-quick>
</template>

<script lang="ts" src="./stranger-list-form.vue.ts" />