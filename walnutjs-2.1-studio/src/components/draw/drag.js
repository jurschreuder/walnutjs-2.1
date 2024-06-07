

class Drag{

  parent = false;
  children = [];
  
  isDragging = false;

  constructor(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

export { Drag };
