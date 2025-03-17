// By Jurriaan Schreuder @ Kexxu

import { renderBool, renderAddBool } from './render/bool.js';
import { renderLine, renderAddLine } from './render/line.js';
import { renderUint32Gantt, renderAddUint32Gantt } from './render/uint32_gantt.js';

export function GraphLine(id, data, parentElemId) {
  this.id = id;
  this.lineColor = "#000";
  this.lineAlpha = 0.8;
  this.lineWidth = 1;
  this.boolWidth = 6; // when bool graph is true
  this.type = "line"; // line, bool, bar, scatter, uint32_gantt
  // for line, data format: [ x, y ]
  // for bool, data format: [ x, y, l (optional, default=1) ]
  // for bar,  data format: [ x, y, l (optional, default=1), color (optional, default lineColor) ]
  // for uint32_gantt, data format: [ x, y (uint32), l (optional, default=1) ]

  this.name = "line";
  this.slider = { x: 0, y: 0, hasData: false };

  this.data = data;

  this.minX = 0;
  this.maxX = 0;
  this.stepX = 1;
  this.minY = 0;
  this.maxY = 0;
  this.invertedY = false;
  this.yOffset = 0;

  this.maxGapX = 0;

  this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  this.width = 0;
  this.height = 0;

  this.parentElemId = parentElemId;

  this._elements = [];
  this.isRendering = false;
  this._resizeObserver = false;

  this.hidden = false;
  this.selected = false;

  this._lastX = 0; // used to check if maxGapX is exceeded when drawing line graph

  this.grid = {
    ticsX: 0,
    ticsY: 0,
    lineColor: "#000",
    lineAlpha: 0.4,
    lineWidth: 0.5,
  };

  this.defaultColors = ["#343a40","#007bff","#dc3545","#28a745","#fd7e14","#6f42c1","#e83e8c","#ffc107","#20c997","#17a2b8","#6c757d"];

  this.ganttConfs = [
     {i: 0, lbl: "0", offset: 0, height: 4, color: false /* use default */},
     {i: 1, lbl: "1", offset: 4, height: 4, color: false /* use default */},
     {i: 2, lbl: "2", offset: 8, height: 4, color: false /* use default */},
     {i: 3, lbl: "3", offset: 12, height: 4, color: false /* use default */},
     {i: 4, lbl: "4", offset: 16, height: 4, color: false /* use default */},
     {i: 5, lbl: "5", offset: 20, height: 4, color: false /* use default */},
     {i: 6, lbl: "6", offset: 24, height: 4, color: false /* use default */},
     {i: 7, lbl: "7", offset: 28, height: 4, color: false /* use default */},
     {i: 8, lbl: "8", offset: 32, height: 4, color: false /* use default */},
     {i: 9, lbl: "9", offset: 36, height: 4, color: false /* use default */},
     {i: 10, lbl: "10", offset: 40, height: 4, color: false /* use default */},
     {i: 11, lbl: "11", offset: 44, height: 4, color: false /* use default */},
     {i: 12, lbl: "12", offset: 48, height: 4, color: false /* use default */},
     {i: 13, lbl: "13", offset: 52, height: 4, color: false /* use default */},
     {i: 14, lbl: "14", offset: 56, height: 4, color: false /* use default */},
     {i: 15, lbl: "15", offset: 60, height: 4, color: false /* use default */},
     {i: 16, lbl: "16", offset: 64, height: 4, color: false /* use default */},
     {i: 17, lbl: "17", offset: 68, height: 4, color: false /* use default */},
     {i: 18, lbl: "18", offset: 72, height: 4, color: false /* use default */},
     {i: 19, lbl: "19", offset: 76, height: 4, color: false /* use default */},
     {i: 20, lbl: "20", offset: 80, height: 4, color: false /* use default */},
     {i: 21, lbl: "21", offset: 84, height: 4, color: false /* use default */},
     {i: 22, lbl: "22", offset: 88, height: 4, color: false /* use default */},
     {i: 23, lbl: "23", offset: 92, height: 4, color: false /* use default */},
     {i: 24, lbl: "24", offset: 96, height: 4, color: false /* use default */},
     {i: 25, lbl: "25", offset: 100, height: 4, color: false /* use default */},
     {i: 26, lbl: "26", offset: 104, height: 4, color: false /* use default */},
     {i: 27, lbl: "27", offset: 108, height: 4, color: false /* use default */},
     {i: 28, lbl: "28", offset: 112, height: 4, color: false /* use default */},
     {i: 29, lbl: "29", offset: 116, height: 4, color: false /* use default */},
     {i: 30, lbl: "30", offset: 120, height: 4, color: false /* use default */},
     {i: 31, lbl: "31", offset: 124, height: 4, color: false /* use default */},
  ];

  this.parentElem = function () {
    return document.getElementById(this.parentElemId);
  };

  this.slideToX = function (x) {
    if (this.data.length == 0) {
      return;
    }
    console.log("sliding to", x);
    for (let i = 0; i < this.data.length; i++) {
      const x2 = this.data[i][0];
      if(this.maxGapX > 0 && x2 > x + this.maxGapX){
        // not found
        this.slider.x = x;
        this.slider.y = 0;
        this.hasData = false;
        return this.slider;
      }
      if (x2 >= x) {
        this.slider.x = x2;
        this.slider.y = this.data[i][1];
        this.slider.hasData = true;
        return this.slider;
      }
    }
    //this.slider.x = this.data[this.data.length - 1][0];
    //this.slider.y = this.data[this.data.length - 1][1];
    //
    // not found
    this.slider.x = x;
    this.slider.y = 0;
    this.hasData = false;
    return this.slider
  };

  this.setWindow = function (x1, x2, y1, y2, stepX) {
    this.minX = x1;
    this.maxX = x2;
    this.minY = y1;
    this.maxY = y2;
    if (stepX) {
      this.stepX = stepX;
    }
  };

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


  this.init = function () {
    if (
      this.minX === 0 &&
      this.maxX === 0 &&
      this.minY === 0 &&
      this.maxY === 0
    ) {
      this.calcParentSize();
    }
    this.calcMinMax();
    this.render();
  };

  this.setLoading = function () {
    this.parentElem().removeChild(document.getElementById(this.id));
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", this.id);
    svg.style.position = "absolute";
    svg.style.left = "0";
    this.svg = svg;
    this.parentElem().appendChild(this.svg);
  };

  this.clear = function () {
    try {
      this.parentElem().removeChild(document.getElementById(this.id));
    } catch (_) {
      // empty
    }
  };

  this.destroy = function () {
    if(this._resizeObserver){
      this._resizeObserver.disconnect();
      this._resizeObserver = false;
    }
    this.clear();
  }

  this.render = function () {
    if (this.isRendering) {
      console.log("Graph was already rendering");
      return;
    }
    this.isRendering = true;

    // watch for resize
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver(() => {
        this.render();
      });
      this._resizeObserver.observe(this.parentElem());
    }

    this.calcParentSize();

    //this.svg = null;
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
    
    // # avoiding division by 0 here:
    let epsilon = 1e-20;
    let diffX = (this.maxX - this.minX)
    if (diffX < epsilon) diffX = epsilon;
    let diffY = (this.maxY - this.minY);
    if (diffY < epsilon) diffY = epsilon;

    let step = this.width / diffX;
    let mult = this.height / diffY;

   // console.log(
   //   "graph minX",
   //   this.minX,
   //   "maxX",
   //   this.maxX,
   //   "step",
   //   step,
   //   "width",
   //   this.width,
   // );

    if (this.grid.ticsX > 0) {
      let stepX = this.width / this.grid.ticsX;
      for (let i = 0; i < this.grid.ticsX + 1; i++) {
        let polygon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polyline",
        );
        polygon.setAttributeNS(null, "stroke", this.grid.lineColor);
        polygon.setAttributeNS(null, "fill", "none");
        polygon.setAttributeNS(null, "opacity", this.grid.lineAlpha);
        polygon.setAttributeNS(null, "stroke-width", this.grid.lineWidth);
        polygon.setAttributeNS(null, "shape-rendering", "optimizeQuality");

        let point1 = svg.createSVGPoint();
        point1.y = 0;
        point1.x = i * stepX;
        polygon.points.appendItem(point1);
        let point2 = svg.createSVGPoint();
        point2.y = this.height;
        point2.x = i * stepX;
        polygon.points.appendItem(point2);
        svg.appendChild(polygon);
      }
    }
    if (this.grid.ticsY > 0) {
      let stepY = this.height / this.grid.ticsY;
      for (let i = 0; i < this.grid.ticsY + 1; i++) {
        let polygon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polyline",
        );

        polygon.setAttributeNS(null, "stroke", this.grid.lineColor);
        polygon.setAttributeNS(null, "fill", "none");
        polygon.setAttributeNS(null, "opacity", this.grid.lineAlpha);
        polygon.setAttributeNS(null, "stroke-width", this.grid.lineWidth);
        polygon.setAttributeNS(null, "shape-rendering", "optimizeQuality");

        let point1 = svg.createSVGPoint();
        point1.x = 0;
        point1.y = i * stepY;
        polygon.points.appendItem(point1);
        let point2 = svg.createSVGPoint();
        point2.x = this.width;
        point2.y = i * stepY;
        polygon.points.appendItem(point2);
        svg.appendChild(polygon);
      }
    }

    if(this.hidden){ 
      // finalize render
      this.svg = svg;
      this.parentElem().appendChild(this.svg);
      this.isRendering = false;
      return; 
    }
     
    if (this.type === "line" && this.data.length > 0) {
      // line
      renderLine(this, svg, step, mult);
    } else if (this.type === "bool") {
      // bool
      renderBool(this, svg, step);
    } else if(this.type === "uint32_gantt") {
      // uint32_gantt
      renderUint32Gantt(this, svg, step);
    } else if (this.type === "bar" && this.data.length > 0) {

      for (let i = 0; i < this.data.length; i++) {
        const d = this.data[i];
        const x = d[0];
        const y = d[1];
        let l = 1;
        if (d.length > 2) {
          l = d[2];
        } // length of the tic
        let color = this.lineColor;
        if (d.length > 3) {
          color = d[3];
        }
        let polygon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polyline",
        );
        polygon.setAttributeNS(null, "stroke", color);
        polygon.setAttributeNS(null, "opacity", this.lineAlpha);
        const barHeight = (y - this.minY) * mult;
        polygon.setAttributeNS(null, "stroke-width", barHeight);
        polygon.setAttributeNS(null, "shape-rendering", "optimizeQuality");

        const point = svg.createSVGPoint();
        point.x = (x - this.minX) * step;
        const yBase = this.height - (barHeight/2);
        point.y = yBase;
        polygon.points.appendItem(point);
        const point2 = svg.createSVGPoint();
        point2.x = (x + l - this.minX) * step;
        point2.y = yBase;
        polygon.points.appendItem(point2);
        svg.appendChild(polygon);
      }
    } else if (this.type === "scatter" && this.data.length > 0) {
			const halfW = this.lineWidth*0.5;
      for (let i = 0; i < this.data.length; i++) {
        const d = this.data[i];
        let x = d[0];
        let y = d[1];
        let color = this.lineColor;
        if (d.length > 2) {
          color = d[2];
        }

				const circle = document.createElementNS(
					"http://www.w3.org/2000/svg",
					"circle",
				);
				circle.setAttributeNS(null, "color", color);
				circle.setAttributeNS(null, "fill", color);
				circle.setAttributeNS(null, "opacity", this.lineAlpha);
				circle.setAttributeNS(null, "r", this.lineWidth);
				circle.setAttributeNS(null, "shape-rendering", "optimizeQuality");

				circle.setAttributeNS(null, "cx", (x - this.minX) * step);
				circle.setAttributeNS(null, "cy", (this.height - (y - this.minY) * mult));

				svg.appendChild(circle);
      }
		}
    this.svg = svg;

    this.parentElem().appendChild(this.svg);
    this.isRendering = false;
  };

  this.addData = function (data) {
    // if no data yet
    if (this.data.length === 0) {
      //console.log("graph.js first time adding data", data);
      this.data = data;
      this.render();
      return;
    }
    if (this.hidden){
      this.data = this.data.concat(data);
      return;
    }

    let step = this.width / (this.maxX - this.minX);
    let mult = this.height / (this.maxY - this.minY);

    if (this.type === "bool") {
      renderAddBool(this, this.svg, data, step);
    }
    if(this.type === "uint32_gantt") {
      // uint32_gantt
      renderAddUint32Gantt(this, this.svg, data, step);
    }
    if (this.type === "line") {

      renderAddLine(this, this.svg, data, step, mult);


    }

    this.data = this.data.concat(data);
    //console.log("graph.js data length:", this.data.length);
  };

  this.calcMinMax = function () {
    let minX = this.data[0][0];
    let maxX = this.data[0][0];
    let minY = this.data[0][1];
    let maxY = this.data[0][1];
    for (let i = 0; i < this.data.length; i++) {
      let d = this.data[i];
      if (d[0] < minX) {
        minX = d[0];
      }
      if (d[0] > maxX) {
        maxX = d[0];
      }
      if (d[1] < minY) {
        minY = d[1];
      }
      if (d[1] > maxY) {
        maxY = d[1];
      }
    }
    this.minX = parseFloat(minX);
    this.maxX = parseFloat(maxX);
    this.minY = parseFloat(minY);
    this.maxY = parseFloat(maxY);
  };

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
