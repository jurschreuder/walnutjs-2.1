
import { Node } from "./node";
import { NodeVariable } from "./../paradigms/paradigm";

/**
  Nodes contains all the Nodes of the Network.
  @category Network
 */
class Nodes {

  nodes = []; // Node
  nodePaths = {}; // nodePaths[ <path> ] = Node

  // neurons_global
  neurons = {}; // neurons[nodeVariable][val,val,val,...]
  neuronsLen = 0; // number of neurons so far

  // keep track of all the node variables added tot he node so far
  nodeVariables = [];
  
  activationIter = 0; // To keep track of the ring buffer for the activation history

  /**
    Create Nodes
    @param {Network} network - Reference to the network this Tract belongs to
    @param {number} [historyLength=1] - You need to keep track of the node activation history to do things like axon delay and STDP.
   */
  constructor(network, historyLength=1) {
    this.network = network;

    this.historyLength = historyLength; 
  }

  get dict(){
    const dict = {
      nodes: [],
      neurons: this.neurons,
      neuronsLen: this.neuronsLen,
      nodeVariables: this.nodeVariables,
      activationIter: this.activationIter
    }
    for(let i = 0; i < this.nodes.length; i++){
      dict.nodes.push(this.nodes[i].dict); 
    }
    return dict;
  }

  fromDict(dict){
    this.nodeVariables = dict.nodeVariables;
    for(let i = 0; i < dict.nodes.length; i++){
      const d = dict.nodes[i];
      const node = new Node(this.network, d.path, d.width, d.height);
      this.addNode(node, true);
    }
    this.initNeurons();
  }

  /**
   Get a node using the node's path
   @param {string} path - Node path
   @return {Node}
   */
  getNodeByPath(path){
    if(path in this.nodePaths){
      return this.nodePaths[path];
    } //else
    throw new Error("Node path does not exist: "+path);
  }

  /**
   Use the activateFunction on all Nodes
  */
  activate(){
    this.activationIter++;

    // TODO perform activation_sequence

    // TODO just a naive placeholder, sequential
    for(let i = 0; i < this.nodes.length; i++){
      this.nodes[i].activate();
    }

  }

  /**
   Set the 'act' of all nodes to zero again
  */
  clearAct(){
    this.clearNodeVariable('act');
  }

  /**
   Set the 'net' of all nodes to zero again
  */
  clearNet(){
    this.clearNodeVariable('net');
  }

  /**
   Set the of all nodes to zero again of a specific nodeVariable
   @param {string} nodeVariable - variable to clear
  */
  clearNodeVariable(nodeVariable){
    this.neurons[nodeVariable].fill(0);
    //console.log("clearing", this.neuronsLen);
    //for(let i = 0; i < this.neuronsLen; i++){
    //  this.neurons[nodeVariable][i] = 0.0;
    //}
  }


  /**
   Use the learnFunction on all Nodes
  */
  learn(){

    // TODO perform learn_sequence
   
    // TODO just a naive placeholder, sequential
    
    for(let i = 0; i < this.nodes.length; i++){
      this.nodes[i].learn();
    }
    
  }

  /**
    Check if a Node path already exists
    @param {string} path - The Node path to check
    @return {bool} true if path exists
   */
  pathExists(path){
    for(let i = 0; i < this.nodes.length; i++){
      if(this.nodes[i].path === path){
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
  addNode(node, skipInit){
    if(this.pathExists(node.path)){
      throw new Error("Node path already exists: "+node.path);
    }

    this.nodes.push(node);
    this.nodePaths[node.path] = node;

    this.addNeurons(node);
    if(!skipInit){
      this.initNeurons();
    }
  }

  /**
    Add global neurons to the nodes, based on the paradigm used
    @param {Node} node - Node to process
   */
  addNeurons(node){
    const paradigm = node.paradigm;
    const neuronsN = node.flatSize;

    // see if there is a nodeVariable still missing that's added with this paradigm
    for(let i = 0; i < paradigm.nodeVariables.length; i++){
      let found = false;
      const nodeVar = paradigm.nodeVariables[i];
      for(let j = 0; j < this.nodeVariables.length; j++){
        const nodeVar2 = this.nodeVariables[j];

        if(nodeVar.name === nodeVar2.name){
          found = true;
          // check if there is a conflict
          nodeVar.checkSimilar(nodeVar2);
        }
      }
      // fill in missing nodeVariables for the neurons so far
      if(!found){
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
  initNeurons(){
    this.neurons = {}; // fresh clean start
    for(let i = 0; i < this.nodeVariables.length; i++){
      const nodeVar = this.nodeVariables[i];
      if(nodeVar.type === "int32"){
        this.neurons[nodeVar.name] = new Int32Array(this.neuronsLen);
      }
      else if(nodeVar.type === "int8"){
        this.neurons[nodeVar.name] = new Int8Array(this.neuronsLen);
      }
      else if(nodeVar.type === "float32"){
        this.neurons[nodeVar.name] = new Float32Array(this.neuronsLen);
      }
      else{
        throw new Error("Unknown nodeVariable type: "+ nodeVar.type);
      }
      this.neurons[nodeVar.name].fill(nodeVar.defaultValue);
    }
  }

}


export { Nodes }


