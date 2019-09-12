<template>
    <iv-form-quick
        ref="blacklist"
        @update:*="doSubmit($event)"
    >
        <!-- 50) custom view templates with <template #view.* /> -->
        <template #view.imageBase64="{ $attrs }">
            <img :src="$attrs.value" />
        </template>
        <!-- 51) custom edit / add template with <template #add.* /> -->
    </iv-form-quick>
</template>

<script lang="ts" src="./blacklist-form.vue.ts" />