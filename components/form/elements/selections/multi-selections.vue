<template>
    <b-form-group
        v-bind:id="'form-group-' + _uid"
        v-bind:label="label"
        v-bind:label-for="'input-' + _uid"
        >
        <b-row>            
        <b-col class="card option-box">
            <div  v-for="option in leftOptions" v-bind:key="option.key">
                <b-form-checkbox :id="option.key" v-model="option.checked">
                    {{option.value}}
                </b-form-checkbox>
                
            </div>                
        </b-col>
        <b-col md="1" >
            <b-button class="bt-left-right" @click="goToRight()">&rarr;</b-button>
            <b-button class="bt-left-right" @click="goToLeft()"> &larr;</b-button>
        </b-col>
        <b-col class="card option-box">
            <div  v-for="option in rightOptions" v-bind:key="option.key">
                <b-form-checkbox :id="option.key" v-model="option.checked">
                    {{option.value}}
                </b-form-checkbox>
            </div>                
        </b-col>
        </b-row>

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
    min-height:80px;
    max-height:200px;
    overflow-y:scroll;
}
.bt-left-right{
    margin: 2px;
    width: 50px;
}
</style>

