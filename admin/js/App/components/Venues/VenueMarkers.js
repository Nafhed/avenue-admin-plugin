import React from 'react'

const markers = [
	{
		lng: -2.608364, 
		lat: 51.449159,
		text: '<p>SS Great Britain</p>'
	},
	{
		lng: -2.612076, 
		lat: 51.449400,
		text: 'Grain Barge'
	},
	{
		lng: -2.622073, 
		lat: 51.447071,
		text: 'The Create Centre'
	}
];

class VenueMarkers extends React.Component {

	constructor() {
		super();
		// this.state = {
		// 	lat: 51.454106,
		// 	lng: -2.587672,
		// 	zoom: 13,
		// };
	}

	render() {

		const style = {
			border: 'solid 3px lightblue',
			backgroundColor: '#333333',
			color: 'white',
			textAlign: 'center',
			margin: '0',
			padding: '0.25em 0.25em 0.5em',
			fontSize: '1.25em',
			fontWeight: '700'
		};
		const cluster = this.props.cluster;
		}

		if (cluster.markers.length == 1) {
		  const markerStyle = Object.assign({}, style, {
		    minWidth: '110px',
		    borderRadius: '16px',
		    borderTopLeftRadius: '0',
		  });
	
		  return (
		    <div style={markerStyle} >{cluster.markers[0].text}</div>
		  );
		}

		const clusterStyle = Object.assign({}, style, {
		  borderRadius: '50%',
		  borderTopLeftRadius: '0',
		  width: '24px',
		  height: '24px'
		});

		return (
		  <div style={clusterStyle}>{cluster.markers.length}</div>
		);

		// console.log("Markers = ", markers);

	}

}

export default VenueMarkers