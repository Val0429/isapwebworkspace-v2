<template>
    <iv-form-quick
        ref="user-list"
        @update:*="updateData()"
        @mounted="doMounted"
        >
    <!-- 50) custom view templates with <template #view.* /> -->
    <template #view.roles="{$attrs, $listeners}">
        <div v-for="item in $attrs.value" :key="item.objectId">
            {{ item.name }}
        </div>
    </template>
    <!-- 51) custom edit / add template with <template #add.* /> -->
    <template #edit.roles="{$attrs, $listeners}">
        {{ $attrs }}
        <!-- <div v-for="item in $attrs.value" :key="item.objectId">
            {{ item.name }}
        </div> -->
    </template>
    </iv-form-quick>
</template>

<script lang="ts" src="./users-list-form.vue.ts" />