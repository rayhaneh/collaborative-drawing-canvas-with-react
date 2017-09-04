'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TOOL_RECTANGLE = undefined;

var _uuid = require('uuid');

var TOOL_RECTANGLE = exports.TOOL_RECTANGLE = 'rectangle';

exports.default = function (context) {
  var rectangle = null;
  var imageData = null;

  var onMouseDown = function onMouseDown(x, y, color, size, fill) {
    rectangle = {
      id: (0, _uuid.v4)(),
      tool: TOOL_RECTANGLE,
      color: color,
      size: size,
      fill: fill,
      start: { x: x, y: y },
      end: null
    };
    imageData = context.getImageData(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    return [rectangle];
  };

  var drawRectangle = function drawRectangle(item, mouseX, mouseY) {
    var startX = mouseX < item.start.x ? mouseX : item.start.x;
    var startY = mouseY < item.start.y ? mouseY : item.start.y;
    var widthX = Math.abs(item.start.x - mouseX);
    var widthY = Math.abs(item.start.y - mouseY);

    context.beginPath();
    context.lineWidth = item.size;
    context.strokeStyle = item.color;
    context.fillStyle = item.fill;
    context.rect(startX, startY, widthX, widthY);
    context.stroke();
    if (item.fill) context.fill();
  };

  var onMouseMove = function onMouseMove(x, y) {
    if (!rectangle) return;
    context.putImageData(imageData, 0, 0);
    context.save();
    drawRectangle(rectangle, x, y);
    context.restore();
  };

  var onMouseUp = function onMouseUp(x, y) {
    if (!rectangle) return;
    onMouseMove(x, y);
    var item = rectangle;
    imageData = null;
    rectangle = null;
    item.end = { x: x, y: y };
    return [item];
  };

  var draw = function draw(item) {
    return drawRectangle(item, item.end.x, item.end.y);
  };

  return {
    onMouseDown: onMouseDown,
    onMouseMove: onMouseMove,
    onMouseUp: onMouseUp,
    draw: draw
  };
};