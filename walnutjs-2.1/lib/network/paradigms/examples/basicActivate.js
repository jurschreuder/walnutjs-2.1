"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicActivate = void 0;
var _paradigm = require("./../paradigm");
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class BasicActivate extends _paradigm.Paradigm {
  constructor() {
    super("basic activate");
    // activation rule ReLU
    _defineProperty(this, "nodeActivateFunction", (network, neuronIndex) => {
      const i = neuronIndex;
      const neurons = network.nodes.neurons;
      neurons.act[i] = neurons.net[i] > 0 ? neurons.net[i] : 0;
    });
    // basic activation function tracts,
    // net += act * weight 
    _defineProperty(this, "tractActivateFunction", (network, connectionIndex) => {
      const i = connectionIndex;
      const neurons = network.nodes.neurons;
      const conns = network.tracts.connections;
      neurons.net[conns.to[i]] += neurons.act[conns.from[i]] * conns.weight[i];
    });
  }
}
exports.BasicActivate = BasicActivate;