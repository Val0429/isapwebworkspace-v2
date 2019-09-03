<template>
    <iv-route-transition>
        <div key="main">
            <ivc-sites-map
                :newLocalData="newLocalData"
                :isClick="isClick"
                @isMove="isMove"
            />
            <div class="sites-list">
                <div class="d-flex flex-row sites-list-head">
                    <dl
                        class="col-md-3 px-3 py-1 my-5 border-left"
                        :class="`${ index == 1 ? 'border-primary' : index == 2 ? 'border-success' : index == 3 ? 'border-info' : 'border-danger' }`"
                        v-for="(item, index) in sites_list_head"
                        :key="'list_head' + (index ++)"
                    >
                        <dt class="text-muted font-weight-normal">
                            {{ item['title'] }}
                        </dt>
                        <dd class="text-black font-weight-bold mb-0">
                            {{ item['sum_number'] }}
                        </dd>
                    </dl>
                </div>
                <div class="d-flex flex-row mb-4 sites-list-body">
                    <div class="col-md-3">
                        <dl
                            class="d-flex flex-row justify-content-between mb-4"
                            v-for="item in sites_list_body"
                            :key="'noofperson_' + item.objectId"
                            @click="getLocal([item.latitude, item.longitude])"
                        >
                            <dt class="font-weight-normal">
                                {{ item.name }}
                            </dt>
                            <dd class="text-right">
                                {{ item.noofperson }}
                            </dd>
                        </dl>
                    </div>
                    <div class="col-md-3">
                        <dl
                            class="d-flex flex-row justify-content-between mb-4"
                            v-for="item in sites_list_body"
                            :key="'noofperson_' + item.objectId"
                            @click="getLocal([item.latitude, item.longitude])"
                        >
                            <dt class="font-weight-normal">
                                {{ item.name }}
                            </dt>
                            <dd class="text-right">
                                {{ item.noofentry }}
                            </dd>
                        </dl>
                    </div>
                    <div class="col-md-3">
                        <dl
                            class="d-flex flex-row justify-content-between mb-4"
                            v-for="item in sites_list_body"
                            :key="'noofperson_' + item.objectId"
                            @click="getLocal([item.latitude, item.longitude])"
                        >
                            <dt class="font-weight-normal">
                                {{ item.name }}
                            </dt>
                            <dd class="text-right">
                                {{ item.noofleave }}
                            </dd>
                        </dl>
                    </div>
                    <div class="col-md-3">
                        <dl
                            class="d-flex flex-row justify-content-between mb-4"
                            v-for="item in sites_list_body"
                            :key="'noofperson_' + item.objectId"
                            @click="getLocal([item.latitude, item.longitude])"
                        >
                            <dt class="font-weight-normal">
                                {{ item.name }}
                            </dt>
                            <dd class="text-right">
                                {{ item.noofexception }}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </iv-route-transition>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";

interface IRtn {
    title: string;
    sum_number: number;
}

@Component
export default class Components extends Vue {
    private newLocalData: any[] = [];
    private isClick: boolean = false;
    private sites_list_head: IRtn[] = [
        {
            title: "現在人數",
            sum_number: 0
        },
        {
            title: "進入人數",
            sum_number: 0
        },
        {
            title: "離開人數",
            sum_number: 0
        },
        {
            title: "異常提醒",
            sum_number: 0
        }
    ];
    private sites_list_body: any[] = [];
    private getLocal(arg) {
        this.newLocalData = arg;
        this.isClick = true;
    }
    private isMove(val: boolean) {
        this.isClick = !val;
    }
    private async mounted() {
        let sitesList = await this.$server.R("/continental/sites", {
            paging: { pageSize: 10 }
        });
        this.sites_list_body = sitesList["results"];
    }
}
</script>
<style lang="scss" scoped>
.sites-list-head {
    dl {
        margin-left: 3px;
        position: relative;
        &.border-left {
            border-left-width: 3px !important;
        }
        &::after {
            width: calc(100% - 1rem);
            height: 0;
            content: "";
            border-top: {
                width: 1px;
                style: solid;
                color: #d1d4d7;
            }
            margin: 1rem 0 1rem calc(-1rem - 3px);
            position: absolute;
            left: 1rem;
            display: block;
        }
        dd {
            font-size: 20px;
        }
    }
}
</style>