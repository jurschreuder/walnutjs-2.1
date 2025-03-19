
export function renderBool(graphLine, svg, step) {

  let polygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline",
  );

  polygon.setAttributeNS(null, "stroke", graphLine.lineColor);
  polygon.setAttributeNS(null, "fill", "none");
  polygon.setAttributeNS(null, "opacity", graphLine.lineAlpha);
  polygon.setAttributeNS(null, "stroke-width", graphLine.lineWidth);
  polygon.setAttributeNS(null, "shape-rendering", "optimizeQuality");

  let point = svg.createSVGPoint();
  point.x = 0;
  point.y = graphLine.yOffset;
  polygon.points.appendItem(point);
  let point2 = svg.createSVGPoint();
  point2.x = (graphLine.maxX - graphLine.minX) * step;
  point2.y = graphLine.yOffset;
  polygon.points.appendItem(point2);
  svg.appendChild(polygon);

  renderAddBool(graphLine, svg, graphLine.data, step);

 // for (let i = 0; i < graphLine.data.length; i++) {
 //   let d = graphLine.data[i];
 //   let x = d[0];
 //   let y = d[1];
 //   let l = 1;
 //   if (d.length > 2) {
 //     l = d[2];
 //   } // length of the tic
 //   if (y === true || y > 0) {
 //     let polygon = document.createElementNS(
 //       "http://www.w3.org/2000/svg",
 //       "polyline",
 //     );
 //     polygon.setAttributeNS(null, "stroke", graphLine.lineColor);
 //     polygon.setAttributeNS(null, "opacity", graphLine.lineAlpha);
 //     polygon.setAttributeNS(null, "stroke-width", graphLine.boolWidth);
 //     polygon.setAttributeNS(null, "shape-rendering", "optimizeQuality");

 //     let point = svg.createSVGPoint();
 //     point.x = (x - graphLine.minX) * step;
 //     point.y = graphLine.yOffset;
 //     polygon.points.appendItem(point);
 //     let point2 = svg.createSVGPoint();
 //     point2.x = (x + l - graphLine.minX) * step;
 //     point2.y = graphLine.yOffset;
 //     polygon.points.appendItem(point2);
 //     svg.appendChild(polygon);
 //   }
 // }
  //return svg;
}

export function renderAddBool(graphLine, svg, data, step){
  for (let i = 0; i < data.length; i++) {
    //console.log("graph.js adding data", data[i]);
    let d = data[i];
    let x = d[0];
    let y = d[1];
    let l = 1;
    if (d.length > 2) {
      l = d[2];
    } // length of the tic
    if (y === true || y > 0) {
      let polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline",
      );
      polygon.setAttributeNS(null, "stroke", graphLine.lineColor);
      polygon.setAttributeNS(null, "opacity", graphLine.lineAlpha);
      polygon.setAttributeNS(null, "stroke-width", graphLine.boolWidth);
      polygon.setAttributeNS(null, "shape-rendering", "optimizeQuality");

      let point = svg.createSVGPoint();
      point.x = (x - graphLine.minX) * step;
      point.y = graphLine.yOffset;
      polygon.points.appendItem(point);
      let point2 = svg.createSVGPoint();
      point2.x = (x + l - graphLine.minX) * step;
      point2.y = graphLine.yOffset;
      polygon.points.appendItem(point2);
      svg.appendChild(polygon);
    }
  }
}
