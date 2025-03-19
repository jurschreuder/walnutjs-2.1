// By Jurriaan Schreuder @ Kexxu

import moment from "moment";

let GraphAxis = function (id, parentElemId) {
  this.id = id;

  this.lineColor = "#000";
  this.lineAlpha = 0.8;
  this.lineWidth = 1.0;
  this.type = "plain"; // plain, time

  this.timeFmt = "MMMM Do YYYY, HH:mm:ss";
  this.fmtFunction = (v) => v + "";
  this.postfix = "";
  this.prefix = "";
  this.prefixOffset = 0;

  this.minX = 0;
  this.maxX = 1000;
  this.tics = 5;
  this.labelSkips = 2;

  this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  this.width = 0;
  this.height = 0;

  this.parentElemId = parentElemId;

  this._ticLocs = [];
  this._ticLabels = [];
  this._hasResizeObserver = false;

  this.parentElem = function () {
    return document.getElementById(this.parentElemId);
  };

  this.clear = function () {
    try {
      this.parentElem().removeChild(document.getElementById(this.id));
    } catch (_) {
      // empty
    }
  };

  this.calcTics = function () {
    let w = this.maxX - this.minX;
    let step = w / this.tics;

    this._ticLocs = [];
    for (let i = 0; i < this.tics + 1; i++) {
      //this._ticLocs.push(this.minX + i * step);
      this._ticLocs.push(i * step);
    }
    this._ticLabels = [];
    if (this.type === "plain") {
      for (let i = 0; i < this.tics + 1; i++) {
        this._ticLabels.push(
          this.prefix + this.fmtFunction(this._ticLocs[i]+this.minX) + this.postfix,
        );
      }
    }

    if (this.type === "time") {
      for (let i = 0; i < this.tics + 1; i++) {
        this._ticLabels.push(moment(this._ticLocs[i]).format(this.timeFmt));
      }
    }
  };

  this.render = function (skipCalcParentSize) {
    this.calcTics();

    if (!skipCalcParentSize) {
      this.calcParentSize();
    }
    // watch for resize
    if (!this._hasResizeObserver) {
      this._hasResizeObserver = true;
      new ResizeObserver(() => {
        this.render();
      }).observe(this.parentElem());
    }

    this.clear();

    this.calcTics();

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", this.width);
    svg.setAttribute("height", this.height);
    svg.setAttribute("id", this.id);
    svg.style.position = "absolute";
    svg.style.left = "0";

    let step = this.width / (this.maxX - this.minX);
    let mult = this.height / (this.maxY - this.minY);

    // axis line
    {
      let polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline",
      );
      polygon.style.stroke = this.lineColor;
      polygon.style.fill = "none";
      polygon.style.opacity = this.lineAlpha;
      polygon.style["stroke-width"] = this.lineWidth;
      polygon.style["shape-rendering"] = "optimizeQualtiy";

      let point1 = svg.createSVGPoint();
      point1.y = 1;
      point1.x = 0;
      polygon.points.appendItem(point1);
      let point2 = svg.createSVGPoint();
      point2.y = 1;
      point2.x = this.width;
      polygon.points.appendItem(point2);
      svg.appendChild(polygon);
    }

    // axis tics
    for (let i = 0; i < this.tics + 1; i++) {
      let polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline",
      );
      polygon.style.stroke = this.lineColor;
      polygon.style.fill = "none";
      polygon.style.opacity = this.lineAlpha;
      polygon.style["stroke-width"] = this.lineWidth;
      polygon.style["shape-rendering"] = "optimizeQualtiy";

      // adjust for drawing out of bounds for the first and last tick
      let offX = 0;
      if (i === 0) {
        offX = 1;
      }
      if (this._ticLocs[i] * step >= this.width) {
        offX = -1;
      }

      let point1 = svg.createSVGPoint();
      point1.y = 0;
      point1.x = offX + step * this._ticLocs[i];
      polygon.points.appendItem(point1);
      let point2 = svg.createSVGPoint();
      point2.y = 5;
      if (i % this.labelSkips === 0) {
        point2.y = 10;
      }
      point2.x = offX + step * this._ticLocs[i];
      polygon.points.appendItem(point2);
      svg.appendChild(polygon);

      // add text
      if (i % this.labelSkips === 0) {
        let txt = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text",
        );
        txt.style.stroke = this.lineColor;
        txt.style["stroke-width"] = 0.1;
        txt["text-anchor"] = "start";
        txt.setAttributeNS(
          null,
          "x",
          this.prefixOffset + step * this._ticLocs[i],
        );
        txt.setAttributeNS(null, "y", 20);
        txt.setAttributeNS(null, "fill", this.lineColor);
        txt.setAttributeNS(null, "font-size", 12);
        txt.setAttributeNS(null, "font-family", "Arial");
        txt.setAttributeNS(null, "font-weight", "normal");

        txt.textContent = this._ticLabels[i];
        svg.appendChild(txt);
      }
    }

    this.svg = svg;

    this.parentElem().appendChild(this.svg);

    //console.log("axis rendered:", this);
  };

  this.calcParentSize = function () {
    let parent = this.parentElem();
    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    try {
      let compStyle = getComputedStyle(parent);
      this.width -=
        parseFloat(compStyle.paddingLeft) + parseFloat(compStyle.paddingRight);
      this.height -=
        parseFloat(compStyle.paddingTop) + parseFloat(compStyle.paddingBottom);
    } catch {
      console.log(error);
    }
  };
};

export { GraphAxis };
