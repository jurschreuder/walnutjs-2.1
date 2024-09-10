// By Jurriaan Schreuder @ Kexxu

class KexSvg {

  static uuid(prefix){
    prefix = prefix || 'kexSvg';
    return prefix + '-' + (Date.now()*1000) +
      parseInt(Math.random()*1e16).toString(36);
  }
  
  // how to use:
  // svg.appendChild(polygon);
  static line(x1, y1, x2, y2, color, width, alpha){
    color = color || '#000';
    width = width || 1;
    alpha = alpha || 1;

    const line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline",
    );
    line.setAttributeNS(null, "stroke", color);
    line.setAttributeNS(null, "fill", "none");
    line.setAttributeNS(null, "opacity", alpha);
    line.setAttributeNS(null, "stroke-width", width);
    line.setAttributeNS(null, "shape-rendering", "optimizeQuality");

    const point1 = svg.createSVGPoint();
    point1.x = x1;
    point1.y = y1; 
    line.points.appendItem(point1);
    const point2 = svg.createSVGPoint();
    point2.x = x2;
    point2.y = y2;
    line.points.appendItem(point2);

    return line;
  }

  static path(points, color, width, alpha){
    // see: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
    
    color = color || '#000';
    width = width || 1;
    alpha = alpha || 1;

    const path = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    path.setAttributeNS(null, "fill", "transparent");
    path.setAttributeNS(null, "stroke", color);
    path.setAttributeNS(null, "stroke-width", width);
    path.setAttributeNS(null, "opacity", alpha);
    path.setAttributeNS(null, "marker-end", "url(#arrow)");

    let d = "M " + points[0][0] + " " + points[0][1] + " Q ";
    d += points[1][0] + " " + points[1][1] + " " + points[1][2] + " " + points[1][3] + " T ";
    d += points[2][0] + " " + points[2][1];

    //path.setAttribute("d", "M 10 80 Q 40 10, 65 10 T 180 80");
    path.setAttribute("d", d);


    return path;
  }

}

export { KexSvg }
