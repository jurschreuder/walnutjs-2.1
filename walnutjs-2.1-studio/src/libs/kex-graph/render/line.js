
export function renderLine(graphLine, svg, step, mult) {

  let polygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline",
  );
  polygon.setAttributeNS(null, "stroke", graphLine.lineColor);
  polygon.setAttributeNS(null, "fill", "none");
  polygon.setAttributeNS(null, "opacity", graphLine.lineAlpha);
  polygon.setAttributeNS(null, "stroke-width", graphLine.lineWidth + graphLine.lineWidth*graphLine.selected);
  polygon.setAttributeNS(null, "shape-rendering", "optimizeQuality");

  graphLine._lastX = graphLine.data[0][0];
  let lineLen = 0;
  for (let i = 0; i < graphLine.data.length; i++) {
    let x = graphLine.data[i][0];
    let y = graphLine.data[i][1];

    if (graphLine.maxGapX > 0 && x - graphLine._lastX > graphLine.maxGapX) {
      if (lineLen > 1) {
        svg.appendChild(polygon);
      }
      lineLen = 0;

      polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline",
      );
      polygon.setAttributeNS(null, "stroke", graphLine.lineColor);
      polygon.setAttributeNS(null, "fill", "none");
      polygon.setAttributeNS(null, "opacity", graphLine.lineAlpha);
      polygon.setAttributeNS(null, "stroke-width", graphLine.lineWidth + graphLine.lineWidth*graphLine.selected);
      polygon.setAttributeNS(null, "shape-rendering", "optimizeQuality");
    }
    graphLine._lastX = x;

    let point = svg.createSVGPoint();
    point.x = (x - graphLine.minX) * step;
    if (graphLine.invertedY) {
      point.y = (y - graphLine.minY) * mult;
    } else {
      point.y = graphLine.height - (y - graphLine.minY) * mult;
    }
    polygon.points.appendItem(point);
    lineLen += 1;
  }
  svg.appendChild(polygon);
}

export function renderAddLine(graphLine, svg, data, step, mult){

  let polygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline",
  );
  polygon.setAttributeNS(null, "stroke", graphLine.lineColor);
  polygon.setAttributeNS(null, "fill", "none");
  polygon.setAttributeNS(null, "opacity", graphLine.lineAlpha);
  polygon.setAttributeNS(null, "stroke-width", graphLine.lineWidth + graphLine.lineWidth*graphLine.selected);
  polygon.setAttributeNS(null, "shape-rendering", "optimizeQuality");

  let lineLen = 0;
  for (let i = -1; i < data.length; i++) {
    let x = 0.0;
    let y = 0.0;
    if(i === -1){
      if(graphLine.data.length === 0){ continue; } 
      x = graphLine.data.at(-1)[0];
      y = graphLine.data.at(-1)[1];
    }else{
      x = data[i][0];
      y = data[i][1];
    }

    if (graphLine.maxGapX > 0 && x - graphLine._lastX > graphLine.maxGapX) {
      if (lineLen > 1) {
        svg.appendChild(polygon);
      }
      lineLen = 0;

      polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline",
      );
      polygon.setAttributeNS(null, "stroke", graphLine.lineColor);
      polygon.setAttributeNS(null, "fill", "none");
      polygon.setAttributeNS(null, "opacity", graphLine.lineAlpha);
      polygon.setAttributeNS(null, "stroke-width", graphLine.lineWidth + graphLine.lineWidth*graphLine.selected);
      polygon.setAttributeNS(null, "shape-rendering", "optimizeQuality");
    }
    graphLine._lastX = x;

    let point = svg.createSVGPoint();
    point.x = (x - graphLine.minX) * step;
    if (graphLine.invertedY) {
      point.y = (y - graphLine.minY) * mult;
    } else {
      point.y = graphLine.height - (y - graphLine.minY) * mult;
    }
    polygon.points.appendItem(point);
    lineLen += 1;
  }
  svg.appendChild(polygon);
}
