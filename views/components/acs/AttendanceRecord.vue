<template >

     <div key="main">
         
            <iv-table
            :server="{ path: '/report/attendancerecord' }"
            :interface="inf()"
            >
                <!-- <template #schedule="{$attrs,$listeners}">
                    {{!$attrs.value || $attrs.value.length==0 ? '' : $attrs.value.map(x=> _("day"+x.weekday) +" "+x.starttime+"-"+x.endtime).join(", ")}}
                </template> -->
            </iv-table>

        
    </div>
</template>
           

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

@Component
export default class AttendanceRecord extends Vue {
    
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
        
    }
    inf(){
        return `        
                interface {
                }
        `;
    }
}
</script>
