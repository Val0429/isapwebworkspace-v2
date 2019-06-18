<template>
    <b-form-group
        v-bind:id="'form-group-' + _uid"
        v-bind:label="label"
        v-bind:label-for="'input-' + _uid"
        >
        <div class="input-group">            
        <div class="card col-md-5">
            <div  v-for="option in leftOptions" v-bind:key="option.key">
                <input type="checkbox" :id="option.key" v-model="option.checked"/>
                <label :for="option.key">{{option.value}}</label>
            </div>                
        </div>
        <div class="card col-md-1">
            <button @click="goToRight()">&rarr;</button>
            <button @click="goToLeft()"> &larr;</button>
        </div>
        <div class="card col-md-5">
            <div  v-for="option in rightOptions" v-bind:key="option.key">
                <input type="checkbox" :id="option.key" v-model="option.checked"/>
                <label :for="option.key">{{option.value}}</label>
            </div>                
        </div>
        </div>
         <!-- <b-form-input
            v-bind="{ ...$attrs, class: undefined }"
            v-bind:id="'input-' + _uid"
            v-bind:value="value"
            v-bind:placeholder="placeholder"
            v-on:input="$emit('input', $event)"
            />  -->

        <b-form-invalid-feedback v-if="this.invalid">
            {{ this.invalid }}
        </b-form-invalid-feedback>
    </b-form-group>
</template>

<script lang="ts" src="./form-permission.vue.ts" />

<style lang="scss" scoped>
.form-control {
    border-radius: 4px;
}
</style>

