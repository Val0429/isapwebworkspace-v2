<template>
    <iv-form-quick
        ref="user-list"
        @mounted="doMounted"
    >
        <!-- 50) custom view templates with <template #view.* /> -->
        <template #view.data="{$attrs, $listeners}">
            <div
                v-for="g in $attrs.value.groups"
                :key="g.objectId"
            >
                {{ g.name }}
            </div>
        </template>
        <!-- 51) custom edit / add template with <template #add.* /> -->
    </iv-form-quick>
</template>

<script lang="ts" src="./users-list-form.vue.ts" />