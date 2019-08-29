<template>
    <iv-form-quick
        ref="person-list"
        @update:*="updateData()"
        >
    <!-- 50) custom view templates with <template #view.* /> -->
    <template #view.photo_base64="{$attrs, $listeners}">
        <div class="user-photo">
            <img :src="'data:image/jpg;base64,' + $attrs.value" alt="">
        </div>
    </template>
    <template #view.actions>
        <ivc-toolbox-actions
            @click="readMore"
            />
    </template>
    <!-- 51) custom edit / add template with <template #add.* /> -->
    </iv-form-quick>
</template>

<script lang="ts" src="./person-list-form.vue.ts" />