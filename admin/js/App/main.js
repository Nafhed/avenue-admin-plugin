import React from 'react'
import Parse from 'parse'
import ReactDom from 'react-dom'

import Config from './config'

import Venues from './components/Venues/Venues'

ReactDom.render((
	<Venues />
), document.getElementById('venues'))