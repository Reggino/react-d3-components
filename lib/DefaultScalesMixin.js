'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var React = require('react');
var d3 = require('d3');

var DefaultScalesMixin = {
	propTypes: {
		barPadding: React.PropTypes.number
	},

	getDefaultProps: function getDefaultProps() {
		return {
			barPadding: 0.5
		};
	},

	componentWillMount: function componentWillMount() {
		this._makeScales(this.props);
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		this._makeScales(nextProps);
	},

	_makeScales: function _makeScales(props) {
		var xScale = props.xScale;
		var xIntercept = props.xIntercept;
		var yScale = props.yScale;
		var yIntercept = props.yIntercept;

		if (!xScale) {
			var _makeXScale2 = this._makeXScale();

			var _makeXScale22 = _slicedToArray(_makeXScale2, 2);

			this._xScale = _makeXScale22[0];
			this._xIntercept = _makeXScale22[1];
		} else {
			var _ref = [xScale, xIntercept];
			this._xScale = _ref[0];
			this._xIntercept = _ref[1];
		}

		if (!yScale) {
			var _makeYScale2 = this._makeYScale();

			var _makeYScale22 = _slicedToArray(_makeYScale2, 2);

			this._yScale = _makeYScale22[0];
			this._yIntercept = _makeYScale22[1];
		} else {
			var _ref2 = [yScale, yIntercept];
			this._yScale = _ref2[0];
			this._yIntercept = _ref2[1];
		}
	},

	_makeXScale: function _makeXScale() {
		var _props = this.props;
		var x = _props.x;
		var values = _props.values;

		var data = this._data;

		if (typeof x(values(data[0])[0]) === 'number') {
			return this._makeLinearXScale();
		} else if (typeof x(values(data[0])[0]).getMonth === 'function') {
			return this._makeTimeXScale();
		} else {
			return this._makeOrdinalXScale();
		}
	},

	_makeLinearXScale: function _makeLinearXScale() {
		var _props2 = this.props;
		var x = _props2.x;
		var values = _props2.values;
		var data = this._data;
		var innerWidth = this._innerWidth;

		var extents = d3.extent(Array.prototype.concat.apply([], data.map(function (stack) {
			return values(stack).map(function (e) {
				return x(e);
			});
		})));

		var scale = d3.scale.linear().domain(extents).range([0, innerWidth]);

		var zero = d3.max([0, scale.domain()[0]]);
		var xIntercept = scale(zero);

		return [scale, xIntercept];
	},

	_makeOrdinalXScale: function _makeOrdinalXScale() {
		var _props3 = this.props;
		var x = _props3.x;
		var values = _props3.values;
		var barPadding = _props3.barPadding;
		var data = this._data;
		var innerWidth = this._innerWidth;

		var scale = d3.scale.ordinal().domain(values(data[0]).map(function (e) {
			return x(e);
		})).rangeRoundBands([0, innerWidth], barPadding);

		return [scale, 0];
	},

	_makeTimeXScale: function _makeTimeXScale() {
		var _props4 = this.props;
		var x = _props4.x;
		var values = _props4.values;
		var barPadding = _props4.barPadding;
		var data = this._data;
		var innerWidth = this._innerWidth;

		var scale = d3.time.scale().domain(values(data[0]).map(function (e) {
			return x(e);
		})).range([0, innerWidth]);

		return [scale, 0];
	},

	_makeYScale: function _makeYScale() {
		var _props5 = this.props;
		var y = _props5.y;
		var values = _props5.values;

		var data = this._data;

		if (typeof y(values(data[0])[0]) === 'number') {
			return this._makeLinearYScale();
		} else {
			return this._makeOrdinalYScale();
		}
	},

	_makeLinearYScale: function _makeLinearYScale() {
		var _props6 = this.props;
		var y = _props6.y;
		var y0 = _props6.y0;
		var values = _props6.values;
		var data = this._data;
		var innerHeight = this._innerHeight;

		var extents = d3.extent(Array.prototype.concat.apply([], data.map(function (stack) {
			return values(stack).map(function (e) {
				return y0(e) + y(e);
			});
		})));

		extents = [d3.min([0, extents[0]]), extents[1]];

		var scale = d3.scale.linear().domain(extents).range([innerHeight, 0]);

		var zero = d3.max([0, scale.domain()[0]]);
		var yIntercept = scale(zero);

		return [scale, yIntercept];
	},

	_makeOrdinalYScale: function _makeOrdinalYScale() {
		var data = this._data;
		var innerHeight = this._innerHeight;

		var scale = d3.scale.ordinal().range([innerHeight, 0]);

		var yIntercept = scale(0);

		return [scale, yIntercept];
	}
};

module.exports = DefaultScalesMixin;