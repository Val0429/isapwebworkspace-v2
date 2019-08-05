<template>
    <div class="animated fadeIn">
        <b-row class="col-12">
            <b-col
                cols="6"
                class="dashboard-col"
            >
                <div class="dashboard-view">
                    <b-row>
                        <b-col cols="2">
                            <i class="fa fa-user dashboard-icon"></i>
                        </b-col>
                        <b-col cols="10">
                            <b-row>
                                {{ visitorOnSite }}
                            </b-row>
                            <b-row>
                                {{ _('w_Dashboard_VisitorOnSite') }}
                            </b-row>
                        </b-col>
                    </b-row>
                </div>
            </b-col>

            <b-col
                cols="6"
                class="dashboard-col"
            >
                <div class="dashboard-view">
                    <b-row>
                        <b-col cols="2">
                            <i class="fa fa-users dashboard-icon"></i>
                        </b-col>
                        <b-col cols="10">
                            <b-row>
                                {{ dailyTotalVisitor }}
                            </b-row>
                            <b-row>
                                {{ _('w_Dashboard_dailyTotalVisitor') }}
                            </b-row>
                        </b-col>
                    </b-row>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
    components: {}
})
export class Dashboard extends Vue {
    // Prop
    @Prop({
        type: Number,
        default: 0
    })
    visitorOnSite: number;

    // Prop
    @Prop({
        type: Number,
        default: 0
    })
    dailyTotalVisitor: number;

    created() {}

    mounted() {}
}
export default Dashboard;
Vue.component("dashboard", Dashboard);
</script>

<style lang="scss" scoped>
.dashboard-col {
    padding: 5px;
    margin-bottom: 20px;
    .dashboard-view {
        padding: 20px 10px;
        border: solid 1px #000;
        border-radius: 5px;
        .dashboard-icon {
            font-size: 3em;
            margin-left: 10px;
        }
    }
}
</style>

