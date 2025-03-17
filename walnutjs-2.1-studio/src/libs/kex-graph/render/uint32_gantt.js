
// uint32 encoded bit arrays from Siemens PCL
const uint32ToBools = (val) => {
  val = val >>> 0; // convert to uint32
  val = ((val & 0xFF) << 24) 
         | ((val & 0xFF00) << 8)
         | ((val >> 8) & 0xFF00)
         | ((val >> 24) & 0xFF);
  val = val >>> 0; // convert to uint32
  //console.log("val", val);
  return ('00000000000000000000000000000000' + (val).toString(2)).slice(-32).split("").reverse().join("")
}

export function renderUint32Gantt(graphLine, svg, step) {

  // lines where the data will be later
  for(let conf_i = 0; conf_i < graphLine.ganttConfs.length; conf_i++){
    const conf = graphLine.ganttConfs[conf_i];
    // use gantt defined color or just use a default color
    const color = conf.color || graphLine.defaultColors[ conf_i % graphLine.defaultColors.length ];

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
    point.y = graphLine.yOffset+conf.offset;
    polygon.points.appendItem(point);
    let point2 = svg.createSVGPoint();
    point2.x = (graphLine.maxX - graphLine.minX) * step;
    point2.y = graphLine.yOffset+conf.offset;
    polygon.points.appendItem(point2);
    svg.appendChild(polygon);
  }

  renderAddUint32Gantt(graphLine, svg, graphLine.data, step);

}

export function renderAddUint32Gantt(graphLine, svg, dataUint32, step){

  // extract the bool data from the uint32 data
  const datas = []; 
  for(let i = 0; i < dataUint32.length; i++){
    const v = dataUint32[i][1];
    const d = uint32ToBools(v); // uncode bits from uint32
    //console.log("data:", dataUint32[i], "val:", v, "bit encoded:", d)
    datas.push(d);
  }
  if(!datas || datas.length === 0){
    console.error("NO DATA FOR GANTT!! dataUint32:", dataUint32, "datas:", datas);
    return;
  }


  // render all confs
  for(let conf_i = 0; conf_i < graphLine.ganttConfs.length; conf_i++){
    const conf = graphLine.ganttConfs[conf_i];
     //conf = {i: 0, lbl: "0", offset: 0, height: 4, color: false /* use default */},

    //const data = datas[conf.i]; // correct bool data from the uint32 encoded bit data
    
    // use gantt defined color or just use a default color
    const color = conf.color || graphLine.defaultColors[ conf_i % graphLine.defaultColors.length ];

    const height = conf.height || 10; // use a default height if not provided
    const heightHalf = height / 2.0; // start drawing at half hight, so ends up with bottom on offset
   
    // render the data
    for (let i = 0; i < datas.length; i++) {
      //console.log("graph.js adding data", data[i]);
      let y = datas[i][conf.i]; // bit data

      let d = dataUint32[i]; // original data
      let x = d[0];
      let l = 1;
      if (d.length > 2) {
        l = d[2];
      } // length of the tic
      if (y === true || y > 0 || y === '1') {
        let polygon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polyline",
        );
        polygon.setAttributeNS(null, "stroke", color);
        polygon.setAttributeNS(null, "opacity", graphLine.lineAlpha);
        polygon.setAttributeNS(null, "stroke-width", height);
        polygon.setAttributeNS(null, "shape-rendering", "optimizeQuality");

        let point = svg.createSVGPoint();
        point.x = (x - graphLine.minX) * step;
        point.y = graphLine.yOffset + conf.offset - heightHalf;
        polygon.points.appendItem(point);
        let point2 = svg.createSVGPoint();
        point2.x = (x + l - graphLine.minX) * step;
        point2.y = graphLine.yOffset + conf.offset - heightHalf;
        polygon.points.appendItem(point2);
        svg.appendChild(polygon);
      }
    }
  }

}

