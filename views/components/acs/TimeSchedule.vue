<template >

     <div key="main">
         
            <iv-table
            :server="{ path: '/acs/timeschedule' }"
            :interface="inf()"
            >
                <template #schedule="{$attrs,$listeners}">
                    {{!$attrs.value || $attrs.value.length==0 ? '' : $attrs.value.map(x=> _("day"+x.weekday) +" "+x.starttime+"-"+x.endtime).join(", ")}}
                </template>
            </iv-table>

        
    </div>
</template>
           

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

@Component
export default class TimeSchedule extends Vue {
    
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
        
    }
    inf(){
        return `
        
                interface {
                /**
                * @uiLabel - ${this._("schedule")}
                */
                schedule:string;
                /**
                * @uiLabel - ${this._("timeid")}
                */
                timeid :string;
                /**
                * @uiLabel - ${this._("timename")}
                */
                timename :string;
                /**
                * @uiLabel - ${this._("status")}
                */
                status	:number;
                /**
                * @uiLabel - ${this._("createdAt")}
                */
                createdAt:Date;
                /**
                * @uiLabel - ${this._("updatedAt")}
                */
                updatedAt:Date;
                }
        `;
    }
}
</script>
