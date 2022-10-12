<template>
	<v-app>
		<v-main>
			<l-map
				ref="map"
				style="height: 100vh"
				:zoom="zoom"
				:center="center"
				:options="{
					zoomControl: false,
					attributionControl: false,
				}"
			>
				<l-tile-layer :url="satView ? tilelayerURL : url"></l-tile-layer>
				<l-marker :lat-lng="center">
					<l-icon class-name="someExtraClass">
						<v-icon class="pulse">mdi-crosshairs-gps</v-icon>
					</l-icon>
				</l-marker>
				<l-control :position="'topleft'" class="example-custom-control">
					<div
						@mouseover="$refs.map.mapObject.dragging.disable()"
						@mouseout="$refs.map.mapObject.dragging.enable()"
					>
						<v-toolbar dense floating class="pl-0">
							<v-avatar class="mr-2 ml-0 pl-0" size="40">
								<img src="./assets/icon.png" alt="alt" />
							</v-avatar>
							<h3><b>ID: </b>Y4RT34Z</h3>
							<v-chip class="ml-1" small color="success">Aktiv</v-chip>
							<v-btn icon @click="flyToMarker">
								<v-icon>mdi-crosshairs-gps</v-icon>
							</v-btn>

							<v-dialog v-model="dialog" persistent max-width="290">
								<template v-slot:activator="{ on, attrs }">
									<v-btn icon v-bind="attrs" v-on="on">
										<v-icon>mdi-phone</v-icon>
									</v-btn>
								</template>
								<v-card>
									<v-card-title class="text-h5">
										Polizei kontaktieren ?
									</v-card-title>
									<v-card-text class="text-center"
										>Haben sie die gesuchte Person gefunden, oder haben andere
										Hinweise ? Geben sie ihre ID beim folgenden Gespräch an.
										<h1 class="text-center pa-2"><b>ID: </b>Y4RT34Z</h1>
									</v-card-text>
									<v-card-actions>
										<v-btn text @click="dialog = false"> Abbrechen </v-btn
										><v-spacer></v-spacer>
										<v-btn color="red" text @click="dialog = false">
											Anrufen
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</v-toolbar>
						<v-slider
							color="white"
							v-model="limit"
							step="1"
							max="100"
						></v-slider>
					</div>
				</l-control>

				<l-control :position="'bottomright'" class="example-custom-control">
					<v-speed-dial
						v-model="fab"
						direction="top"
						:open-on-hover="hover"
						:transition="transition"
					>
						<template v-slot:activator>
							<v-btn v-model="fab" color="#0077FF" dark fab>
								<v-icon v-if="fab"> mdi-close </v-icon>
								<v-icon v-else> mdi-help </v-icon>
							</v-btn>
						</template>
						<div class="mr-15">
							<v-btn dark small color="green">
								<v-icon left>mdi-help</v-icon>Anleitung
							</v-btn>
							<v-btn dark small color="indigo">
								<v-icon left>mdi-note</v-icon>Suchtipps
							</v-btn>
							<v-btn dark small color="red">
								<v-icon left>mdi-account</v-icon>Person
							</v-btn>
						</div>
					</v-speed-dial>
				</l-control>
				<l-control :position="'bottomleft'">
					<v-btn
						color="#0077FF"
						dark
						fab
						@click="
							satView = !satView;
							enterFullscreen();
						"
						><v-icon>mdi-layers</v-icon></v-btn
					>
				</l-control>

				<l-circle
					:lat-lng="center"
					:radius="1500"
					color="#0077FF"
					:opacity="0.5"
					:fill="false"
				></l-circle>
				<l-polyline
					v-for="(line, index) in latlngs"
					:lat-lngs="line.coordinates"
					:key="index"
					:fill="false"
					:color="getColor(line.color)"
					:weight="5"
					:opacity="0.5"
				></l-polyline>
				<div v-for="(searchgroup, index) in data" :key="index">
					<div
						v-for="(line, index2) in searchgroup.slice(0, limit)"
						:key="index2"
					>
						<l-polyline
							:lat-lngs="line.coordinates"
							:fill="false"
							:weight="5"
							:color="getColor(line.color)"
							:opacity="0.5"
						></l-polyline>
					</div>
					<l-circle
						:lat-lng="searchgroup.slice(limit - 1, limit)[0].coordinates[1]"
						:radius="5"
						color="#007034"
						className="blinking"
						:fill="false"
					></l-circle>
				</div>
			</l-map>
		</v-main>
	</v-app>
</template>

<script>
const gradient = require("javascript-color-gradient");
import myFile from "./assets/full.json";
const colorAtIndexTwo = new gradient()
	.setColorGradient("#818181", "#e9446a", "#e9cd10", "#00ff11")
	.setMidpoint(100);
export default {
	name: "App",

	data: () => ({
		counter: 0,
		latlngs: [],
		dialog: false,
		satView: false,
		tilelayerURL:
			"http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
		url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		zoom: 14,
		center: [47.718525022550516, 10.322313991765466],
		markerLatLng: [47.718785, 10.321536],
		clicked: [],
		lastClick: [],
		currentPos: [],
		data: [],
		limit: 99,
	}),
	created() {
		this.data = myFile;
	},
	computed: {},
	methods: {
		enterFullscreen() {
			var elem = document.documentElement;
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.webkitRequestFullscreen) {
				/* Safari */
				elem.webkitRequestFullscreen();
			} else if (elem.msRequestFullscreen) {
				/* IE11 */
				elem.msRequestFullscreen();
			}
		},
		flyToMarker() {
			this.$refs.map.mapObject.flyTo(this.center, 18);
		},
		showAlert() {
			alert("Click!");
		},
		download(content, fileName, contentType) {
			var a = document.createElement("a");
			var file = new Blob([content], { type: contentType });
			a.href = URL.createObjectURL(file);
			a.download = fileName;
			a.click();
		},

		test(e) {
			this.counter += 1;
			if (this.counter > 100) {
				console.log(JSON.stringify(this.latlngs));
				this.download(JSON.stringify(this.latlngs), "json.txt", "text/plain");
				this.latlngs = [];
				this.counter = 0;
				this.lastClick = [];
			}
			this.clicked = e.latlng;
			if (this.lastClick === []) {
				this.lastClick = [e.latlng.lat, e.latlng.lng];
			}
			this.latlngs.push({
				coordinates: [this.lastClick, e.latlng],
				color: this.counter,
			});
			console.log(this.latlngs);
			this.lastClick = e.latlng;
			this.currentPos = `${e.latlng.lat.toFixed(5)}  ${e.latlng.lng.toFixed(
				5
			)}`;
		},
		getColor(index) {
			return colorAtIndexTwo.getColor(index);
		},
	},
};
</script>
<style scoped>
.pulse {
	position: absolute;
	top: 35%;
	left: 40%;
	transform: translate(-505, -50%);
	width: 10px;
	height: 10px;
	background: #fe0000;
	border: 2px solid #0077ff;
	border-radius: 50%;
	box-sizing: border-box;
}

.pulse:before,
.pulse:after {
	content: "";
	position: absolute;
	left: -3px;
	top: -3px;
	right: -3px;
	bottom: -3px;
	border: 2px solid #0077ff;
	border-radius: 50%;
	animation: animate 2s linear infinite;
}

.pulse:after {
	animation-delay: 1s;
}

@keyframes animate {
	0% {
		transform: scale(2);
	}

	100% {
		transform: scale(0.7);
	}
}
</style>
