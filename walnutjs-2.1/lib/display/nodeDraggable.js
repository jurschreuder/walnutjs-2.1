"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodeDraggable = void 0;
require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var _dragStart = /*#__PURE__*/new WeakMap();
/**
  A NodeDraggable contains the information to draw a node in the visual builder.
  It also has  basic functions to move it around by dragging.

  @param {Node} node - Reference to the network this Tract belongs to

  @param {number} snapPx - Snap to pixels when dragging
  @param {string} color - Color of the element when drawing
  @param {string} label - Label to display, defaults to last part of path
  @param {boolean} showLabel - Show the label or not
  @param {number} neuronPxSize - How many pixels are used to draw a neuron, determines the w (width) and h (height)

  @param {number} x - The x position of the visual element
  @param {number} y - The y position of the visual element
  @param {number} w - The width of the visual element. Do not change manually, change neuronPxSize
  @param {number} h - The height of the visual element. Do not change manually, change neuronPxSize

 */

class NodeDraggable {
  /**
    Create a NodeDraggable
    @param {Node} node - The node to draw
    @param {number} x - The x position in the visual builder
    @param {number} y - The y position in the visual builder
    @param {string} [color='#444'] - Hex color to give to the element
  */
  constructor(node, x, y, color) {
    // config
    _defineProperty(this, "snapPx", 10);
    _defineProperty(this, "color", "#444");
    _defineProperty(this, "label", "Node");
    _defineProperty(this, "showLabel", true);
    _defineProperty(this, "neuronPxSize", 4);
    // position
    _defineProperty(this, "x", 0);
    _defineProperty(this, "y", 0);
    _defineProperty(this, "w", 10);
    _defineProperty(this, "h", 10);
    // state
    _defineProperty(this, "selected", false);
    _defineProperty(this, "isDragging", false);
    // hierarchy
    _defineProperty(this, "parent", false);
    _defineProperty(this, "children", []);
    // local variable used for dragging
    _classPrivateFieldInitSpec(this, _dragStart, {
      xStartLocal: 0,
      yStartLocal: 0,
      xStart: 0,
      yStart: 0
    });
    this.node = node;
    this.x = x;
    this.y = y;
    this.color = color | "#444";
    this.w = node.width * this.neuronPxSize;
    this.h = node.height * this.neuronPxSize;
    this.label = node.path.split("/").at(-1);
  }
  set neuronPxSize(px) {
    this.neuronPxSize = px;
    this.w = node.width * this.neuronPxSize;
    this.h = node.height * this.neuronPxSize;
  }
  set w(val) {
    throw Exception("Do not set this manually, change 'neuronPxSize' instead");
  }
  set h(val) {
    throw Exception("Do not set this manually, change 'neuronPxSize' instead");
  }
  startDragging(xStartLocal, yStartLocal, xStart, yStart) {
    this.isDragging = true;
    _classPrivateFieldSet(_dragStart, this, {
      xStartLocal: xStartLocal,
      yStartLocal: yStartLocal,
      xStart: xStart,
      yStart: yStart
    });
    //console.log("startDragging", this);
  }

  /**
    Move the draggable to a location.
    Call 'startDragging' first, to save the relative position of the mouse inside the element while dragging. 
    @param {number} x - x location
    @param {number} y - y location
  */
  move(x, y) {
    if (!this.isDragging) {
      return;
    }
    this.x = x - _classPrivateFieldGet(_dragStart, this).xStartLocal;
    this.y = y - _classPrivateFieldGet(_dragStart, this).yStartLocal;

    // snap
    this.x -= this.x % this.snapPx;
    this.y -= this.y % this.snapPx;

    //console.log("move to", this.x, this.y);
  }
}
exports.NodeDraggable = NodeDraggable;