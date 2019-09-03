import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// this part resolve an issue where the markers would not appearx

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
