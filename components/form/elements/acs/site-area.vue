<template>
    <b-form-group
        v-bind:id="'form-group-' + _uid"
        v-bind:label="label"
        v-bind:label-for="'input-' + _uid"
        >
             <iv-form
             :value="siteArea"
             @update:site="updateArea($event)"
             @update:area="update($event)"
             :interface="inf()"
             />
        <b-form-invalid-feedback v-if="this.invalid">
            {{ this.invalid }}
        </b-form-invalid-feedback>
    </b-form-group>
</template>

<script lang="ts" src="./site-area.vue.ts" />

<style lang="scss">

</style>

