"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tract = void 0;
/**
  Tract is a single tract that connects two Nodes.
  It contains connections between those Nodes.
  A Tract has an Activate function and a Learn function.
  @constructor
  @param {string} path - The unique path of this tract within the network
  @param {Node} fromNode - The Node this Tract connects from
  @param {Node} toNode - The Node this Tract connects to
  @category Network
 */
class Tract {
  constructor(path, fromNode, toNode) {
    this.path = path;
    this.fromNode = fromNode;
    this.toNode = toNode;

    // connections_range
    // activate_function
    // learn_function
  }
}
exports.Tract = Tract;