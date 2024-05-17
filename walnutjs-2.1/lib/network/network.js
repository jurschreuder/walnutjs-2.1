"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Network = void 0;
var _nodes = require("./nodes/nodes");
var _tracts = require("./tracts/tracts");
/**
  Network is the WalnutJS-2.0 network, containing the Nodes and Tracts.
  @constructor
  @param {string} name - The name of your network
  @category Network
 */
class Network {
  constructor(name) {
    this.name = name;
    this.nodes = new _nodes.Nodes();
    this.tracts = new _tracts.Tracts();
  }
}
exports.Network = Network;