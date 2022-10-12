import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import { LMap, LTileLayer, LMarker, LControl,LCircle,LPolyline,LIcon } from 'vue2-leaflet';

import 'leaflet/dist/leaflet.css';

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-control', LControl);
Vue.component('l-circle', LCircle);
Vue.component("l-polyline",LPolyline);
Vue.component("l-icon", LIcon);
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
