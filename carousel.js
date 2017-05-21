import React, {Component, Children} from 'react';
import PropTypes from 'prop-types';

class Carousel extends Component {
	constructor(props) {
		super(props);
		this.state = {slide: 1, dragging: null, sliding: false, offset: 0}; // slide index start from 1
		this.setTimer = this.setTimer.bind(this);
		this.clearTimer = this.clearTimer.bind(this);
		this.events = {
			onTouchStart: this.onDraggingStart.bind(this),
			onTouchMove: this.onDraggingMove.bind(this),
			onTouchEnd: this.onDraggingEnd.bind(this),
			onTouchCancel: this.onDraggingEnd.bind(this),
			onClick: this.onClick.bind(this),
			onTransitionEnd: this.onTransitionEnd.bind(this)
		};
	}
	componentDidMount() {
		this.setTimer();
	}
	componentWillUnmount() {
		this.clearTimer();
	}
	onTransitionEnd() { // this will not be triggered when document.hidden
		let {slide} = this.state;
		const count = Children.count(this.props.children);
		if (slide == count + 1) slide = 1;
		if (slide == 0) slide = count;
		this.setState({slide, sliding: false}, this.setTimer);
	}
	setTimer() {
		const interval = this.props.autoplayInteval;
		if (Children.count(this.props.children) > 1 && interval && interval > 0) {
			this.clearTimer();
			this.timer = window.setInterval(this.changeSlide.bind(this, this.state.slide + 1), interval);
		}
	}
	clearTimer() {
		window.clearInterval(this.timer);
	}
	changeSlide(slide) {
		if (document.hidden) return; // run only when page is visible
		if (slide && slide >= 0 && slide <= React.Children.count(this.props.children) + 1)
			this.setState({slide, sliding: true, dragging: null}, this.setTimer);
	}
	onDraggingStart(event) {
		if (event.touches)
			this.setState({dragging: {
				x: event.touches[0].pageX,
				y: event.touches[0].pageY
			}, offset: 0});
	}
	onDraggingMove(event) {
		const {sliding, dragging} = this.state;
		if (sliding || !dragging || !event.touches) return;
		const x = event.touches[0].pageX;
		const y = event.touches[0].pageY;
		const offset = x - dragging.x;
		if (Math.abs(y - dragging.y) < Math.abs(offset)) event.preventDefault();
		this.setState({offset});
	}
	onDraggingEnd(event) {
		const {slide, offset, dragging} = this.state;
		if (!dragging) return;
		const target = Math.abs(offset) > this.slider.clientWidth / 5 ? (offset > 0 ? slide - 1 : slide + 1) : slide;
		this.setState({dragging: null}, this.changeSlide.bind(this, target));
	}
	onClick(event) {
		if (Math.abs(this.state.offset) < 25) return; // trigger click in a small distance
		event.preventDefault();
		event.stopPropagation();
		event.nativeEvent.stopPropagation();
	}
	render() {
		const {children, className, switcher, indicator, transitionDuration, transitionTimingFunction} = this.props;
		const {slide, sliding, dragging, offset} = this.state;
		const slides = Children.map(children, (child) => React.cloneElement(child, {key: child.key + '_clone'}));
		const count = Children.count(children);
		const enabled = count > 1;
		const prevSlide = this.changeSlide.bind(this, slide > 1 ? slide - 1 : count);
		const nextSlide = this.changeSlide.bind(this, slide + 1 > count ? 1 : slide + 1);
		const slideStyle = {
			flexBasis: '100%',
			flexShrink: 0
		};
		return (
			<div className={['slider', className || ''].join(' ')} style={{
				position: 'relative',
				overflowX: 'hidden',
				touchAction: 'pan-y pinch-zoom',
				willChange: 'transform'
			}}>
				<ul ref={node => {this.slider = node;}} style={{
					display: 'flex',
					transitionProperty: sliding ? 'transform' : 'none',
					transform: enabled ? (dragging && offset !== 0 ? 'translateX(calc(' + (offset * 1) + 'px - ' + slide * 100 + '%))' : 'translateX(-' + slide * 100 + '%)') : null,
					transitionDuration,
					transitionTimingFunction

				}} {...this.events}>
					{enabled && Children.map(slides.slice(-1).concat(children, slides.slice(0, 1)),
						(item, index) => <li className={slide == index ? 'active' : null} style={slideStyle}>{item}</li>) || <li>{children}</li>
					}
				</ul>
				{enabled && switcher && <menu>
					<button className="prev" onClick={prevSlide}></button>
					<button className="next" onClick={nextSlide}></button>
				</menu>}
				{enabled && indicator && <ol>
					{Children.map(children, (item, index) => <li className={slide == index + 1 ? 'active' : null}>
						<button onClick={this.changeSlide.bind(this, index + 1)}>{index}</button>
					</li>)}
				</ol>}
			</div>
		);
	}
}

Carousel.propTypes = {
	className: PropTypes.string,
	transitionDuration: PropTypes.string,
	transitionTimingFunction: PropTypes.string,
	switcher: PropTypes.bool,
	indicator: PropTypes.bool,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired
};

Carousel.defaultProps = {
	transitionDuration: '.8s',
	transitionTimingFunction: 'ease-in-out',
};

export default Carousel;
