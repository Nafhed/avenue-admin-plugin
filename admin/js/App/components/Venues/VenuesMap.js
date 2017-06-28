import React from 'react'
import Pagination from 'react-paginate'
import L from 'Leaflet'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

const map = {
		width: 1000,
		height: 600,
		// scale: 1 << 12,
		// scaleExtent: [1 << 10, 1 << 14]
	}

const data = {
	"type": "Feature",
	"properties": {
		"text": "this is a Point!!!"
	},
	"geometry": {
		"type": "Point",
		"coordinates": [-2.608364, 51.449159]
	}
}

class VenuesMap extends React.Component {

	observe(props, state) {
		console.log('venue map - observe state list ', this.state);
		console.log('venue map - observe props list ', this.props);

	}

	constructor() {
		super();
		this.state = {
			lat: 51.454106,
			lng: -2.587672,
			zoom: 13,
		};
	}

	render() {
		const position = [this.state.lat, this.state.lng];

		const marker_icon = L.icon({
			iconUrl: '/user/plugins/avenue-admin/admin/assets/img/marker-icon.png',
			iconAnchor: [20, 20]
		});

		console.log('venue map - state list ', this.state);
		console.log('venue map - props list ', this.props);

		function createMarkers(venues) {
			var markers = [];
			for (var i = 0; i < venues.length; i++) {
				markers[i] = { 
					lat: venues[i].address.lat, 
					lng: venues[i].address.lng,
					popup: getPopupInfo(venues[i].display_name),
					options: {
						icon: marker_icon
					}
				};
			}

			return markers;
		}

		function getPopupInfo(name) {
			return L.popup({ minWidth: 200, closeButton: false })
				.setContent(`<div><p>This is $name popup</p></div>`);
		}

		function getStringPopup(name) {
			return (`
			  <div>
			    <b>Hello world!</b>
			    <p>I am a ${name} popup.</p>
			  </div>
			`);
 		}

		const venues = this.props.venues;
		
		return (
			<Map className="venues-map" center={position} zoom={8} maxZoom={18}>
			  <TileLayer
			    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			  />

			  <MarkerClusterGroup
			    markers={createMarkers(venues)}
			    wrapperOptions={{enableDefaultStyle: true}}
			  />
			</Map>
		);
	}

}

export default VenuesMap