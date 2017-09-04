'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TOOL_ELLIPSE = undefined;

var _uuid = require('uuid');

var TOOL_ELLIPSE = exports.TOOL_ELLIPSE = 'ellipse';

exports.default = function (context) {
  var ellipse = null;
  var imageData = null;

  var onMouseDown = function onMouseDown(x, y, color, size, fill) {
    ellipse = {
      id: (0, _uuid.v4)(),
      tool: TOOL_ELLIPSE,
      color: color,
      size: size,
      fill: fill,
      start: { x: x, y: y },
      end: null
    };
    imageData = context.getImageData(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    return [ellipse];
  };

  var drawEllipsePolifyll = function drawEllipsePolifyll(centerX, centerY, radiusX, radiusY) {
    var xPos = void 0;
    var yPos = void 0;
    var i = 0;
    for (i; i < 2 * Math.PI; i += 0.01) {
      xPos = centerX - radiusY * Math.sin(i) * Math.sin(0) + radiusX * Math.cos(i) * Math.cos(0);
      yPos = centerY + radiusX * Math.cos(i) * Math.sin(0) + radiusY * Math.sin(i) * Math.cos(0);
      if (i === 0) {
        context.moveTo(xPos, yPos);
      } else {
        context.lineTo(xPos, yPos);
      }
    }
  };

  var drawEllipse = function drawEllipse(item, mouseX, mouseY) {
    var startX = mouseX < item.start.x ? mouseX : item.start.x;
    var startY = mouseY < item.start.y ? mouseY : item.start.y;
    var endX = mouseX >= item.start.x ? mouseX : item.start.x;
    var endY = mouseY >= item.start.y ? mouseY : item.start.y;
    var radiusX = (endX - startX) * 0.5;
    var radiusY = (endY - startY) * 0.5;
    var centerX = startX + radiusX;
    var centerY = startY + radiusY;

    context.save();
    context.beginPath();
    context.lineWidth = item.size;
    context.strokeStyle = item.color;
    context.fillStyle = item.fill;

    if (typeof context.ellipse === 'function') {
      context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    } else {
      drawEllipsePolifyll(centerX, centerY, radiusX, radiusY);
    }
    context.stroke();
    if (item.fill) context.fill();
    context.closePath();
    context.restore();
  };

  var onMouseMove = function onMouseMove(x, y) {
    if (!ellipse) return;
    context.putImageData(imageData, 0, 0);
    drawEllipse(ellipse, x, y);
  };

  var onMouseUp = function onMouseUp(x, y) {
    if (!ellipse) return;
    onMouseMove(x, y);
    var item = ellipse;
    imageData = null;
    ellipse = null;
    item.end = { x: x, y: y };
    return [item];
  };

  var draw = function draw(item) {
    return drawEllipse(item, item.end.x, item.end.y);
  };

  return {
    onMouseDown: onMouseDown,
    onMouseMove: onMouseMove,
    onMouseUp: onMouseUp,
    draw: draw
  };
};