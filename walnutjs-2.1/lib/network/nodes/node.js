"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Node = void 0;
/**
  A Node contains neurons.
  A Node has an Activate function.
  @constructor
  @param {string} path - The unique path of this node within the network
  @param {number} width - The number of neurons width
  @param {number} height - The number of neurons height
  @category Network
 */

class Node {
  constructor(path, width, height) {
    this.path = path;
    this.width = width;
    this.height = height;
    this.size = width * height;

    // neurons_range
    // activate_function
  }
}
exports.Node = Node;