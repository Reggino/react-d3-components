'use strict';

var React = require('react');
var d3 = require('d3');

var TooltipMixin = {
	propTypes: {
		tooltipHtml: React.PropTypes.func
	},

	getInitialState: function getInitialState() {
		return {
			tooltip: {
				hidden: true
			}
		};
	},

	getDefaultProps: function getDefaultProps() {
		return {
			tooltipOffset: { top: -20, left: 15 },
			tooltipHtml: null
		};
	},

	componentDidMount: function componentDidMount() {
		this._svg_node = this.getDOMNode().getElementsByTagName("svg")[0];
	},

	onMouseEnter: function onMouseEnter(e, data) {
		if (!this.props.tooltipHtml) {
			return;
		}

		e.preventDefault();

		var _props = this.props;
		var margin = _props.margin;
		var tooltipHtml = _props.tooltipHtml;

		var svg = this._svg_node;
		var position = undefined;
		if (svg.createSVGPoint) {
			var point = svg.createSVGPoint();
			point.x = e.clientX, point.y = e.clientY;
			point = point.matrixTransform(svg.getScreenCTM().inverse());
			position = [point.x - margin.left, point.y - margin.top];
		} else {
			var rect = svg.getBoundingClientRect();
			position = [e.clientX - rect.left - svg.clientLeft - margin.left, e.clientY - rect.top - svg.clientTop - margin.top];
		}

		this.setState({
			tooltip: {
				top: e.clientY + this.props.tooltipOffset.top,
				left: e.clientX + this.props.tooltipOffset.left,
				hidden: false,
				html: this._tooltipHtml(data, position)
			}
		});
	},

	onMouseLeave: function onMouseLeave(e) {
		if (!this.props.tooltipHtml) {
			return;
		}

		e.preventDefault();

		this.setState({
			tooltip: {
				hidden: true
			}
		});
	}
};

module.exports = TooltipMixin;