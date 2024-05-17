walnutjs-2.1
===

A Neural Network Library in JavaScript.

## walnutjs-2.1

The neural network library, npm package.

## walnutjs-2.1-studio

Visual builder and analytics tool for walnutjs-2.1 networks.

# Getting started

```sh
clone the repository

cd walnutjs-2.1
yarn install

cd walnutjs-2.1-studio
yarn dev

```

# Creating a basic network

```js

import { Network } from "walnutjs-2.1/network/network.js";
import { Node } from "walnutjs-2.1/network/nodes/node.js";
import { Tract } from "walnutjs-2.1/network/tracts/tract.js";

import { BasicActivate } from "walnutjs-2.1/network/paradigms/examples/basicActivate.js";


// load a basic paradigm
const paradigm = new BasicActivate();

// create a network
const network = new Network("test", paradigm);
expect(network.name).toBe("test");

// add inNode
const inNode = new Node(network, "input", 4, 4);
network.nodes.addNode(inNode);

// add outNode
const outNode = new Node(network, "output", 4, 4);
network.nodes.addNode(outNode);

console.log("nodes so far:\n\n", JSON.stringify(network.nodes.dict, null, " "));

// add tract between inNode and outNode
const tract1 = new Tract(network, "tract1", inNode, outNode);
// connect sparse
tract1.connectBasicLinear(0.5, -1, 1);
// add
network.tracts.addTract(tract1);

// set some inNode neurons to activated
for(let i = 0; i < 8; i++){
  inNode.setNeuronAtIndex("net", i, 1.0);
}

// activate nodes
network.nodes.activate()

// check if activation activated some outNodes
console.log(network.nodes.neurons.net);


```
