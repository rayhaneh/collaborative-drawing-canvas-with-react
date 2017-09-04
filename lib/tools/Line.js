'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TOOL_LINE = undefined;

var _uuid = require('uuid');

var TOOL_LINE = exports.TOOL_LINE = 'line';

exports.default = function (context) {
  var line = null;
  var imageData = null;

  var onMouseDown = function onMouseDown(x, y, color, size) {
    line = {
      id: (0, _uuid.v4)(),
      tool: TOOL_LINE,
      color: color,
      size: size,
      start: { x: x, y: y },
      end: null
    };
    imageData = context.getImageData(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    return [line];
  };

  var drawLine = function drawLine(item, x, y) {
    context.save();
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.beginPath();
    context.lineWidth = item.size;
    context.strokeStyle = item.color;
    context.globalCompositeOperation = 'source-over';
    context.moveTo(item.start.x, item.start.y);
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    context.restore();
  };

  var onMouseMove = function onMouseMove(x, y) {
    if (!line) return;
    context.putImageData(imageData, 0, 0);
    drawLine(line, x, y);
  };

  var onMouseUp = function onMouseUp(x, y) {
    if (!line) return;
    onMouseMove(x, y);
    var item = line;
    imageData = null;
    line = null;
    item.end = { x: x, y: y };
    return [item];
  };

  var draw = function draw(item) {
    return drawLine(item, item.end.x, item.end.y);
  };

  return {
    onMouseDown: onMouseDown,
    onMouseMove: onMouseMove,
    onMouseUp: onMouseUp,
    draw: draw
  };
};