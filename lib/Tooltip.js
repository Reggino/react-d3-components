'use strict';

var React = require('react');
var d3 = require('d3');

var Tooltip = React.createClass({
	displayName: 'Tooltip',

	propTypes: {
		top: React.PropTypes.number.isRequired,
		left: React.PropTypes.number.isRequired,
		html: React.PropTypes.string
	},

	getDefaultProps: function getDefaultProps() {
		return {
			top: 150,
			left: 100,
			html: ""
		};
	},

	render: function render() {
		var _props = this.props;
		var top = _props.top;
		var left = _props.left;
		var hidden = _props.hidden;
		var html = _props.html;

		var style = {
			display: hidden ? "none" : "block",
			position: "fixed",
			top: top,
			left: left
		};

		return React.createElement(
			'div',
			{ className: 'tooltip', style: style },
			html
		);
	}
});

module.exports = Tooltip;