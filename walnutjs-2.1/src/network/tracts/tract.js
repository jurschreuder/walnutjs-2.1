
/**
  Tract is a single tract that connects two Nodes.
  It contains connections between those Nodes.
  A Tract has an Activate function and a Learn function.
  @category Network
 */
class Tract {

  connections = [];
  startConnectionIndex = 0;
  endConnectionIndex = 0;

  // axon + synapse delay (in iterations), defaults to 0
  delay = 0;

  // display arrow
  arrow = { color: "#000", width: 2.0, fromDraggable: false, toDraggable: false };

  /**
    Create a Tract
    @param {Network} network - Reference to the network this Tract belongs to
    @param {string} path - The unique path of this tract within the network
    @param {Node} fromNode - The Node this Tract connects from
    @param {Node} toNode - The Node this Tract connects to
    @param {Paradigm} [paradigm] - The Paradigm providing the tractActivateFunction, tractLearnFunction and other settings
   */
  constructor(network, path, fromNode, toNode, paradigm) {
    this.network = network;

    this.path = path;

    this.fromNode = fromNode;
    this.toNode = toNode;

    this.paradigm = paradigm || network.paradigm;


    // add activate function from paradigm
    if(!this.paradigm.tractActivateFunction){
      throw new Error("Tract "+path+"does not have a tractActivateFunction in its paradigm");
    }
    this.activateFunction = this.paradigm.tractActivateFunction;

    // add learn function from paradigm
    if(!this.paradigm.tractLearnFunction){
      throw new Error("Tract "+path+"does not have a tractLearnFunction in its paradigm");
    }

    this.learnFunction = this.paradigm.tractLearnFunction;
    
  }

  /**
    Add a connection
    @param {Object.<string, number>} connection - Connection tractVariable and value
   */
  addConnection(connection){
    this.connections.push(connection); 
  }


  /**
   Use the activateFunction on all connections of this Tract
  */
  activate(){
  
    // activate tract
    if(this.activateFunction){ 
      for(let i = this.startConnectionIndex; i < this.endConnectionIndex; i++){
        this.activateFunction(this.network, i);
      }
    }else{
      console.warn("No activateFunction provided for tract", this);
    }

  }

  /**
    Add connections between fromNode and toNode with a weight value generator
    @param {number} sparcity - Number between 0.0 and 1.0 how many of the possible connections to make (1.0 is all)
    @param {function(): number} weightGenerator - Function that generates random weight values, for example 
                                                  () => { return Math.random(); }
   */
  connectBasicGenerator(sparcity, weightGenerator){
    // check if there are even any neurons
    if(this.fromNode.endNeuronIndex - this.fromNode.startNeuronIndex === 0){
      throw new Error("Cannot make connections, no neurons in fromNode");
    }
    if(this.toNode.endNeuronIndex - this.toNode.startNeuronIndex === 0){
      throw new Error("Cannot make connections, no neurons in toNode");
    }
    
    // all possible connections
    for(let i = this.fromNode.startNeuronIndex; i < this.fromNode.endNeuronIndex; i++){
      for(let j = this.toNode.startNeuronIndex; j < this.toNode.endNeuronIndex; j++){

        // should connect?
        if(sparcity === 1 || Math.random() < sparcity){
          
          // connect
          const conn = {
            from: i,
            to: j,
            weight: weightGenerator()
          }
          this.connections.push(conn);
        }
      }
    }
  }

  /**
    Add connections between fromNode and toNode, with a linear weight distribution
    @param {number} sparcity - Number between 0.0 and 1.0 how many of the possible connections to make
    @param {number} minWeight - Minimum weight to generate
    @param {number} maxWeight - Maximum weight to generate
   */
  connectBasicLinear(sparcity, minWeight, maxWeight){
    const w = maxWeight - minWeight;
    this.connectBasicGenerator(sparcity, () => {
      return minWeight + (Math.random() * w) ; // random linear
    });
  }

  /**
    Add connections between fromNode and toNode, with a Gaussian weight distribution
    @param {number} sparcity - Number between 0.0 and 1.0 how many of the possible connections to make
    @param {number} mean - Weights mean
    @param {number} stdev - Weights standard deviation
   */
  connectBasicGaussian(sparcity, mean, stdev){
    this.connectBasicGenerator(sparcity, () => {
      const u = 1 - Math.random(); // Converting [0,1) to (0,1]
      const v = Math.random();
      const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      // Transform to the desired mean and standard deviation:
      return z * stdev + mean;
    });
  }

  /**
    Add value to all connections, such as 'delay', using a generator
    @param {string} tractVariable - The key for this varable, such as 'delay'
    @param {function(): number} generator - How to generate the varable, for example () => { return 10; }
  */
  addTractVariable(tractVariable, generator){
    for(let i = 0; i < this.connections.length; i++){
      this.connections[i][tractVariable] = generator();
    }
  }

  /**
    Add constant value to all connections, such as 'delay'.
    @param {string} tractVariable - The key for this varable, such as 'delay'
    @param {number} value - The value to give the tractVariable
  */
  addTractVariable(tractVariable, value){
    for(let i = 0; i < this.connections.length; i++){
      this.connections[i][tractVariable] = value;
    }
  }


}


export { Tract }


