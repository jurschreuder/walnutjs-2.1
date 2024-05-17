
/**
  A Node contains neurons.
  A Node has an Activate function.
  @param {Network} network - Reference to the network this Tract belongs to
  @param {string} path - The unique path of this node within the network
  @param {number} width - The number of neurons width
  @param {number} height - The number of neurons height
  @category Network
 */
class Node {

  startNeuronIndex = 0;
  endNeuronIndex = 0;

  // tracts that go in and out of this node
  outTracts = [];
  inTracts = [];
    

  /**
    Create a Node
    @param {Network} network - Reference to the network this Tract belongs to
    @param {string} path - The unique path of this node within the network
    @param {number} width - The number of neurons width
    @param {number} height - The number of neurons height
    @param {Paradigm} [paradigm] - The Paradigm providing the nodeActivateFunction, nodeLearnFunction and other settings. If not provided the Network paradigm will be used
   */
  constructor(network, path, width, height, paradigm) {
    this.network = network;

    this.path = path;

    this.width = width;
    this.height = height;
    this.flatSize = width*height;

    this.paradigm = paradigm || this.network.paradigm;
    
    // add activate function from paradigm
    if(!this.paradigm.nodeActivateFunction){
      throw new Error("Node "+path+"does not have a nodeActivateFunction in its paradigm");
    }
    this.activateFunction = this.paradigm.nodeActivateFunction;

    // add learn function from paradigm
    if(!this.paradigm.nodeLearnFunction){
      throw new Error("Node "+path+"does not have a nodeLearnFunction in its paradigm");
    }
    this.learnFunction = this.paradigm.nodeLearnFunction;

  }

  get dict(){
    const dict = {
      path: this.path,
      width: this.width,
      height: this.height,
      flatSize: this.flatSize,
      paradigmName: this.paradigm.name,
      startNeuronIndex: this.startNeuronIndex,
      endNeuronIndex: this.endNeuronIndex
    }
    return dict;
  }

  /**
   Add a tract that connects to this Node
   @param {Tract} - Tract to add
  */
  addOutTract(tract){
    this.outTracts.push(tract);
  }

  /**
   Add a tract that connects to from Node
   @param {Tract} - Tract to add
  */
  addInTract(tract){
    this.inTracts.push(tract);
  }

  /**
   Set a neuron value manually based on the neuron local index
   @param {string} nodeVariable - For example 'net' or 'act'
   @param {number} index - The local neuron index within this node
   @param {number} value - The value to set
  */
  setNeuronAtIndex(nodeVariable, index, value){
    this.network.nodes.neurons[nodeVariable][index + this.startNeuronIndex] = value;
  }

  /**
   Set a neuron value manually based on the neuron location
   @param {string} nodeVariable - For example 'net' or 'act'
   @param {number} x - The neuron x location within this node
   @param {number} y - The  neuron y location within this node
   @param {number} value - The value to set
  */
  setNeuronAtXy(nodeVariable, x, y, value){
    const index = y * this.width + x;
    this.setNeuronAtIndex(nodeVariable, index, value);
  }


  /**
   Use the activateFunction on all outTracts of this Node
  */
  activate(){
  
    // activate nodes
    if(this.activateFunction){ 
      for(let i = this.startNeuronIndex; i < this.endNeuronIndex; i++){
        this.activateFunction(this.network, i);
      }
    }else{
      console.warn("No activateFunction provided for node", this);
    }

    // activate outTracts
    for(let i = 0; i < this.outTracts.length; i++){
      this.outTracts[i].activate();
    }

  }

  /**
   Use the learnFunction on all outTracts of this Node
  */
  learn(){
  
    // learn nodes
    if(this.learnFunction){ 
      this.learnFunction();
    }else{
      console.warn("No learnFunction provided for node", this);
    }

    // learn outTracts
    for(let i = 0; i < this.outTracts.length; i++){
      const outTract = this.outTracts[i];
      if(outTract.learnFunction){
        outTract.learnFunction();
      }else{
        console.warn("No learnFunction provided for tract", outTract);
      }
    }

    // TODO should we learn inTracts instead? Or make it a setting?

  }

}


export { Node }



