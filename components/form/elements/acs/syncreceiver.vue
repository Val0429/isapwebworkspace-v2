<template>
    <b-form-group
        v-bind:id="'form-group-' + _uid"
        v-bind:label="label"
        v-bind:label-for="'input-' + _uid"
        >
        <b-button size="md" @click="moreItem()">{{_("w_Add")}}</b-button>
        <div class="card col-md-6" v-for="item in items"  v-bind:key="item.id">
            <label>  {{_("receivename")}}</label><input type="string" v-model="item.receivename" @change="update()"/>
            <label>  {{_("emailaddress")}}</label>  <input type="string" v-model="item.emailaddress" @change="update()"/>                
        </div>
         
        <b-form-invalid-feedback v-if="this.invalid">
            {{ this.invalid }}
        </b-form-invalid-feedback>
    </b-form-group>
</template>

<script lang="ts" src="./syncreceiver.vue.ts" />

<style lang="scss">

</style>

