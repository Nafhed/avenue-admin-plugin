import Parse from 'parse'
import React from 'react'
import ParseReact from 'parse-react-2'

const ParseComponent = ParseReact.Component(React)
mixins: [ParseReact.mixin]

import VenueItem from './VenueItem'

class VenuesList extends ParseComponent {

	constructor(props) {
		super(props)


	}

	observe(props, state) {
		console.log('venue list - observe state list ', this.state);
		console.log('venue list - observe props list ', this.props);

	}

	componentDidMount() {
		console.log('The list component has been mounted')
		// this.refreshQueries();
	}

	_flagItem(id) {
		ParseReact.Mutation.Set(id, {
			in_appropriate: 1
		}).dispatch();
	}

	render() {
		console.log("venues data ", this.data);
		console.log("venues props ", this.data);
		console.log('pending queries = ', this.pendingQueries().length);
		const items = this.props.venues.map((venue) => {
			return <VenueItem key={venue.id.objectId} venue={venue} flag={this._flagItem} />
		})
		return (
			<div className="venues-list {this.pendingQueries().length ? 'venues_display loading' : 'venues_display'}">
				<ul className="depth-0">
					{items}
				</ul>
			</div>
		)

	}

}

export default VenuesList