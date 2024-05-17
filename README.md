walnutjs-2.1
===

**Jaap Murre and Jurriaan Schreuder, University of Amsterdam, 2019-2024**

A framework for neurocognitive neural network modelling in JavaScript with a 37-year history.

## Approach

Contrary to most other neurosimulators, including the predecessors to this version, Walnut 2.1 aims to have a stricter
division of labor between:

 - neural network *architecture*
 - neural algorithms (colled in so called neural *paradigms*)
 - *display* for visualization and interaction

## History: Walnut neurosimulator, Walnut Nutshell, Walnut.py, and WalnutJS 1.0

Predecessors to Walnut were developed in C by Jaap Murre at Leiden University from 1988 to 1992,
including the Metanet neurosimulator with Steven Kleynenberg.

The Walnut neurosimulator with the Walnut Nutshell interactive graphical user-interface was developed
in C++ in the late 90s by Jaap Murre at the NeuroMod group (still
[downloadable](http://www.neuromod.org/static/walnut/index.html) and runnable on Windows. It is a fast neural network simulator with
a graphical shell called 'Nutshell'. It is extendable with new neural network
paradigms, though in practice this requires advanced knowledge of C++ and compilation techniques (and by now, access to
some pretty retro compilation software).

In 2000, an unreleased Python version, walnut.py, was developed for research purposes in the NeuroMod group
(see [neuromod.org](http://neuromod.org)) and in 2004, Jaap Murre wrote a JavaScript version, mainly for
for teaching purposes, which was used until recently: walnutJS 1.0  (see [demos and lessons](http://murre.com/connectionism/) developed
for a course on Connectionist Models), which was not officially released either.


# Getting started


### Installation

This project uses yarn workspaces so walnutjs-2.1 (npm package) and walnutjs-2.1-studio (vue3 frontend) can be easily installed in one go locally.

In the root folder of this git repository do:

```sh
yarn install
```

### Running the tests

To run the test of the walnutsj-2.1 npm package (subfolder)

```
cd walnut-js
yarn test
```

### Generate the docs

To generate the docs of the walnutsj-2.1 npm package (subfolder)

```
cd walnut-js
yarn docs
```

The docs will be found in `walnutjs-2.1/docs`.



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

# Basic example of a custom Paradigm

```js

import { Paradigm } from "walnutjs-2.1/network/paradigms/paradigm";

class BasicActivate extends Paradigm {
 
  // activation rule ReLU
  nodeActivateFunction = (network, neuronIndex) => {
    const i = neuronIndex;
    const neurons = network.nodes.neurons;

    neurons.act[i] = neurons.net[i] > 0 ? neurons.net[i] : 0;
  };
  
  // basic activation function tracts,
  // net += act * weight 
  tractActivateFunction = (network, connectionIndex) => {
    const i = connectionIndex;
    const neurons = network.nodes.neurons;
    const conns = network.tracts.connections;

    neurons.net[conns.to[i]] +=  neurons.act[conns.from[i]] * conns.weight[i];
  };

  constructor() {
    super("basic activate");
  }
}

export { BasicActivate }

```

# walnutjs-2.1-studio

Visual builder and analytics tool for walnutjs-2.1 networks.

### Running locally

```sh
cd walnutjs-2.1-studio
yarn dev
```

*more soon...*
