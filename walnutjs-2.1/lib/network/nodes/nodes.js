"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Nodes = void 0;
require("core-js/modules/es.array-buffer.slice.js");
require("core-js/modules/es.typed-array.float32-array.js");
require("core-js/modules/es.typed-array.int8-array.js");
require("core-js/modules/es.typed-array.int32-array.js");
require("core-js/modules/es.typed-array.fill.js");
require("core-js/modules/es.typed-array.set.js");
require("core-js/modules/es.typed-array.sort.js");
require("core-js/modules/es.typed-array.to-locale-string.js");
var _node = require("./node");
var _paradigm = require("./../paradigms/paradigm");
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
  Nodes contains all the Nodes of the Network.
  @category Network
 */
class Nodes {
  // To keep track of the ring buffer for the activation history

  /**
    Create Nodes
    @param {Network} network - Reference to the network this Tract belongs to
    @param {number} [historyLength=1] - You need to keep track of the node activation history to do things like axon delay and STDP.
   */
  constructor(network) {
    let historyLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    _defineProperty(this, "nodes", []);
    // Node
    _defineProperty(this, "nodePaths", {});
    // nodePaths[ <path> ] = Node
    // neurons_global
    _defineProperty(this, "neurons", {});
    _defineProperty(this, "neuronsLen", 0);
    // number of neurons so far
    // keep track of all the node variables added tot he node so far
    _defineProperty(this, "nodeVariables", []);
    _defineProperty(this, "activationIter", 0);
    this.network = network;
    this.historyLength = historyLength;
  }
  get dict() {
    const dict = {
      nodes: [],
      neurons: this.neurons,
      neuronsLen: this.neuronsLen,
      nodeVariables: this.nodeVariables,
      activationIter: this.activationIter
    };
    for (let i = 0; i < this.nodes.length; i++) {
      dict.nodes.push(this.nodes[i].dict);
    }
    return dict;
  }

  /**
   Get a node using the node's path
   @param {string} path - Node path
   @return {Node}
   */
  getNodeByPath(path) {
    if (path in this.nodePaths) {
      return this.nodePaths[path];
    } //else
    throw new Error("Node path does not exist: " + path);
  }

  /**
   Use the activateFunction on all Nodes
  */
  activate() {
    this.activationIter++;

    // TODO perform activation_sequence

    // TODO just a naive placeholder, sequential

    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].activate();
    }
  }

  /**
   Use the learnFunction on all Nodes
  */
  learn() {
    // TODO perform learn_sequence

    // TODO just a naive placeholder, sequential

    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].learn();
    }
  }

  /**
    Check if a Node path already exists
    @param {string} path - The Node path to check
    @return {bool} true if path exists
   */
  pathExists(path) {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].path === path) {
        return true;
      }
    }
    return false;
  }

  /**
    Add a Node containing neurons to a network
    @param {Node} node
    @param {boolean} [skipInit] - Don't initialize the neurons already after adding the node (duplicate work when adding multiple nodes)
   */
  addNode(node, skipInit) {
    if (this.pathExists(node.path)) {
      throw new Error("Node path already exists: " + node.path);
    }
    this.nodes.push(node);
    this.nodePaths[node.path] = node;
    this.addNeurons(node);
    if (!skipInit) {
      this.initNeurons();
    }
  }

  /**
    Add global neurons to the nodes, based on the paradigm used
    @param {Node} node - Node to process
   */
  addNeurons(node) {
    const paradigm = node.paradigm;
    const neuronsN = node.flatSize;

    // see if there is a nodeVariable still missing that's added with this paradigm
    for (let i = 0; i < paradigm.nodeVariables.length; i++) {
      let found = false;
      const nodeVar = paradigm.nodeVariables[i];
      for (let j = 0; j < this.nodeVariables.length; j++) {
        const nodeVar2 = this.nodeVariables[j];
        if (nodeVar.name === nodeVar2.name) {
          found = true;
          // check if there is a conflict
          nodeVar.checkSimilar(nodeVar2);
        }
      }
      // fill in missing nodeVariables for the neurons so far
      if (!found) {
        this.nodeVariables.push(nodeVar);
      }
    }

    // add then new neurons
    let startNeuron = this.neuronsLen;
    this.neuronsLen += neuronsN;

    // set the start neuron
    node.startNeuronIndex = startNeuron;
    node.endNeuronIndex = this.neuronsLen;
  }

  /**
    initNeurons adds the memory layout, creates the arrays for all the
    nodeVariables.
    This needs to be called every time the architecture changes.
   */
  initNeurons() {
    this.neurons = {}; // fresh clean start
    for (let i = 0; i < this.nodeVariables.length; i++) {
      const nodeVar = this.nodeVariables[i];
      if (nodeVar.type === "int32") {
        this.neurons[nodeVar.name] = new Int32Array(this.neuronsLen);
      } else if (nodeVar.type === "int8") {
        this.neurons[nodeVar.name] = new Int8Array(this.neuronsLen);
      } else if (nodeVar.type === "float32") {
        this.neurons[nodeVar.name] = new Float32Array(this.neuronsLen);
      } else {
        throw new Error("Unknown nodeVariable type: " + nodeVar.type);
      }
    }
  }
}
exports.Nodes = Nodes;