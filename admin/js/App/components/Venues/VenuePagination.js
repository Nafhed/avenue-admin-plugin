import React from 'react'
import Pagination from 'react-paginate'

class VenuePagination extends React.Component {

	// constructor() {
	// 	this.handleListChange = this.handleListChange.bind(this)
	// }

	handleListChange(data) {
		console.log('Page has changed ', data);
	}

	render() {
		return (
			<Pagination previousLabel={"←"} nextLabel={"→"} pageNum={25} marginPagesDisplayed={1} pageRangeDisplayed={5} containerClassName={"pagination"} clickCallback={this.handleListChange} subContainerClassName={"pages pagination"} activeClassName={"active"} />
		)
	}

}

export default VenuePagination