
import { Tract } from "./tract";

/**
  Tracts contains all the Tracts of the Network.
  @category Network
 */
class Tracts {

  tracts = []; // Tract
  tractPaths = {}; // tractPaths[ <path> ] = Tract

  connections = {}; // actual connections with Float32Array per variable
  connectionsLen = 0; // number of connections so far

  /**
    Create Tracts
    @param {Network} network - Reference to the network this Tract belongs to
  */
  constructor(network) {
    this.network = network;
  }

  /** 
    Get the associated network Paradigm
    @return {Paradigm}
  */
  get paradigm(){
    return this.network.paradigm;
  }



  get dict(){
    const dict = {
      tracts: [],
    }
    for(let i = 0; i < this.tracts.length; i++){
      dict.tracts.push(this.tracts[i].dict); 
    }
    return dict;
  }

  fromDict(dict){
    for(let i = 0; i < dict.tracts.length; i++){
      const d = dict.tracts[i];
      const fromNode = this.network.nodes.getNodeByPath(d.fromNodePath);
      const toNode = this.network.nodes.getNodeByPath(d.toNodePath);
      const paradigm = this.network.paradigm; // no support for different paradigm per tract save yet
      const tract = new Tract(this.network, d.path, fromNode, toNode, paradigm, d.delay);
      tract.connections = d.connections;
      this.addTract(tract, true);
    }
    this.generateConnections(true);
  }

  /**
   Get a tract using the tract's path
   @param {string} path - Tract path
   @return {Tract}
   */
  getTractByPath(path){
    if(path in this.tractPaths){
      return this.tractPaths[path];
    } //else
    throw new Error("Tract path does not exist: "+path);
  }

  /**
    Check if a Tract path already exists
    @param {string} path - The Tract path to check
    @return {bool} true if path exists
   */
  pathExists(path){
    for(let i = 0; i < this.tracts.length; i++){
      if(this.tracts[i].path === path){
        return true;
      }
    }
    return false; 
  }

  /**
    Add a Tract to a network
    @param {Tract} tract
    @param {boolean} [skipInit] - Don't initialize the connections already after adding the tract (duplicate work when adding multiple tracts)
   */
  addTract(tract, skipInit){
    if(this.pathExists(tract.path)){
      throw new Error("Tract path already exists: "+tract.path);
    }

    // add tract to from and to nodes
    tract.fromNode.outTracts.push(tract);
    tract.toNode.inTracts.push(tract);

    this.tracts.push(tract);

    if(!skipInit){
      // check if connections are already added
      if(tract.connections.length === 0){
        throw new Error("Trying to add a tract without any connections");
      }
      this.generateConnections(true); }
  }


  /**
    Generate connections converts the connectionLayout to connections,
    @param {bool} check - Validate the connections for common errors, 
                          like non-existing keys and duplicate from-to pairs
   */
  generateConnections(check){

    // gether the connections layout from all tracts
    const connectionLayout = [];
    for(let i = 0; i < this.tracts.length; i++){
      const tract = this.tracts[i];
      tract.startConnectionIndex = connectionLayout.length;
      //connectionLayout.push(...tract.connections);
      for(let j = 0; j < tract.connections.length; j++){
        connectionLayout.push(tract.connections[j]);
      }
      tract.endConnectionIndex = connectionLayout.length;
    }
    this.connectionsLen = connectionLayout.length;


    
    // check if there are values in the connectionLayout that are invalid for the paradigm
    if(check){
      const fromToChecks = {};
      for(let i = 0; i < connectionLayout.length; i++){
        const conn = connectionLayout[i];

        // connection vars
        for (const [key, value] of Object.entries(conn)) {
          if(key !== "from" && key !== "to"){ // always have these
            let found = false;
            // paradigm vars
            for(let j = 0; j < this.paradigm.tractVariables.length; j++){
              if(key === this.paradigm.tractVariables[j]){
                found = true;
                continue;
              }
            }
            if(!found){
              throw new Error("Trying to make a connection with tract variable: "+
                key+", which was not defined in the paradigm");
            }
          }
        }
        // check if connection has at least "from" and "to"
        if(!("from" in conn)){ throw new Error("Connection has no 'from' value defined"); }
        if(!("to" in conn)){ throw new Error("Connection has no 'to' value defined"); }

        // check if there are duplicate from / to entries (duplicate connections)
        const checkFromTo = conn.from+'#'+conn.to;
        if( checkFromTo in fromToChecks ){
          throw new Error("Duplicate connection detected, from: "+conn.from+" to: "+conn.to);
        }
        fromToChecks[checkFromTo] = true;
      }
    }

    // init arrays
    this.connections["from"] = new Int32Array(this.connectionsLen);
    this.connections["to"] = new Int32Array(this.connectionsLen);
    this.connections["delay"] = new Int32Array(this.connectionsLen);

    // specific to paradigm
    for(let i = 0; i < this.paradigm.tractVariables.length; i++){
      const key = this.paradigm.tractVariables[i];
      this.connections[key] = new Float32Array(this.connectionsLen);  
    }
    // fill values
    for(let i = 0; i < connectionLayout.length; i++){
      const conn = connectionLayout[i];
      for (const [key, value] of Object.entries(conn)) {
        this.connections[key][i] = value;  
      }
    }
  }

}


export { Tracts }

