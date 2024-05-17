
import { Nodes } from "./nodes/nodes";
import { Tracts } from "./tracts/tracts";

/**
  Network is the WalnutJS-2.0 network, containing the Nodes and Tracts.
  @category Network
 */
class Network {

  globalNeurons = {}; // for example: network.globalNeurons.act[globalIndex]

  /**
    Create a Network
    @param {string} name - The name of your network
    @param {Paradigm} paradigm - The paradigm to use
  */
  constructor(name, paradigm) {
    this.name = name;

    this.paradigm = paradigm; // default paradigm for tracts and nodes
    
    this.nodes = new Nodes(this);

    this.tracts = new Tracts(this);

  }

  activate(){

  }

  learn(){

  }

}


export { Network }
