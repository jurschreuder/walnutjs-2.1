

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
      const node = this.network.nodes.nodes[i];
      if(node.draggable){
        nodeDraggables.push(node.draggable);
      }
    }
    this.nodeDraggables = nodeDraggables;

    // tract arrows
    const tractArrows = [];
    for(let i = 0; i < this.network.tracts.tracts.length; i++){
      const tract = this.network.tracts.tracts[i];
      if(
        tract.arrow && 
        tract.fromNode && tract.fromNode.draggable && 
        tract.toNode && tract.toNode.draggable
      ){
        tract.arrow.fromDraggable = tract.fromNode.draggable;
        tract.arrow.toDraggable = tract.fromNode.draggable;
        tractArrows.push(tract.arrow);
      }
    }
    this.tractArrows = tractArrows;

  }

}

export { Display }
