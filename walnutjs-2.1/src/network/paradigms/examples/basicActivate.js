import { Paradigm } from "./../paradigm";

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
