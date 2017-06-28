import Parse from 'parse'
import React from 'react'
import ParseReact from 'parse-react-2'
import { Popconfirm } from 'antd'

const ParseComponent = ParseReact.Component(React)
mixins: [ParseReact.mixin]

class VenueItem extends ParseComponent {

	constructor(props) {
		super(props)

		this.destroyVenue = this._destroyVenue.bind(this);
		this.cancelDelete = this._cancelDelete.bind(this);
	}

	observe(props, state) {
		console.log('venue item - observe state list ', this.state);
		console.log('venue item - observe props list ', this.props);

	}
	
	componentDidMount() {
		console.log('The item component has been mounted')
		// this.refreshQueries();
	}

	_destroyVenue() {
		const remove = this.props.venue;
		console.log('destroying venue = ', remove);
		console.log('destroying venue = ', this.data);
		console.log('destroying venue = ', this);
		ParseReact.Mutation.Destroy(remove).dispatch();
	}

	_cancelDelete() {
		console.log('cancelling delete', this);
	}

	render() {
		const venue = this.props.venue;
		
		console.log('venue item - render state list ', this.state);
		console.log('venue item - render props list ', this.props);

		return (
			<li className="venue-item">
				<div className="row">
					<span>{venue.display_name}, {venue.address.city}, {venue.address.postcode}, {venue.address.country}</span>
					<div className="venue-tools test">
						<Popconfirm onConfirm={this.destroyVenue} onCancel={this.cancelDelete}>
							<i className="fa fa-fw fa-trash-o"></i>
						</Popconfirm>
					</div> 
				</div>
			</li>
		)
	}

}

export default VenueItem