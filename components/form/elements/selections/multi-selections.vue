<template>
    <b-form-group
        v-bind:id="'form-group-' + _uid"
        v-bind:label="label"
        v-bind:label-for="'input-' + _uid"
        >
        <div class="input-group">            
        <div class="option-box card col-md-5">
            <div  v-for="option in leftOptions" v-bind:key="option.key">
                <input type="checkbox" :id="option.key" v-model="option.checked"/>
                <label :for="option.key">{{option.value}}</label>
            </div>                
        </div>
        <div class="card col-md-1">
            <button @click="goToRight()">&rarr;</button>
            <button @click="goToLeft()"> &larr;</button>
        </div>
        <div class="option-box card col-md-5" >
            <div  v-for="option in rightOptions" v-bind:key="option.key">
                <input type="checkbox" :id="option.key" v-model="option.checked"/>
                <label :for="option.key">{{option.value}}</label>
            </div>                
        </div>
        </div>

        <b-form-invalid-feedback v-if="this.invalid">
            {{ this.invalid }}
        </b-form-invalid-feedback>
    </b-form-group>
</template>

<script lang="ts" src="./multi-selections.vue.ts" />

<style lang="scss" scoped>
.form-control {
    border-radius: 4px;
}
.option-box{
    max-height:200px;
    overflow-y:scroll;
}
</style>

