<template>
     <div key="main">


        <iv-table
            :server="{ path: '/acs/door' }"
            :interface="inf()"            
            />
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

@Component
export default class Door extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
        console.log(this.inf());
    }
    inf(){
        
        return `interface {
                /**
                * @uiLabel - ${this._("system")}
                */
                system:string;
                /**
                * @uiLabel - ${this._("doorid")}
                */
                doorid:string;
                /**
                * @uiLabel - ${this._("doorname")}
                */
                doorname:string;
                /**
                * @uiLabel - ${this._("unlocktime")}
                */
                unlocktime:string;
                /**
                * @uiLabel - ${this._("shunttime")}
                */
                shunttime:string;
                /**
                * @uiLabel - ${this._("status")}
                */
                status:number;
                /**
                * @uiLabel - ${this._("createdAt")}
                */
                createdAt:Date;
                /**
                * @uiLabel - ${this._("updatedAt")}
                */
                updatedAt:Date;
            }`;
    }
}
</script>
