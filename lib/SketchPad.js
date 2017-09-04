'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toolsMap = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _toolsMap;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _tools = require('./tools');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var toolsMap = exports.toolsMap = (_toolsMap = {}, _defineProperty(_toolsMap, _tools.TOOL_PENCIL, _tools.Pencil), _defineProperty(_toolsMap, _tools.TOOL_LINE, _tools.Line), _defineProperty(_toolsMap, _tools.TOOL_RECTANGLE, _tools.Rectangle), _defineProperty(_toolsMap, _tools.TOOL_ELLIPSE, _tools.Ellipse), _toolsMap);

var SketchPad = function (_Component) {
  _inherits(SketchPad, _Component);

  function SketchPad(props) {
    _classCallCheck(this, SketchPad);

    var _this = _possibleConstructorReturn(this, (SketchPad.__proto__ || Object.getPrototypeOf(SketchPad)).call(this, props));

    _this.tool = null;
    _this.interval = null;

    _this.initTool = _this.initTool.bind(_this);
    _this.onMouseDown = _this.onMouseDown.bind(_this);
    _this.onMouseMove = _this.onMouseMove.bind(_this);
    _this.onDebouncedMove = _this.onDebouncedMove.bind(_this);
    _this.onMouseUp = _this.onMouseUp.bind(_this);
    return _this;
  }

  _createClass(SketchPad, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.canvas = (0, _reactDom.findDOMNode)(this.canvasRef);
      this.ctx = this.canvas.getContext('2d');
      this.initTool(this.props.tool);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(_ref) {
      var _this2 = this;

      var tool = _ref.tool,
          items = _ref.items;

      items.filter(function (item) {
        return _this2.props.items.indexOf(item) === -1;
      }).forEach(function (item) {
        _this2.initTool(item.tool);
        _this2.tool.draw(item, _this2.props.animate);
      });
      this.initTool(tool);
    }
  }, {
    key: 'initTool',
    value: function initTool(tool) {
      this.tool = this.props.toolsMap[tool](this.ctx);
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      var _tool;

      var data = (_tool = this.tool).onMouseDown.apply(_tool, _toConsumableArray(this.getCursorPosition(e)).concat([this.props.color, this.props.size, this.props.fillColor]));
      data && data[0] && this.props.onItemStart && this.props.onItemStart.apply(null, data);
      if (this.props.onDebouncedItemChange) {
        this.interval = setInterval(this.onDebouncedMove, this.props.debounceTime);
      }
    }
  }, {
    key: 'onDebouncedMove',
    value: function onDebouncedMove() {
      if (typeof this.tool.onDebouncedMouseMove == 'function' && this.props.onDebouncedItemChange) {
        this.props.onDebouncedItemChange.apply(null, this.tool.onDebouncedMouseMove());
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _tool2;

      var data = (_tool2 = this.tool).onMouseMove.apply(_tool2, _toConsumableArray(this.getCursorPosition(e)));
      data && data[0] && this.props.onEveryItemChange && this.props.onEveryItemChange.apply(null, data);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      var _tool3;

      var data = (_tool3 = this.tool).onMouseUp.apply(_tool3, _toConsumableArray(this.getCursorPosition(e)));
      data && data[0] && this.props.onCompleteItem && this.props.onCompleteItem.apply(null, data);
      if (this.props.onDebouncedItemChange) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  }, {
    key: 'getCursorPosition',
    value: function getCursorPosition(e) {
      var _canvas$getBoundingCl = this.canvas.getBoundingClientRect(),
          top = _canvas$getBoundingCl.top,
          left = _canvas$getBoundingCl.left;

      return [e.clientX - left, e.clientY - top];
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          width = _props.width,
          height = _props.height,
          canvasClassName = _props.canvasClassName;

      return _react2.default.createElement('canvas', {
        ref: function ref(canvas) {
          _this3.canvasRef = canvas;
        },
        className: canvasClassName,
        onMouseDown: this.onMouseDown,
        onMouseMove: this.onMouseMove,
        onMouseOut: this.onMouseUp,
        onMouseUp: this.onMouseUp,
        width: width,
        height: height
      });
    }
  }]);

  return SketchPad;
}(_react.Component);

SketchPad.propTypes = {
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  items: _react.PropTypes.array.isRequired,
  animate: _react.PropTypes.bool,
  canvasClassName: _react.PropTypes.string,
  color: _react.PropTypes.string,
  fillColor: _react.PropTypes.string,
  size: _react.PropTypes.number,
  tool: _react.PropTypes.string,
  toolsMap: _react.PropTypes.object,
  onItemStart: _react.PropTypes.func, // function(stroke:Stroke) { ... }
  onEveryItemChange: _react.PropTypes.func, // function(idStroke:string, x:number, y:number) { ... }
  onDebouncedItemChange: _react.PropTypes.func, // function(idStroke, points:Point[]) { ... }
  onCompleteItem: _react.PropTypes.func, // function(stroke:Stroke) { ... }
  debounceTime: _react.PropTypes.number
};
SketchPad.defaultProps = {
  width: 500,
  height: 500,
  color: '#000',
  size: 5,
  fillColor: '',
  canvasClassName: 'canvas',
  debounceTime: 1000,
  animate: true,
  tool: _tools.TOOL_PENCIL,
  toolsMap: toolsMap
};
exports.default = SketchPad;