<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >
            <div
                key="transition_1"
                v-show="transition.step === 1"
                class="demo-region-tree-select"
            >
                <b-button @click="pageToChooseTree">
                    Choose region tree
                </b-button>
                <div
                    v-for="value in selecteds"
                    v-html="`objectid : ${value.objectId}, name: ${value.name}, type: ${value.type} <br/>`"
                    class="demo-region-tree-select-result"
                >
                </div>
            </div>
            <div
                class="col-md-8"
                key="transition_2"
                v-show="transition.step === 2"
            >
                <region-tree-select
                    v-on:click-back="pageToShowResult"
                    :multiple="true"
                    :regionTreeItem="regionTreeItem"
                    :selectType="selectType"
                    :selecteds="selecteds"
                >
                </region-tree-select>
            </div>
        </iv-auto-transition>
    </div>
</template>


<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Vue
import  RegionTreeSelect from "@/components/RegionTree/RegionTreeSelect.vue";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Region Tree
import {
    RegionTreeItem,
    ERegionType,
    IRegionItem,
    IRegionTreeSelected
} from "@/components/RegionTree";

// Service
import RegionAPI from "@/components/RegionTree/models/RegionAPI";

@Component({
    components: {
        RegionTreeSelect
    }
})
export default class DemoRegionTreeSelect extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    selectType = ERegionType.globe;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [
        { objectId: "znIPgBUWGE", type: ERegionType.area, name: "test" },
        { objectId: "Q5PeK0lvFC", type: ERegionType.area, name: "Arrea" },
        { objectId: "yf6yra0jiw", type: ERegionType.site, name: "台北旗艦店" },
        { objectId: "Guwl8gq7yq", type: ERegionType.globe, name: "Morris-1-1" },
        {
            objectId: "YwQ3wndke6",
            type: ERegionType.globe,
            name: "Morris 1-1-1"
        },
        { objectId: "xbTg9WCcES", type: ERegionType.site, name: "大雅店" }
    ];

    created() {
        this.initRegionTreeSelect();
    }

    mounted() {}

    pageToShowResult() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
    }

    pageToChooseTree() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    initRegionTreeSelect() {
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = "Demo Region Tree Select";
        this.regionTreeItem.tree = RegionAPI.analysisApiResponse(this.apiDemo);
    }

    apiDemo = {
        objectId: "fcicCUg4EQ",
        parentId: "",
        type: "root",
        data: {
            name: "iSAP",
            customId: "",
            address: "",
            tags: [
                {
                    objectId: "kKq1G6VAMa",
                    name: "新開幕"
                }
            ],
            imageSrc: "images/fcicCUg4EQ_location_region_1559010818873.jpeg",
            longitude: 0,
            latitude: 0
        },
        lft: 1,
        rgt: 22,
        childrens: [
            {
                objectId: "a3HzMbrSVF",
                parentId: "fcicCUg4EQ",
                type: "site",
                data: {
                    name: "8888",
                    customId: "9",
                    address: "78",
                    tags: [
                        {
                            objectId: "4SgdtSjDdi",
                            name: "旗艦店"
                        },
                        {
                            objectId: "bm6VUIvJTy",
                            name: "Outlet"
                        },
                        {
                            objectId: "VSNkFzOEx0",
                            name: "直營店"
                        }
                    ],
                    imageSrc:
                        "images/a3HzMbrSVF_location_site_1559184420598.jpeg",
                    longitude: 6,
                    latitude: 8
                },
                lft: 1,
                rgt: 22,
                childrens: [
                    {
                        objectId: "znIPgBUWGE",
                        parentId: "a3HzMbrSVF",
                        type: "area",
                        data: {
                            name: "test",
                            imageSrc:
                                "images/znIPgBUWGE_location_area_image_1559202921773.jpeg",
                            mapSrc:
                                "images/znIPgBUWGE_location_area_map_1559202921773.jpeg"
                        },
                        lft: 1,
                        rgt: 22,
                        childrens: []
                    },
                    {
                        objectId: "Q5PeK0lvFC",
                        parentId: "a3HzMbrSVF",
                        type: "area",
                        data: {
                            name: "Arrea",
                            imageSrc:
                                "images/Q5PeK0lvFC_location_area_image_1559528056475.jpeg",
                            mapSrc:
                                "images/Q5PeK0lvFC_location_area_map_1559528056475.jpeg"
                        },
                        lft: 1,
                        rgt: 22,
                        childrens: []
                    }
                ]
            },
            {
                objectId: "xPNATnQp3K",
                parentId: "fcicCUg4EQ",
                type: "none",
                data: {
                    name: "Morris-1",
                    customId: "Morris-1 ID",
                    address: "Morris-1 A",
                    tags: [],
                    imageSrc:
                        "images/xPNATnQp3K_location_region_1559524457060.jpeg",
                    longitude: 121,
                    latitude: 24
                },
                lft: 8,
                rgt: 19,
                childrens: [
                    {
                        objectId: "6ReGCtKjmA",
                        parentId: "xPNATnQp3K",
                        type: "site",
                        data: {
                            name: "松高店",
                            customId: "S-00015",
                            address: "1-1",
                            tags: [
                                {
                                    objectId: "ihOiVjw7ob",
                                    name: "leval 21"
                                }
                            ],
                            imageSrc:
                                "images/6ReGCtKjmA_location_site_1559112665163.gif",
                            longitude: 121.511177,
                            latitude: 25.0497392
                        },
                        lft: 8,
                        rgt: 19,
                        childrens: []
                    },
                    {
                        objectId: "Guwl8gq7yq",
                        parentId: "xPNATnQp3K",
                        type: "none",
                        data: {
                            name: "Morris-1-1",
                            customId: "Morris-1-1 ID",
                            address: "Morris-1-1 A",
                            tags: [],
                            imageSrc:
                                "images/Guwl8gq7yq_location_region_1559524494561.jpeg",
                            longitude: 84,
                            latitude: 25
                        },
                        lft: 9,
                        rgt: 14,
                        childrens: [
                            {
                                objectId: "yf6yra0jiw",
                                parentId: "Guwl8gq7yq",
                                type: "site",
                                data: {
                                    name: "台北旗艦店",
                                    customId: "S-00016",
                                    address: "A-A",
                                    tags: [
                                        {
                                            objectId: "4SgdtSjDdi",
                                            name: "旗艦店"
                                        },
                                        {
                                            objectId: "VSNkFzOEx0",
                                            name: "直營店"
                                        }
                                    ],
                                    imageSrc:
                                        "images/yf6yra0jiw_location_site_1559112678478.gif",
                                    longitude: 121.511177,
                                    latitude: 25.0497392
                                },
                                lft: 9,
                                rgt: 14,
                                childrens: []
                            },
                            {
                                objectId: "YwQ3wndke6",
                                parentId: "Guwl8gq7yq",
                                type: "globe",
                                data: {
                                    name: "Morris 1-1-1",
                                    customId: "Morris 1-1-1 ID",
                                    address: "Morris 1-1-1 A",
                                    tags: [
                                        {
                                            objectId: "RoSvvOoxJZ",
                                            name: "leval 2"
                                        }
                                    ],
                                    imageSrc:
                                        "images/YwQ3wndke6_location_region_1559551780855.jpeg",
                                    longitude: 10,
                                    latitude: 25
                                },
                                lft: 10,
                                rgt: 13,
                                childrens: [
                                    {
                                        objectId: "xbTg9WCcES",
                                        parentId: "YwQ3wndke6",
                                        type: "site",
                                        data: {
                                            name: "大雅店",
                                            customId: "S-00012",
                                            address: "1-1",
                                            tags: [],
                                            imageSrc:
                                                "images/xbTg9WCcES_location_site_1559112628016.gif",
                                            longitude: 121.511177,
                                            latitude: 25.0497392
                                        },
                                        lft: 10,
                                        rgt: 13,
                                        childrens: []
                                    },
                                    {
                                        objectId: "D373tCh97L",
                                        parentId: "YwQ3wndke6",
                                        type: "none",
                                        data: {
                                            name: "Morris 1-1-1-1",
                                            customId: "Morris 1-1-1-1 ID",
                                            address: "Morris 1-1-1-1 A",
                                            tags: [],
                                            imageSrc:
                                                "images/D373tCh97L_location_region_1559551829897.jpeg",
                                            longitude: 60,
                                            latitude: 25
                                        },
                                        lft: 11,
                                        rgt: 12,
                                        childrens: [
                                            {
                                                objectId: "VDK7nXMGSI",
                                                parentId: "D373tCh97L",
                                                type: "site",
                                                data: {
                                                    name: "公館店",
                                                    customId: "S-00013",
                                                    address: "1-1",
                                                    tags: [
                                                        {
                                                            objectId:
                                                                "bm6VUIvJTy",
                                                            name: "Outlet"
                                                        },
                                                        {
                                                            objectId:
                                                                "VSNkFzOEx0",
                                                            name: "直營店"
                                                        },
                                                        {
                                                            objectId:
                                                                "72IfzSQGTO",
                                                            name: "leval 1"
                                                        }
                                                    ],
                                                    imageSrc:
                                                        "images/VDK7nXMGSI_location_site_1559112645957.gif",
                                                    longitude: 121.511177,
                                                    latitude: 25.0497392
                                                },
                                                lft: 11,
                                                rgt: 12,
                                                childrens: []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        objectId: "riFRdTcwEK",
                        parentId: "xPNATnQp3K",
                        type: "globe",
                        data: {
                            name: "Morris-1-2",
                            customId: "Morris-1-2 ID",
                            address: "Morris-1-2 A",
                            tags: [
                                {
                                    objectId: "KJOSNfuSDr",
                                    name: "加盟店"
                                },
                                {
                                    objectId: "RoSvvOoxJZ",
                                    name: "leval 2"
                                }
                            ],
                            imageSrc:
                                "images/riFRdTcwEK_location_region_1559524497345.jpeg",
                            longitude: 84,
                            latitude: 25
                        },
                        lft: 15,
                        rgt: 16,
                        childrens: [
                            {
                                objectId: "3g7Lt2sgFM",
                                parentId: "riFRdTcwEK",
                                type: "site",
                                data: {
                                    name: "旗津店",
                                    customId: "S-000162",
                                    address: "1-1",
                                    tags: [
                                        {
                                            objectId: "bm6VUIvJTy",
                                            name: "Outlet"
                                        },
                                        {
                                            objectId: "VSNkFzOEx0",
                                            name: "直營店"
                                        }
                                    ],
                                    imageSrc:
                                        "images/3g7Lt2sgFM_location_site_1559112800900.gif",
                                    longitude: 121.511177,
                                    latitude: 25.0497392
                                },
                                lft: 15,
                                rgt: 16,
                                childrens: []
                            }
                        ]
                    },
                    {
                        objectId: "d7jMan6t6B",
                        parentId: "xPNATnQp3K",
                        type: "none",
                        data: {
                            name: "Morris 1-3",
                            customId: "Morris 1-3 ID",
                            address: "Morris 1-3 A",
                            tags: [],
                            imageSrc:
                                "images/d7jMan6t6B_location_region_1559551879819.jpeg",
                            longitude: 35,
                            latitude: 23
                        },
                        lft: 17,
                        rgt: 18,
                        childrens: [
                            {
                                objectId: "obSxIrvqET",
                                parentId: "d7jMan6t6B",
                                type: "site",
                                data: {
                                    name: "高雄旗艦店",
                                    customId: "S-000161",
                                    address: "1-1",
                                    tags: [
                                        {
                                            objectId: "4SgdtSjDdi",
                                            name: "旗艦店"
                                        }
                                    ],
                                    imageSrc:
                                        "images/obSxIrvqET_location_site_1559112784009.gif",
                                    longitude: 121.511177,
                                    latitude: 25.0497392
                                },
                                lft: 17,
                                rgt: 18,
                                childrens: []
                            }
                        ]
                    }
                ]
            }
        ]
    };
}
</script>

<style lang="scss" scoped>
.demo-region-tree-select {
    padding: 20px;
    .demo-region-tree-select-result {
        margin-top: 20px;
    }
}
</style>
