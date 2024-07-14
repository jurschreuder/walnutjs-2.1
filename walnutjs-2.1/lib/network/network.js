"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Network = void 0;
var _nodes = require("./nodes/nodes");
var _tracts = require("./tracts/tracts");
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
  Network is the WalnutJS-2.1 network, containing the Nodes and Tracts.
  @category Network
 */
class Network {
  // for example: network.globalNeurons.act[globalIndex]

  /**
    Create a Network
    @param {string} name - The name of your network
    @param {Paradigm} paradigm - The paradigm to use
  */
  constructor(name, paradigm) {
    _defineProperty(this, "globalNeurons", {});
    this.name = name;
    this.paradigm = paradigm; // default paradigm for tracts and nodes

    this.nodes = new _nodes.Nodes(this);
    this.tracts = new _tracts.Tracts(this);
  }
  get dict() {
    const dict = {
      walnutJsVersion: 2.1,
      dictVersion: 1.0,
      nodes: this.nodes.dict
      //tracts: this.tracts.dict, // TODO
    };
    return dict;
  }
  activate() {}
  learn() {}
}
exports.Network = Network;