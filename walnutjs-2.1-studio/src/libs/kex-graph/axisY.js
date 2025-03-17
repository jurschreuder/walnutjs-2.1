// By Jurriaan Schreuder @ Kexxu

//import { moment } from "moment";

let GraphAxisY = function (id, parentElemId) {
  this.id = id;

  this.lineColor = "#000";
  this.lineAlpha = 0.8;
  this.lineWidth = 1.0;
  this.ticLineWidth = 1.0;
  this.type = "plain"; // plain, time
  this.fontSize = 12;

  this.timeFmt = "MMMM Do YYYY, HH:mm:ss";
  this.fmtFunction = (v) => v + "";
  this.postfix = "";
  this.prefix = "";

  this.minY = 0;
  this.maxY = 1000;
  this.tics = 5;
  this.labelSkips = 2;

  this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  this.width = 0;
  this.height = 0;

  this.parentElemId = parentElemId;

  this._ticLocs = [];
  this._ticLabels = [];

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
    let w = this.maxY - this.minY;
    let step = w / this.tics;

    this._ticLocs = [];
    for (let i = 0; i < this.tics + 1; i++) {
      this._ticLocs.push(this.minY + i * step);
    }
    this._ticLabels = [];
    if (this.type === "plain") {
      for (let i = 0; i < this.tics + 1; i++) {
        this._ticLabels.push(
          this.prefix + this.fmtFunction(this._ticLocs[i]) + this.postfix
        );
      }
    }

    if (this.type === "time") {
      for (let i = 0; i < this.tics + 1; i++) {
        //this._ticLabels.push(moment().format(this._ticLocs[i]));
      }
    }

    this._ticLabels.reverse();
  };

  this.render = function (skipCalcParentSize) {
    this.calcTics();

    if (!skipCalcParentSize) {
      this.calcParentSize();
    }
    this.clear();

    this.calcTics();

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", this.width);
    svg.setAttribute("height", this.height + 100); // 50px overflow on top and bottom
    svg.setAttribute("id", this.id);
    svg.style.position = "absolute";
    svg.style.left = "0";
    svg.style.top = "-50px";

    let step = this.height / (this.maxY - this.minY);

    // axis line
    {
      let polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );
      polygon.style.stroke = this.lineColor;
      polygon.style.fill = "none";
      polygon.style.opacity = this.lineAlpha;
      polygon.style["stroke-width"] = this.lineWidth;
      polygon.style["shape-rendering"] = "optimizeQualtiy";

      let point1 = svg.createSVGPoint();
      point1.y = 50;
      point1.x = this.width - 1;
      polygon.points.appendItem(point1);
      let point2 = svg.createSVGPoint();
      point2.y = this.height + 50;
      point2.x = this.width - 1;
      polygon.points.appendItem(point2);
      svg.appendChild(polygon);
    }

    // axis tics
    for (let i = 0; i < this.tics + 1; i++) {
      let polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );
      polygon.style.stroke = this.lineColor;
      polygon.style.fill = "none";
      polygon.style.opacity = this.lineAlpha;
      polygon.style["stroke-width"] = this.ticLineWidth;
      polygon.style["shape-rendering"] = "optimizeQualtiy";

      // adjust for drawing out of bounds for the first and last tick
      let offY = 0;
      if (i === 0) {
        offY = 1;
      }
      if (this._ticLocs[i] * step >= this.heigth) {
        offY = -1;
      }

      let point1 = svg.createSVGPoint();
      point1.x = this.width - 1;
      point1.y = offY + step * (this._ticLocs[i] - this.minY) + 50;
      polygon.points.appendItem(point1);
      let point2 = svg.createSVGPoint();
      point2.x = this.width - 5;
      if (i % this.labelSkips === 0) {
        point2.x = this.width - 11;
      }
      point2.y = offY + step * (this._ticLocs[i] - this.minY) + 50;
      polygon.points.appendItem(point2);
      svg.appendChild(polygon);

      // add text
      if (i % this.labelSkips === 0) {
        let txt = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        txt.style.stroke = this.lineColor;
        txt.style["stroke-width"] = 0.1;
        txt["text-anchor"] = "start";
        txt.setAttributeNS(
          null,
          "y",
          4 + step * (this._ticLocs[i] - this.minY) + 50
        );
        txt.setAttributeNS(null, "x", 1);
        txt.setAttributeNS(null, "fill", this.lineColor);
        txt.setAttributeNS(null, "font-size", this.fontSize);
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
    let compStyle = getComputedStyle(parent);
    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    this.width -=
      parseFloat(compStyle.paddingLeft) + parseFloat(compStyle.paddingRight);
    this.height -=
      parseFloat(compStyle.paddingTop) + parseFloat(compStyle.paddingBottom);
  };
};

export { GraphAxisY };
