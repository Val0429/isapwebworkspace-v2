<template>
    <div class="dashboardDiv">
        <div class="row col-lg-12">
            <div class="col-lg-4 col-sm-4 col-xs-1 col-xxs-1 submitted">
                <span class="title">{{_('w_Dashboard_Submitted')}}</span><br>
                <span class="value">{{data.submitted}}</span>
            </div>
            <!--/col-->
            <div class="col-lg-4 col-sm-4 col-xs-1 col-xxs-1 approved">
                <span class="title">{{_('w_Dashboard_Approved')}}</span><br>
                <span class="value">{{data.approved}}</span>
            </div>
            <!--/col-->
            <div class="col-lg-4 col-sm-4 col-xs-1 col-xxs-1 awaitingApproval">
                <span class="title">{{_('w_Dashboard_AwaitingApproval')}}</span><br>
                <span class="value">{{data.awaitingApproval}}</span>
            </div>
            <!--/col-->
        </div>
        <!-- /row -->

        <div class="row col-lg-12">
            <div class="col-lg-12 col-sm-12 col-xs-4 col-xxs-4 total">
                <span class="title">{{_('w_Dashboard_Total')}}</span><br>
                <span class="value">{{data.total}}</span>
            </div>
            <!--/col-->
        </div>
        <!-- /row -->
    </div>
</template>

<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Emit,
    Model,
    Watch
} from "vue-property-decorator";

interface IDashboardData {
    submitted: number;
    approved: number;
    awaitingApproval: number;
    total: number;
}

@Component({
    components: {}
})
export class SubmittedDashBoard extends Vue {
    // Prop
    @Prop({
        type: Object,
        default: {}
    })
    data: IDashboardData;

    created() {}

    mounted() {}
}

export default SubmittedDashBoard;
Vue.component("submitted-dashboard", SubmittedDashBoard);
</script>

<style lang="scss" scoped>
.dashboardDiv {
    padding-top: 30px;
    padding-bottom: 30px;
    .title {
        height: 30%;
        color: white;
        font-size: 200%;
        height: 100px;
        text-align: left;
        display: inline-block;
        line-height: 50px;
    }
    .value {
        color: white;
        font-size: 500%;
        text-align: center;
        display: block;
        margin-top: -5px;
    }
}

.submitted {
    background-color: #b870b8;
    height: 200px;
}

.approved {
    background-color: #6a6a6a;
    height: 200px;
}

.awaitingApproval {
    background-color: #fabc78;
    height: 200px;
}

.total {
    background-color: #1166a9;
    height: 200px;
}
</style>
