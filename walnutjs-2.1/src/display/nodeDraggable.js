/**
   @typedef {object} MouseEvent
   @typedef {object} HTMLElement
 */

/**
  A NodeDraggable contains the information to draw a node in the visual builder.
  It also has  basic functions to move it around by dragging.

  @param {Node} node - Reference to the network this Tract belongs to

  @param {number} snapPx - Snap to pixels when dragging
  @param {string} color - Color of the element when drawing
  @param {string} label - Label to display, defaults to last part of path
  @param {boolean} showLabel - Show the label or not
  @param {number} neuronPxSize - How many pixels are used to draw a neuron, determines the w (width) and h (height)

  @param {number} x - The x position of the visual element
  @param {number} y - The y position of the visual element
  @param {number} w - The width of the visual element. Do not change manually, change neuronPxSize
  @param {number} h - The height of the visual element. Do not change manually, change neuronPxSize

 */

class NodeDraggable {

  // config
  snapPx = 10;
  color = "#ddd";
  label = "Node";
  showLabel = true;
  neuronPxSize = 4;

  // position
  x = 0;
  y = 0;
  w = 10;
  h = 10;

  // state
  selected = false;
  isDragging = false;

  // hierarchy
  parent = false;
  children = [];


  // local variable used for dragging
  dragStart = {
    xStartLocal: 0,
    yStartLocal: 0,
    xStart: 0,
    yStart: 0
  }

  /**
    Create a NodeDraggable
    @param {Node} node - The node to draw
    @param {number} x - The x position in the visual builder
    @param {number} y - The y position in the visual builder
    @param {string} [color='#ddd'] - Hex color to give to the element
  */
  constructor(node, x, y, color){
    console.log("creating draggable for node", node);
    this.node = node;
    this.x = x;
    this.y = y;
    this.color = color || "#ddd";
    this.w = node.width * this.neuronPxSize;
    this.h = node.height * this.neuronPxSize;
    this.label = node.path.split("/").at(-1);
  }

  set neuronPxSize(px){
    this.neuronPxSize = px;
    this.w = node.width * this.neuronPxSize;
    this.h = node.height * this.neuronPxSize;
  }
  
  set w(val){
    throw Exception("Do not set this manually, change 'neuronPxSize' instead");
  }
  set h(val){
    throw Exception("Do not set this manually, change 'neuronPxSize' instead");
  }
  
  get center(){
    return { x: (this.x+this.w)/2, y: (this.y+this.h)/2 } 
  }
  get leftCenter(){
    return { x: this.x, y: (this.y+this.h)/2 } 
  }
  get rightCenter(){
    return { x: this.x+this.w, y: (this.y+this.h)/2 } 
  }
  get topCenter(){
    return { x: (this.x+this.w)/2, y: this.y } 
  }
  get bottomCenter(){
    return { x: (this.x+this.w)/2, y: this.y+this.h } 
  }

  /**
    Start dragging (onmousedown) saves the pointer location inside the element
    relative to the parent element, so the draggable moves relatvie to the initial
    mouse grab location.
    @param {MouseEvent} mouseEvent - The event returned from the onmousedown trigger
    @param {HTMLElement} parentDOMElement - The HTML element the draggable is drawn in and relative to
  */
  startDragging(mouseEvent, parentDOMElement) {
    const bounds = parentDOMElement.getBoundingClientRect();
    const evt = mouseEvent;

    this.isDragging = true;
    this.dragStart = {
      xStartLocal: evt.offsetX,
      yStartLocal: evt.offsetY,
      xStart: evt.clientX - bounds.left,
      yStart: evt.clientY - bounds.top 
    }
    //console.log("startDragging", this);
  }

  /**
    Move the draggable to a location based as a result of a onmousemove event.
    Call 'startDragging' first, to save the relative position of the mouse inside the element while dragging. 
    @param {MouseEvent} mouseEvent - The event returned from the onmousemove trigger
    @param {HTMLElement} [parentDOMElement] - The HTML element the draggable is drawn in and relative to. Leave empty if this is the parent where the mouse is moving.
  */
  move(mouseEvent, parentDOMElement) {
    if(!this.isDragging){ return; }
    let x = 0;
    let y = 0;
    const evt = mouseEvent;
    if(parentDOMElement){
      const bounds = parentDOMElement.getBoundingClientRect();
      x = evt.clientX - bounds.left;
      y = evt.clientY - bounds.top;
    }else{
      x = evt.offsetX;
      y = evt.offsetY;
    }

    this.x = x - this.dragStart.xStartLocal;
    this.y = y - this.dragStart.yStartLocal;
    
    // snap
    this.x -= (this.x%this.snapPx);
    this.y -= (this.y%this.snapPx);

    //console.log("move to", this.x, this.y);
  }
}

export { NodeDraggable };

