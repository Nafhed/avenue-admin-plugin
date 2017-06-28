import React from 'react'
import Parse from 'parse'
import ParseReact from 'parse-react-2'

import Pagination from 'react-paginate'
import { Typeahead } from 'react-typeahead'
import { Datepicker, Button } from 'antd'
import moment from 'moment'

import VenuesList from './VenuesList'
import VenuesMap from './VenuesMap'

const ParseComponent = ParseReact.Component(React)
mixins: [ParseReact.mixin]

class VenuesFilter extends ParseComponent {

	static defaultProps: {
		venues: [],
		query: ""
	};

	static propTypes: {
		venues: React.PropTypes.array,
		onChange: React.PropTypes.func,
		query: React.PropTypes.string.isRequired
	};

	constructor(props) {
		super(props)

		this.state = { 
			venue: "",
			location: "",
			page: 0,
			page_count: 0,
			display: {
				map: false,
				list: true
			}
		}

		this.handleChange 		= this.handleChange.bind(this);
		this.handleSubmit 		= this.handleSubmit.bind(this);
		this.handleSelection 	= this.handleSelection.bind(this);
		this.handleListChange 	= this.handleListChange.bind(this);
		this.handleDisplay 		= this.handleDisplay.bind(this);
	}

	observe(props, state) {
		console.log("Venues filter state = ", state);
		// console.log("Venues filter props = ", props);

		const limit = 25;
		const page_selected = this.state.page;
		const offset = limit * page_selected + limit;
		const pages = this.state.page_count;

		const queryString = state.location ? state.location : "";

		const query_city = new Parse.Query('Venues_dev');
		const query_town = new Parse.Query('Venues_dev');

		if(queryString.length) {
			query_city.equalTo('address.city', state.location);
			query_town.equalTo('address.town', state.location);
		}

		const location_query = Parse.Query.or(query_city, query_town);
		
		location_query.limit(limit).skip(offset); // limit query and offset
		location_query.ascending('createdAt'); // sort query

		location_query.find().then(data => {

			console.log('Found something main query ', data);

			location_query.count().then(count => {
				console.log('Amount of Venues ', count);
				const pages = Math.round(count / limit);
				if(this.state.page_count !== pages)
					this.setState({ page_count: pages });
			})
		})



		// City list
		const query_cities = new Parse.Query('UK_Cities').limit(2800).ascending('name');

		query_cities.find().then(data => {
			// console.log('Found cities ', data);
		});

		return {
			venues: location_query,
			venues_amnt: location_query.count(),
			city_list: query_cities
		}

	}

	handleSubmit(val) {
		console.log("handleSubmit ", val);
		// this.state.live_query = val;
		this.setState({ location: val });
	}

	handleChange(e) {
		const value = e.target.value;
		this.setState({ location: value });
		this.handleSubmit(value);
	}

	handleSelection(val) {
		console.log("handleSelection ", val);
		this.setState({ location: val });
	}

	handleListChange(data) {
		console.log('Page has changed ', data);
		this.setState({ page: data.selected });
	}

	handleDisplay(display) {
		console.log('Data display has changed', display);
	}

	render() {
		console.log('some data ', this.data);
		const city_array = [];
		const search_terms = this.state.live_query;
		const city = this.data.city_list.map((city) => {
			return city_array.push(city.name);
		})
		const pages = this.state.page_count;
		return (
			<div className="wrapper">
				<h1 className="title">Venues - Searching {search_terms}</h1>
					
					<form id="page-filtering" className="venue-filtering">
						<label for="Location">Location</label>
						<Typeahead options={city_array} maxVisible={5} onOptionSelected={this.handleSelection} />
						<DatePicker defaultValue={moment('2015-01-01', 'YYYY-MM-DD')} />
						<div className="venue-container">
							<input type="text" ref="venueFilter" placeholder="Find a Venue" onChange={this.handleChange} value={this.state.venue} className="venue-filter selectized" name="venue-filter" />
						</div>
						<ButtonGroup>
							<Button type="primary" icon="cloud" size="small" onClick={this.handleDisplay}></Button>
							<Button type="primary" icon="cloud-download" size="small" onClick={this.handleDisplay}></Button>
						</ButtonGroup>
					</form>

				<VenuesList venues={this.data.venues} selected={this.state.page} />
				<VenuesMap venues={this.data.venues} />

				<Pagination previousLabel={"←"} nextLabel={"→"} pageNum={pages} marginPagesDisplayed={1} pageRangeDisplayed={5} containerClassName={"pagination"} clickCallback={this.handleListChange} subContainerClassName={"pages pagination"} activeClassName={"active"} />
			</div>
		)
	}

}

export default VenuesFilter