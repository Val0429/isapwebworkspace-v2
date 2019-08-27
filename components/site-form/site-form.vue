<template>
    <iv-form-quick
        ref="area-site"
        @update:*="updateData"
        >
    <!-- 50) custom view templates with <template #view.* /> -->
    <!-- 51) custom edit / add template with <template #add.* /> -->
    </iv-form-quick>
</template>

<script lang="ts" src="./site-form.vue.ts" />