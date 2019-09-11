<template>
    <iv-form-quick
        ref="account-list"
        @mounted="doMounted"
        @update:*="updateData($event)"
    >
        <!-- 50) custom view templates with <template #view.* /> -->
        <template #view.floors="{ $attrs, $listeners}">
            <ul v-if="$attrs.value">
                <li
                    v-for="f in $attrs.value"
                    :key="f.objectId"
                >
                    {{ f.name }}
                </li>
            </ul>
        </template>
        <template #view.company="{ $attrs, $listeners}">
            <ul v-if="$attrs.value">
                <li>
                    {{ $attrs.value.name }}
                </li>
            </ul>
        </template>
        <template #view.actions="{ $attrs, $listeners}">
            {{ $attrs.value }}
        </template>
        <!-- 51) custom edit / add template with <template #add.* /> -->
    </iv-form-quick>
</template>

<script lang="ts" src="./account-list-form.vue.ts" />