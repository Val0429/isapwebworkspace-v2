<template>
    <iv-form-quick
        ref="quick"
        @update:*="updateData"
        >
    <!-- 50) custom view templates with <template #view.* /> -->
    <template #view.service="{$attrs, $listeners}">
        <div v-if="$attrs.value">{{ $attrs.value ? '是' : '否' }}</div>
        <div v-else> - </div>
    </template>
    <!-- 51) custom edit / add template with <template #add.* /> -->
    </iv-form-quick>
</template>

<script lang="ts" src="./stranger-list-form.vue.ts" />