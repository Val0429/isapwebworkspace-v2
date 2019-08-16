<template>
    <iv-form-string
        v-bind="$attrs"
        v-bind:label="label"
        v-bind:value="value"
        v-on:input="$emit('input', $event)"
        v-bind:placeholder="placeholder"
        :invalid="invalid"
        v-emailfilter
    />
</template>

<script lang="ts" src="./form-email.vue.ts" />
