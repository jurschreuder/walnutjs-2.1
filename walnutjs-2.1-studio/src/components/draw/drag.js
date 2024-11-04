

class Drag{

  // config
  snap = 10; // pixels
  color = "#444";
  showLabel = true;

  // state
  selected = false;
  isDragging = false;

  // hierarchy
  parent = false;
  children = [];


  dragStart = {
    xStartLocal: 0,
    yStartLocal: 0,
    xStart: 0,
    yStart: 0
  }

  constructor(x, y, w, h, label){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label || "test";
  }

  startDragging(xStartLocal, yStartLocal, xStart, yStart) {
    this.isDragging = true;
    this.dragStart = {
      xStartLocal: xStartLocal,
      yStartLocal: yStartLocal,
      xStart: xStart,
      yStart: yStart 
    }
    //console.log("startDragging", this);
  }

  move(x, y) {
    if(!this.isDragging){ return; }

    this.x = x - this.dragStart.xStartLocal;
    this.y = y - this.dragStart.yStartLocal;
    
    // snap
    this.x -= (this.x%this.snap);
    this.y -= (this.y%this.snap);

    //console.log("move to", this.x, this.y);
  }
}

export { Drag };
