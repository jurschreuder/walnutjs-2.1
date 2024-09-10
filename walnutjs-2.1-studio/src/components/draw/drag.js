

class Drag{

  parent = false;
  children = [];

  selected = false;
  
  isDragging = false;

  dragStart = {
    xStartLocal: 0,
    yStartLocal: 0,
    xStart: 0,
    yStart: 0
  }

  constructor(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  startDragging(xStartLocal, yStartLocal, xStart, yStart) {
    this.isDragging = true;
    this.dragStart = {
      xStartLocal: xStartLocal,
      yStartLocal: yStartLocal,
      xStart: xStart,
      yStart: yStart 
    }
    console.log("startDragging", this);
  }

  move(x, y) {
    if(!this.isDragging){ return; }

    this.x = x - this.dragStart.xStartLocal;
    this.y = y - this.dragStart.yStartLocal;
    console.log("move to", this.x, this.y);
  }
}

export { Drag };
