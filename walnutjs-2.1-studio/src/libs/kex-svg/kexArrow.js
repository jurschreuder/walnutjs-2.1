// By Jurriaan Schreuder @ Kexxu

import { KexSvg } from "./kexSvg.js";

class KexArrow {
  isKexSvgDrawable = true; // for type check

  color     = "#000";
  lineWidth = 1.0;
  opacity   = 1.0;

  fromElem = false;
  toElem = false;

  fromPoint = { x: 0, y: 0 };
  toPoint   = { x: 0, y: 0 };

  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  id = false; // late init
  parentId = false;

  constructor(parentId){
    // random id
    this.uuid = KexSvg.uuid("arrow")
    this.parentId = parentId;
  }

  setFromPoint(x, y){
    this.fromPoint = { x: x, y: y }
  }

  setToPoint(x, y){
    this.toPoint = { x: x, y: y }
  }

  get middlePoint(){
    // horizontal
    const p =  {
      x: (this.fromPoint.x + this.toPoint.x) / 2,
      y: (this.fromPoint.y + this.toPoint.y) / 2,
    }

    // calc arrow direction
    const dx = this.toPoint.x - this.fromPoint.x;
    const dy = this.toPoint.y - this.fromPoint.y;

    if(dx*dx > dy*dy){
      // horizontal
      p.x1 = (this.fromPoint.x + p.x) / 2;
      p.y1 = this.fromPoint.y;
    }else{
      // vertical
      p.x1 = this.fromPoint.x;
      p.y1 = (this.fromPoint.y + p.y) / 2;
    }
    return p;
  }

  render(canvasWidth, canvasHeight){
    this.clear();
   
    // new svg
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", canvasWidth);
    svg.setAttribute("height", canvasHeight);
    svg.setAttribute("id", this.id);

    svg.style.position = "absolute";
    svg.style.left = "0";

    // arrow
    svg.innerHTML = `<marker
      id="arrow"
      viewBox="0 0 10 10"
      refX="5"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" />
    </marker>`

    // draw arrow
    const points = [];
    points.push([this.fromPoint.x, this.fromPoint.y]);
    points.push([this.middlePoint.x1, this.middlePoint.y1, this.middlePoint.x, this.middlePoint.y]);
    points.push([this.toPoint.x, this.toPoint.y]);
    const path = KexSvg.path(points, this.color, this.lineWidth, this.opacity); // TODO actual path locations
    svg.appendChild(path);

    // add svg to canvas
    this.svg = svg;
    this.parentElem.appendChild(this.svg);
  }

  clear(){
    try {
      this.parentElem.removeChild(this.elem);
    } catch (_) {
      // empty
    }
  }

  get parentElem(){
    return document.getElementById(this.parentId);
  }

  get elem(){
    return document.getElementById(this.id);
  }
}

export { KexArrow }
