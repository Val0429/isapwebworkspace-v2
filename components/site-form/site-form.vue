<template>
    <iv-form-quick
        ref="site-form"
        >
    <!-- 50) custom view templates with <template #view.* /> -->
    <template #view.case_status="{$attrs, $listeners}">
        <span v-if="$attrs.value">{{ $attrs.value == 1 ? _('w_Status_On') : _('w_Status_Off') }}</span>
    </template>
    <!-- 51) custom edit / add template with <template #add.* /> -->
    </iv-form-quick>
</template>

<script lang="ts" src="./site-form.vue.ts" />