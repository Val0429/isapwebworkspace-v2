import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import * as L from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

@Component({
    components: {
        'leaf-map': LMap,
        'leaf-tile-layer': LTileLayer,
        'leaf-marker': LMarker
    }
})
export class SitesMap extends Vue {

    url: string = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    zoom: number = 14;
    marker: any = L.latLng(this._lat, this._lng);

    get center () {
        let center = [this._lat, this._lng];
        return center;
    }

    @Prop({ type: Array })
    newLocalData: number[];

    @Prop({ type: Boolean })
    isClick: Boolean;

    get _lat (): number {
        let _lat = this.newLocalData.length > 0 ? this.newLocalData[0] : 23.973875;
        return _lat;
    }
    
    get _lng () {
        let _lng = this.newLocalData.length > 0 ? this.newLocalData[1] : 120.982024;
        return _lng;
    }

    frezze () {
        this.$emit('isMove', true);
    }

    zoomUpdated (zoom) {
        this.zoom = zoom;
    }

    centerUpdated (center) {
        if (this.isClick) {
            this.marker = center;
        }
    }

}
export default SitesMap;