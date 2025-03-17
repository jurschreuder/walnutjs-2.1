// By Jurriaan Schreuder @ Kexxu

export function DegreeRing(id, parentElemId) {
  this.id = id;
  this.parentElemId = parentElemId;

  //this.lineColor = "#0069aa";
  this.lineColor = "#000";
  this.lineColor2 = "#fd7e14";
  this.lineBg = "#fff";
  this.lineAlpha = 1.0;
  this.lineWidth = 1;
  this.tickStep = 2.5;
  this.tickSize = 0.005;
  this.sideRender = true;


  this.name = "Degree Ring";

  this.rotationX = 0; // degree rotated around vertical axis

  this.centerX = 0.5; // center
  this.centerY = 0.5;

  this.size = 0.6; // 80% of the draw window height


  this.curDegree = 0;

  this.hidden = false;
  this.selected = false;

  this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  this.width = 100;
  this.height = 100;

  this.parentElem = function () {
    return document.getElementById(this.parentElemId);
  };

  this.isRendering = false;
  this._hasResizeObserver = false;


  this.render = function () {
    if (this.isRendering) {
      console.log("Graph was already rendering");
      return;
    }
    this.isRendering = true;

    // watch for resize
    if (!this._hasResizeObserver) {
      this._hasResizeObserver = true;
      new ResizeObserver(() => {
        this.render();
      }).observe(this.parentElem());
    }

    this.calcParentSize();

    try {
      this.parentElem().removeChild(document.getElementById(this.id));
    } catch (err) {
      // empty
    }

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", this.width);
    svg.setAttribute("height", this.height);
    svg.setAttribute("id", this.id);
    svg.style.position = "absolute";
    svg.style.left = "0";

    // === start custom render === 
    console.log("render", this.curDegree);
  
    const cx = this.centerX * this.width;
    const cy = this.centerY * this.height;
    const s = this.size / 2;

    let x = 0;
    let y = 0;
    let z = 1;
    let l = 0;
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;

    for(let deg = 0; deg < 360; deg += this.tickStep){
      const rad = this.degToRad((deg-180)-this.curDegree);
      
      const radX = this.degToRad(this.rotationX);

      x = Math.sin(rad) * Math.cos(radX);
      y = Math.cos(rad);
     
      if(!this.sideRender){
        z = Math.abs(Math.sin((rad+Math.PI*1.5)*0.5));
      }

      //if(!this.sideRender && z < 0.4){ continue; } // do not draw back side 

      if(this.tickStep >= 2.5){
        l = this.tickSize * (
          ((deg%360===0)*1) + // every 360 deg double doubld double
          ((deg%30===0)*1) + // every 30 deg double double
          ((deg%10===0)*1+1)); // every 10 deg double
      }else{
        l = this.tickSize * (
          ((deg%360===0)*1) + // every 360 deg double doubld double
          ((deg%30===0)*1) + // every 30 deg double double
          ((deg%10===0)*1) + // every 10 deg double
          ((deg%5===0)*1+1)); // every 5 deg double
      }
      x1 = cx + x * s * this.height;  
      y1 = cy + y * s * this.height;  
      if(this.sideRender){
        x2 = cx + x * (s+l) * this.height;
        y2 = cy + y * (s+l) * this.height;
      }else{
        x2 = x1 + l * this.height * z;
        y2 = y1;
      }

      if(!this.sideRender && (deg === 20.0 || deg === 17.5)){
        x2 = x1 + l * this.height * z * 4;
        x1 = x1 - l * this.height * z * 4;
        this.svgLine(svg, x1-this.lineWidth, y1, x2+this.lineWidth, y2, this.lineBg, 6);
        this.svgLine(svg, x1, y1, x2, y2, this.lineColor, 4);
      }else{
        if(deg <= 17.5 || deg >= 337.5){
          if(this.sideRender){
            this.svgLine(svg, x1, y1, x2, y2, this.lineBg, this.lineWidth*1.5);
            this.svgLine(svg, x1, y1, x2, y2, this.lineColor2, this.lineWidth);
          }
        }else{
          if(this.sideRender){
            this.svgLine(svg, x1, y1, x2, y2, this.lineBg, this.lineWidth*1.5);
            this.svgLine(svg, x1, y1, x2, y2, this.lineColor, this.lineWidth);
          }else{
            this.svgLine(svg, x1, y1, x2, y2, this.lineBg, this.lineWidth*1.5+z, z);
            this.svgLine(svg, x1, y1, x2, y2, this.lineColor, this.lineWidth+z, z);
          }
        }
      }
    }
    
    // === stop custom render ===

    // update screen
    this.svg = svg;
    this.parentElem().appendChild(this.svg);
    this.isRendering = false;
  }

  this.degToRad = function(deg){
    return deg * (Math.PI / 180); 
  }
  this.radToDeg = function(rad){
    return rad * (180 / Math.PI);
  }

  this.svgLine = function(svg, x1, y1, x2, y2, color, lineWidth, opacity){
    opacity = opacity || this.lineAlpha;
    opacity = 1;
    let polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline",
    );
    polygon.setAttributeNS(null, "stroke", color);
    polygon.setAttributeNS(null, "fill", "none");
    polygon.setAttributeNS(null, "opacity", opacity);
    polygon.setAttributeNS(null, "stroke-width", lineWidth);
    polygon.setAttributeNS(null, "shape-rendering", "optimizeQuality");

    let point1 = svg.createSVGPoint();
    point1.x = x1;
    point1.y = y1; 
    polygon.points.appendItem(point1);
    let point2 = svg.createSVGPoint();
    point2.x = x2;
    point2.y = y2;
    polygon.points.appendItem(point2);

    svg.appendChild(polygon);
    return svg;
  }

  this.setHidden = function(hidden){
    if(this.hidden === hidden){ return; }
    this.hidden = hidden;
    this.render();
  }

  this.setSelected = function(selected){
    if(this.selected === selected){ return; }
    this.selected = selected;
    this.render();
  }

  this.calcParentSize = function () {
    let parent = this.parentElem();
    let compStyle = getComputedStyle(parent);
    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    this.width -=
      parseFloat(compStyle.paddingLeft) + parseFloat(compStyle.paddingRight);
    this.height -=
      parseFloat(compStyle.paddingTop) + parseFloat(compStyle.paddingBottom);
  };

}

