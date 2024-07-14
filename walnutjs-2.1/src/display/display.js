

class Display {
  nodeDraggables = [];
  containerDraggables = [];
  tractArrows = [];

  /**
    Create a new display hierarchy
    @param {Network} network - Reference to the network this Tract belongs to
   */
  constructor(network){
    this.network = network;
  }

  createHierarchy(){

    // plain nodes
    const nodeDraggables = [];
    for(let i = 0; i < this.network.nodes.nodes.length; i++){
      let node = this.network.nodes.nodes[i];
      if(node.draggable){
        nodeDraggables.push(node.draggable);
      }
    }
    this.nodeDraggables = nodeDraggables;

  }

}

export { Display }
