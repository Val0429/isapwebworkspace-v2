<template>
    <iv-form-quick
        ref="user-list"
        @update:*="updateData"
        >
    <!-- 50) custom view templates with <template #view.* /> -->
    <template #view.groups="{$attrs, $listeners}">
        {{ $attrs.value[0].groupname }}
    </template>
    <!-- 51) custom edit / add template with <template #add.* /> -->
    </iv-form-quick>
</template>

<script lang="ts" src="./users-list-form.vue.ts" />