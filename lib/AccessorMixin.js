'use strict';

var React = require('react');

var AccessorMixin = {
	propTypes: {
		label: React.PropTypes.func,
		values: React.PropTypes.func,
		x: React.PropTypes.func,
		y: React.PropTypes.func,
		y0: React.PropTypes.func
	},

	getDefaultProps: function getDefaultProps() {
		return {
			label: function label(stack) {
				return stack.label;
			},
			values: function values(stack) {
				return stack.values;
			},
			x: function x(e) {
				return e.x;
			},
			y: function y(e) {
				return e.y;
			},
			y0: function y0(e) {
				return 0;
			}
		};
	}
};

module.exports = AccessorMixin;