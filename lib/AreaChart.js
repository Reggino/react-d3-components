'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var d3 = require('d3');

var Chart = require('./Chart');
var Axis = require('./Axis');
var Path = require('./Path');
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
		area: React.PropTypes.func.isRequired,
		line: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired,
		stroke: React.PropTypes.func.isRequired
	},

	render: function render() {
		var _props = this.props;
		var data = _props.data;
		var area = _props.area;
		var line = _props.line;
		var colorScale = _props.colorScale;
		var stroke = _props.stroke;
		var values = _props.values;
		var label = _props.label;
		var onMouseEnter = _props.onMouseEnter;
		var onMouseLeave = _props.onMouseLeave;

		var areas = data.map(function (stack, index) {
			return React.createElement(Path, {
				key: label(stack) + '.' + index,
				className: 'area',
				stroke: 'none',
				fill: colorScale(label(stack)),
				d: area(values(stack)),
				onMouseEnter: onMouseEnter,
				onMouseLeave: onMouseLeave,
				data: data
			});
		});

		var lines = data.map(function (stack) {
			return React.createElement(Path, {
				className: 'line',
				d: line(values(stack)),
				stroke: stroke(label(stack))
			});
		});

		return React.createElement(
			'g',
			null,
			areas
		);
	}
});

var AreaChart = React.createClass({
	displayName: 'AreaChart',

	mixins: [DefaultPropsMixin, HeightWidthMixin, ArrayifyMixin, StackAccessorMixin, StackDataMixin, DefaultScalesMixin, TooltipMixin],

	propTypes: {
		interpolate: React.PropTypes.string,
		stroke: React.PropTypes.func
	},

	getDefaultProps: function getDefaultProps() {
		return {
			interpolate: 'linear',
			stroke: d3.scale.category20()
		};
	},

	_tooltipHtml: function _tooltipHtml(d, position) {
		var _props2 = this.props;
		var x = _props2.x;
		var y0 = _props2.y0;
		var y = _props2.y;
		var values = _props2.values;
		var label = _props2.label;
		var xScale = this._xScale;
		var yScale = this._yScale;

		var xValueCursor = xScale.invert(position[0]);

		var xBisector = d3.bisector(function (e) {
			return x(e);
		}).right;
		var xIndex = xBisector(values(d[0]), xScale.invert(position[0]));
		xIndex = xIndex == values(d[0]).length ? xIndex - 1 : xIndex;

		var xIndexRight = xIndex == values(d[0]).length ? xIndex - 1 : xIndex;
		var xValueRight = x(values(d[0])[xIndexRight]);

		var xIndexLeft = xIndex == 0 ? xIndex : xIndex - 1;
		var xValueLeft = x(values(d[0])[xIndexLeft]);

		if (Math.abs(xValueCursor - xValueRight) < Math.abs(xValueCursor - xValueLeft)) {
			xIndex = xIndexRight;
		} else {
			xIndex = xIndexLeft;
		}

		var yValueCursor = yScale.invert(position[1]);

		var yBisector = d3.bisector(function (e) {
			return y0(values(e)[xIndex]) + y(values(e)[xIndex]);
		}).left;
		var yIndex = yBisector(d, yValueCursor);
		yIndex = yIndex == d.length ? yIndex - 1 : yIndex;

		var yValue = y(values(d[yIndex])[xIndex]);
		var yValueCumulative = y0(values(d[d.length - 1])[xIndex]) + y(values(d[d.length - 1])[xIndex]);

		return this.props.tooltipHtml(yValue, yValueCumulative);
	},

	render: function render() {
		var _props3 = this.props;
		var height = _props3.height;
		var width = _props3.width;
		var margin = _props3.margin;
		var colorScale = _props3.colorScale;
		var interpolate = _props3.interpolate;
		var stroke = _props3.stroke;
		var offset = _props3.offset;
		var values = _props3.values;
		var label = _props3.label;
		var x = _props3.x;
		var y = _props3.y;
		var y0 = _props3.y0;
		var xAxis = _props3.xAxis;
		var yAxis = _props3.yAxis;
		var data = this._data;
		var innerWidth = this._innerWidth;
		var innerHeight = this._innerHeight;
		var xScale = this._xScale;
		var yScale = this._yScale;
		var xIntercept = this._xIntercept;
		var yIntercept = this._yIntercept;

		var line = d3.svg.line().x(function (e) {
			return xScale(x(e));
		}).y(function (e) {
			return yScale(y0(e) + y(e));
		}).interpolate(interpolate);

		var area = d3.svg.area().x(function (e) {
			return xScale(x(e));
		}).y0(function (e) {
			return yScale(yScale.domain()[0] + y0(e));
		}).y1(function (e) {
			return yScale(y0(e) + y(e));
		}).interpolate(interpolate);

		return React.createElement(
			'div',
			null,
			React.createElement(
				Chart,
				{ height: height, width: width, margin: margin },
				React.createElement(DataSet, {
					data: data,
					line: line,
					area: area,
					colorScale: colorScale,
					stroke: stroke,
					label: label,
					values: values,
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

module.exports = AreaChart;