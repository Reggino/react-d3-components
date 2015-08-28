'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var d3 = require('d3');

var Chart = require('./Chart');
var Axis = require('./Axis');
var Bar = require('./Bar');
var Tooltip = require('./Tooltip');

var DefaultPropsMixin = require('./DefaultPropsMixin');
var HeightWidthMixin = require('./HeightWidthMixin');
var ArrayifyMixin = require('./ArrayifyMixin');
var StackAccessorMixin = require('./StackAccessorMixin');
var StackDataMixin = require('./StackDataMixin');
var DefaultScalesMixin = require('./DefaultScalesMixin');
var TooltipMixin = require('./TooltipMixin');

var DataSet = React.createClass({
	displayName: 'DataSet',

	propTypes: {
		data: React.PropTypes.array.isRequired,
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired,
		values: React.PropTypes.func.isRequired,
		label: React.PropTypes.func.isRequired,
		x: React.PropTypes.func.isRequired,
		y: React.PropTypes.func.isRequired,
		y0: React.PropTypes.func.isRequired
	},

	render: function render() {
		var _props = this.props;
		var data = _props.data;
		var xScale = _props.xScale;
		var yScale = _props.yScale;
		var colorScale = _props.colorScale;
		var values = _props.values;
		var label = _props.label;
		var x = _props.x;
		var y = _props.y;
		var y0 = _props.y0;
		var onMouseEnter = _props.onMouseEnter;
		var onMouseLeave = _props.onMouseLeave;

		var bars = data.map(function (stack) {
			return values(stack).map(function (e, index) {
				return React.createElement(Bar, {
					key: label(stack) + '.' + index,
					width: xScale.rangeBand(),
					height: yScale(yScale.domain()[0]) - yScale(y(e)),
					x: xScale(x(e)),
					y: yScale(y0(e) + y(e)),
					fill: colorScale(label(stack)),
					data: e,
					onMouseEnter: onMouseEnter,
					onMouseLeave: onMouseLeave
				});
			});
		});

		return React.createElement(
			'g',
			null,
			bars
		);
	}
});

var BarChart = React.createClass({
	displayName: 'BarChart',

	mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin, StackAccessorMixin, StackDataMixin, DefaultScalesMixin, TooltipMixin],

	getDefaultProps: function getDefaultProps() {
		return {};
	},

	_tooltipHtml: function _tooltipHtml(d, position) {
		return this.props.tooltipHtml(this.props.x(d), this.props.y0(d), this.props.y(d));
	},

	render: function render() {
		var _props2 = this.props;
		var height = _props2.height;
		var width = _props2.width;
		var margin = _props2.margin;
		var colorScale = _props2.colorScale;
		var values = _props2.values;
		var label = _props2.label;
		var y = _props2.y;
		var y0 = _props2.y0;
		var x = _props2.x;
		var xAxis = _props2.xAxis;
		var yAxis = _props2.yAxis;
		var data = this._data;
		var innerWidth = this._innerWidth;
		var innerHeight = this._innerHeight;
		var xScale = this._xScale;
		var yScale = this._yScale;

		return React.createElement(
			'div',
			null,
			React.createElement(
				Chart,
				{ height: height, width: width, margin: margin },
				React.createElement(DataSet, {
					data: data,
					xScale: xScale,
					yScale: yScale,
					colorScale: colorScale,
					values: values,
					label: label,
					y: y,
					y0: y0,
					x: x,
					onMouseEnter: this.onMouseEnter,
					onMouseLeave: this.onMouseLeave
				}),
				React.createElement(Axis, _extends({
					className: "x axis",
					orientation: "bottom",
					scale: xScale,
					height: innerHeight,
					width: innerWidth
				}, xAxis)),
				React.createElement(Axis, _extends({
					className: "y axis",
					orientation: "left",
					scale: yScale,
					height: innerHeight,
					width: innerWidth
				}, yAxis)),
				this.props.children
			),
			React.createElement(Tooltip, {
				hidden: this.state.tooltip.hidden,
				top: this.state.tooltip.top,
				left: this.state.tooltip.left,
				html: this.state.tooltip.html })
		);
	}
});

module.exports = BarChart;