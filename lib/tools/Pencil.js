'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TOOL_PENCIL = undefined;

var _uuid = require('uuid');

var TOOL_PENCIL = exports.TOOL_PENCIL = 'pencil';

exports.default = function (context) {
  var stroke = null;
  var points = [];

  var onMouseDown = function onMouseDown(x, y, color, size) {
    stroke = {
      id: (0, _uuid.v4)(),
      tool: TOOL_PENCIL,
      color: color,
      size: size,
      points: [{ x: x, y: y }]
    };
    return [stroke];
  };

  var drawLine = function drawLine(item, start, _ref) {
    var x = _ref.x,
        y = _ref.y;

    context.save();
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.beginPath();
    context.lineWidth = item.size;
    context.strokeStyle = item.color;
    context.globalCompositeOperation = 'source-over';
    context.moveTo(start.x, start.y);
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    context.restore();
  };

  var onMouseMove = function onMouseMove(x, y) {
    if (!stroke) return [];
    var newPoint = { x: x, y: y };
    var start = stroke.points.slice(-1)[0];
    drawLine(stroke, start, newPoint);
    stroke.points.push(newPoint);
    points.push(newPoint);

    return [stroke];
  };

  var onDebouncedMouseMove = function onDebouncedMouseMove() {
    var debouncedPoints = points;
    points = [];
    return [stroke, debouncedPoints];
  };

  var onMouseUp = function onMouseUp(x, y) {
    if (!stroke) return;
    onMouseMove(x, y);
    points = [];
    var item = stroke;
    stroke = null;
    return [item];
  };

  var draw = function draw(item, animate) {
    var time = 0;
    var i = 0;
    var j = item.points.length;
    for (i, j; i < j; i++) {
      if (!item.points[i - 1]) continue;
      if (animate) {
        setTimeout(drawLine.bind(null, item, item.points[i - 1], item.points[i]), time);
        time += 10;
      } else {
        drawLine(item, item.points[i - 1], item.points[i]);
      }
    }
  };

  return {
    onMouseDown: onMouseDown,
    onMouseMove: onMouseMove,
    onDebouncedMouseMove: onDebouncedMouseMove,
    onMouseUp: onMouseUp,
    draw: draw
  };
};