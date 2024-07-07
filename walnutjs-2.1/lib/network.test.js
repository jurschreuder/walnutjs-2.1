"use strict";

require("core-js/modules/es.json.stringify.js");
var _walnutjs = require("walnutjs-2.1");
test('basic network', () => {
  // load a basic paradigm
  const paradigm = new _walnutjs.BasicActivate();

  // create a network
  const network = new _walnutjs.Network("test", paradigm);
  expect(network.name).toBe("test");

  // add inNode
  const inNode = new _walnutjs.Node(network, "input", 4, 4);
  network.nodes.addNode(inNode);

  // add outNode
  const outNode = new _walnutjs.Node(network, "output", 4, 4);
  network.nodes.addNode(outNode);
  console.log("nodes so far:\n\n", JSON.stringify(network.nodes.dict, null, " "));

  // add tract between inNode and outNode
  const tract1 = new _walnutjs.Tract(network, "tract1", inNode, outNode);
  // connect sparse
  tract1.connectBasicLinear(0.5, -1, 1);
  // add
  network.tracts.addTract(tract1);

  // set some inNode neurons to activated
  for (let i = 0; i < 8; i++) {
    inNode.setNeuronAtIndex("net", i, 1.0);
  }

  // activate nodes
  network.nodes.activate();

  // check if activation activated some outNodes
  console.log(network.nodes.neurons.net);
});