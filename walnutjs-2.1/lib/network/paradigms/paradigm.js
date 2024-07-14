"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Paradigm = exports.NodeVariable = void 0;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
   NodeVariable
   All neurons will have variables with as a key the provided name
  */
class NodeVariable {
  /**
    Create a NodeVariable
    @param {string} name - Reference to the network this Tract belongs to
    @param {(float32|int32|int8)} [type] - The type of array to create for variable
    @param {number} [defaultValue=0.0] - Default value, defaults to 0.0
    @param {number[]} [range] - Visualization range, defaults to [-1, 1]
   */
  constructor(name, type, defaultValue, range) {
    this.name = name; // key
    this.type = type || "float32"; // Float32Array, Int8Array, etc
    this.defaultValue = defaultValue || 0.0; // default value
    this.range = range || [-1, 1]; // min and max for coloring
  }

  /**
    Check if this node variable is conflicting with another node variable with the same name
    @param {NodeVariable} nodeVariable - The node variable to compare
   */
  checkSimilar(nodeVariable) {
    const nv = nodeVariable;
    if (this.type !== nv.type) {
      throw new Error("Conflicting nodeVariable: " + this.name + " type: " + this.type + " and " + nv.type);
    }
    if (this.default !== nv.default) {
      throw new Error("Conflicting nodeVariable: " + this.name + " default: " + this.default + " and " + nv.default);
    }
    if (this.range[0] !== nv.range[0] || this.range[1] !== this.range[1]) {
      throw new Error("Conflicting nodeVariable: " + this.name + " range: " + this.range + " and " + nv.range);
    }
  }
}

/**
  Paradigm
  You can extend and customize this class to create your own paradigm.
  Examples privided in the src/paradigms/examples folder.
 */
exports.NodeVariable = NodeVariable;
class Paradigm {
  /**
    Create a Paradigm
    @param {string} name - Name of the paradigm
   */
  constructor(name) {
    _defineProperty(this, "nodeActivateFunction", (network, neuronIndex) => {});
    _defineProperty(this, "nodeLearnFunction", (network, neuronIndex) => {});
    _defineProperty(this, "tractActivateFunction", (network, connectionIndex) => {});
    _defineProperty(this, "tractLearnFunction", (network, connectionIndex) => {});
    // default net and act, net is before the node activation function, act is after
    _defineProperty(this, "nodeVariables", [new NodeVariable("net"), new NodeVariable("act")]);
    _defineProperty(this, "nodeHistVariables", ["act"]);
    // history, length of history is defined in the Network
    _defineProperty(this, "tractVariables", ["weight"]);
    this.name = name;
  }
}
exports.Paradigm = Paradigm;