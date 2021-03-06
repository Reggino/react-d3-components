'use strict';

var React = require('react');
var d3 = require('d3');

var Chart = require('./Chart');
var Tooltip = require('./Tooltip');

var DefaultPropsMixin = require('./DefaultPropsMixin');
var HeightWidthMixin = require('./HeightWidthMixin');
var AccessorMixin = require('./AccessorMixin');
var TooltipMixin = require('./TooltipMixin');

var Wedge = React.createClass({
	displayName: 'Wedge',

	propTypes: {
		d: React.PropTypes.string.isRequired,
		fill: React.PropTypes.string.isRequired
	},

	render: function render() {
		var _props = this.props;
		var fill = _props.fill;
		var d = _props.d;
		var data = _props.data;
		var onMouseEnter = _props.onMouseEnter;
		var onMouseLeave = _props.onMouseLeave;

		return React.createElement('path', {
			fill: fill,
			d: d,
			onMouseMove: function (evt) {
				onMouseEnter(evt, data);
			},
			onMouseLeave: function (evt) {
				onMouseLeave(evt);
			}
		});
	}
});

var DataSet = React.createClass({
	displayName: 'DataSet',

	propTypes: {
		pie: React.PropTypes.array.isRequired,
		arc: React.PropTypes.func.isRequired,
		outerArc: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired,
		radius: React.PropTypes.number.isRequired,
		strokeWidth: React.PropTypes.number,
		stroke: React.PropTypes.string,
		fill: React.PropTypes.string,
		opacity: React.PropTypes.number,
		x: React.PropTypes.func.isRequired
	},

	getDefaultProps: function getDefaultProps() {
		return {
			strokeWidth: 2,
			stroke: '#000',
			fill: 'none',
			opacity: 0.3
		};
	},

	render: function render() {
		var _props2 = this.props;
		var pie = _props2.pie;
		var arc = _props2.arc;
		var outerArc = _props2.outerArc;
		var colorScale = _props2.colorScale;
		var radius = _props2.radius;
		var strokeWidth = _props2.strokeWidth;
		var stroke = _props2.stroke;
		var fill = _props2.fill;
		var opacity = _props2.opacity;
		var x = _props2.x;
		var y = _props2.y;
		var onMouseEnter = _props2.onMouseEnter;
		var onMouseLeave = _props2.onMouseLeave;

		var wedges = pie.map(function (e, index) {
			function midAngle(d) {
				return d.startAngle + (d.endAngle - d.startAngle) / 2;
			}

			var d = arc(e);

			var labelPos = outerArc.centroid(e);
			labelPos[0] = radius * (midAngle(e) < Math.PI ? 1 : -1);

			var textAnchor = midAngle(e) < Math.PI ? "start" : "end";

			var linePos = outerArc.centroid(e);
			linePos[0] = radius * 0.95 * (midAngle(e) < Math.PI ? 1 : -1);

			return React.createElement(
				'g',
				{ key: x(e.data) + '.' + y(e.data) + '.' + index, className: 'arc' },
				React.createElement(Wedge, {
					data: e.data,
					fill: colorScale(x(e.data)),
					d: d,
					onMouseEnter: onMouseEnter,
					onMouseLeave: onMouseLeave
				}),
				React.createElement('polyline', {
					opacity: opacity,
					strokeWidth: strokeWidth,
					stroke: stroke,
					fill: fill,
					points: [arc.centroid(e), outerArc.centroid(e), linePos]
				}),
				React.createElement(
					'text',
					{
						dy: '.35em',
						x: labelPos[0],
						y: labelPos[1],
						textAnchor: textAnchor },
					x(e.data)
				)
			);
		});

		return React.createElement(
			'g',
			null,
			wedges
		);
	}
});

var PieChart = React.createClass({
	displayName: 'PieChart',

	mixins: [DefaultPropsMixin, HeightWidthMixin, AccessorMixin, TooltipMixin],

	propTypes: {
		innerRadius: React.PropTypes.number,
		outerRadius: React.PropTypes.number,
		labelRadius: React.PropTypes.number,
		padRadius: React.PropTypes.string,
		cornerRadius: React.PropTypes.number,
		sort: React.PropTypes.any
	},

	getDefaultProps: function getDefaultProps() {
		return {
			innerRadius: null,
			outerRadius: null,
			labelRadius: null,
			padRadius: "auto",
			cornerRadius: 0,
			sort: undefined
		};
	},

	_tooltipHtml: function _tooltipHtml(d, position) {
		return this.props.tooltipHtml(this.props.x(d), this.props.y(d));
	},

	render: function render() {
		var _props3 = this.props;
		var data = _props3.data;
		var width = _props3.width;
		var height = _props3.height;
		var margin = _props3.margin;
		var colorScale = _props3.colorScale;
		var innerRadius = _props3.innerRadius;
		var outerRadius = _props3.outerRadius;
		var labelRadius = _props3.labelRadius;
		var padRadius = _props3.padRadius;
		var cornerRadius = _props3.cornerRadius;
		var sort = _props3.sort;
		var x = _props3.x;
		var y = _props3.y;
		var values = _props3.values;
		var innerWidth = this._innerWidth;
		var innerHeight = this._innerHeight;

		var pie = d3.layout.pie().value(function (e) {
			return y(e);
		});

		if (typeof sort !== 'undefined') {
			pie = pie.sort(sort);
		}

		var radius = Math.min(innerWidth, innerHeight) / 2;
		if (!innerRadius) {
			innerRadius = radius * 0.8;
		}

		if (!outerRadius) {
			outerRadius = radius * 0.4;
		}

		if (!labelRadius) {
			labelRadius = radius * 0.9;
		}

		var arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius).padRadius(padRadius).cornerRadius(cornerRadius);

		var outerArc = d3.svg.arc().innerRadius(labelRadius).outerRadius(labelRadius);

		var pieData = pie(values(data));

		var translation = 'translate(' + innerWidth / 2 + ', ' + innerHeight / 2 + ')';
		return React.createElement(
			'div',
			null,
			React.createElement(
				Chart,
				{ height: height, width: width, margin: margin },
				React.createElement(
					'g',
					{ transform: translation },
					React.createElement(DataSet, {
						width: innerWidth,
						height: innerHeight,
						colorScale: colorScale,
						pie: pieData,
						arc: arc,
						outerArc: outerArc,
						radius: radius,
						x: x,
						y: y,
						onMouseEnter: this.onMouseEnter,
						onMouseLeave: this.onMouseLeave
					})
				),
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

module.exports = PieChart;