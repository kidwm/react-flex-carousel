import React, {Component} from 'react';
import Carousel from './carousel.js';
import './slider.css';

export default class App extends Component {
  render() {
    return <Carousel autoPlayInterval={2000} indicator={true} switcher={true}>
		<div style={{height: '300px', textAlign: 'center', backgroundColor: 'red'}}>1</div>
		<div style={{height: '300px', textAlign: 'center', backgroundColor: 'blue'}}>2</div>
		<div style={{height: '300px', textAlign: 'center', backgroundColor: 'green'}}>3</div>
	</Carousel>;
  }
}
