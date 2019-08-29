<template>
    <div class="animated fadeIn">
        <div class="row">
            <div class="col-md-9">
                <l-map
                    class="l-map"
                    :zoom="zoom"
                    :center="center"
                >
                    <l-tile-layer
                        :url="url"
                        :attribution="attribution"
                    ></l-tile-layer>
                    <l-marker
                        :lat-lng="marker"
                        @click="click($event)"
                    ></l-marker>
                    <l-marker
                        :lat-lng="marker2"
                        @click="click($event)"
                    ></l-marker>
                </l-map>
            </div>

            <div class="col-md-3">
                <map-status-dashboard :data="currentData" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";

//Map
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import { Icon, DefaultMapPanes, latLng, tileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";
Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);

delete (Icon.Default.prototype as any)._getIconUrl;

Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

@Component({
    components: {}
})
export default class Map extends Vue {
    zoom = 13;
    center = latLng(25.041629, 121.543767);
    url = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
    attribution =
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
    marker = latLng(25.041629, 121.543767);
    marker2 = latLng(25.030629, 121.533767);

    currentData = {};

    created() {}

    mounted() {}

    click(data) {
        // this.currentData = data;

        //TODO false data
        if (this.marker === data.latlng) {
            this.currentData = {
                title: "HK001 台北總店",
                address: "103 Zhengzhou Road, Datong District, Taipei City",
                manager: "Ben",
                tags: ["Caption 01", "New"]
            };
        } else {
            this.currentData = {
                title: "HK002 尖沙咀總店",
                address: "201 PiDu Road, Datong District, HongKong City",
                manager: "Jhon",
                tags: ["Business district", "Flagship Store"]
            };
        }
    }
}
</script>

<style lang="scss" scoped>
.l-map {
    height: 700px;
    margin: 0;
}
</style>




