import React, {Component} from 'react';
import Carousel from './carousel.js';
import './slider.css';

export default class App extends Component {
  render() {
    return <Carousel className="slider" autoplayInteval={1500} indicator={true} switcher={true}>
		<div style={{height: '300px'}}>1</div>
		<div style={{height: '300px'}}>2</div>
		<div style={{height: '300px'}}>3</div>
	</Carousel>;
  }
}
