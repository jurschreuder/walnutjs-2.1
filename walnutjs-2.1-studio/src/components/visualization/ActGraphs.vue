<template>

<div>


<div class="text-end">
  <div class="btn btn-primary btn-sm mb-2" @click="downloadGraphSpikesPng(4)">Download .png</div>
</div>

<div
  id="graphs-axis-y"
  :style="{height: lineHeight+'px'}"
  style="
    width: 65px;
    position: absolute;
    overflow: visible;
  "
></div>
<div class="spikes-graphs-container">
  <div
    id=""
    v-on:mousemove="sliderMouseMove($event)"
    ref="slider"
    style="
      width: calc(100% - 84px);
      position: relative;
      margin-left: 80px;
    "
    :style="{ height: totalGraphsN * lineHeight + 'px' }"
  >
    <span
      class="no-save"
      id=""
      style="
        position: absolute;
        background: gray;
        width: 4px;
        opacity: 0.5;
        top: 0;
        pointer-events: none;
      "
      :style="{
        height: totalGraphsN * lineHeight + 'px',
        left: sliderBarPerc,
      }"
    ></span>
    <div
      id="spikes-graphs"
      style="width: 100%; pointer-events: none"
      :style="{ height: totalGraphsN * lineHeight + 'px' }"
    ></div>
  </div>

  <div
    id="graphs-axis-x"
    style="
      width: calc(100% - 84px);
      height: 40px;
      position: relative;
      margin-top: 4px;
      margin-left: 80px;
    "
  ></div>

  <div id="" class="mt-2 no-save">
    <span
      class="no-save"
      style="min-width: 5em; display: inline-block"
      ><b class="no-save">{{ sliderBarMs.toFixed(0) }}ms</b></span
    >
    <span
      class="graph-lbl mr-2 no-save"
      v-for="(spikeLine, index) in spikeLines"
      v-bind:key="index"
    >
      <a
        class="no-save"
        href="javascript:void(0)"
        @click="toggleAvgLine(index)"
        @mouseover="hoverAvgLine(index)"
        @mouseleave="hoverAvgLine(-1)"
      >
        <span
          class="lbl-color mr-1 no-save"
          :style="{ background: spikeLine.lineColor }"
        ></span>
        <span class="lbl-lbl no-save">{{ spikeLine.name }}</span>
        <span class="lbl-value no-save">{{
          spikeLine.slider.y.toFixed(2)
        }}%</span>
      </a>
    </span>
  </div>
</div>

</div>

</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { GraphLine } from "./../../libs/kex-graph/graph.js";
import { GraphAxis } from "./../../libs/kex-graph/axis.js";
import { GraphAxisY } from "./../../libs/kex-graph/axisY.js";

const walnut = inject('walnut');

const props = defineProps([
  "nodeVarName" /* string */, 
]);

const lineHeight = ref(100);
const slider = ref(false);
const totalGraphsN = ref(3);
const sliderBarPerc = ref("0%");
const sliderBarMs = ref(0);

const spikeLines = ref([]);


const sliderMouseMove = (evt) => {
  let x = event.offsetX / slider.value.clientWidth;
  sliderBarPerc.value = x * 100 + "%";
  sliderBarMs.value = x * 1000;
  let ms = x * 1000;
  for (let i = 0; i < spikeLines.value.length; i++) {
    spikeLines.value[i].slideToX(ms);
  }
}


onMounted(() => {
  console.log("ActGraphs walnut:", walnut);  

  {
    let axis = new GraphAxis("axis-x", "graphs-axis-x");
    axis.tics = 20;
    axis.labelSkips = 4;
    axis.postfix = "ms";
    axis.render();
  }
  {
    let axisY = new GraphAxisY("axis-y", "graphs-axis-y");
    axisY.tics = 4;
    axisY.minY = 0;
    axisY.maxY = 100;
    axisY.labelSkips = 2;
    axisY.lineWidth = 8;
    axisY.postfix = "%";
    axisY.fmtFunction = (v) => v.toFixed(0);
    axisY.render();
  }

  spikesFromRecs();

});

const spikesFromRecs = (scaleY) => {
  if(!walnut.network || !walnut.network.nodes){ return; }
  scaleY = scaleY || 1.0;

  spikeLines.value = [];

  const nodes = walnut.network.nodes.nodes;
  totalGraphsN.value = nodes.length;

  const nodeVarName = props.nodeVarName;
  const rec = walnut.recordings.recs[nodeVarName];

  for(let i = 0; i < nodes.length; i++){
    const node = nodes[i];
      
    const yStart = node.startNeuronIndex;
    const size = node.flatSize;
    const data = [];
    for(let x = 1; x < rec.length; x++){
      let av = 0.0;
      for(let y = 0; y < size; y++){
        // get nodeVar value
        const v = rec[x][y+yStart];
        av += v / size;
      }
      data.push([x, av]);
    }

    const spikeLine = new GraphLine("spikes-line-"+i, data, "spikes-graphs");
    spikeLine.maxX = 1000;
    spikeLine.maxY = scaleY * totalGraphsN.value;
    spikeLine.name = node.name;
    if(i === 0){ // grid
      spikeLine.grid.ticsX = 10;
      spikeLine.grid.ticsY = totalGraphsN.value;
    }
    spikeLine.yOffset = scaleY*(totalGraphsN.value-(i+1));
    console.log("spikeLine:", spikeLine);
    spikeLine.render();

    spikeLines.value.push(spikeLine);
  }
}

const render = () => {

}

defineExpose({render});

</script>


<style scoped>
.bold {
  font-weight: 900;
}
.lbl-color {
  position: absolute;
  display: inline-block;
  width: 1em;
  height: 1em;
  border-radius: 0.5em;
  margin-top: 0.2em;
  margin-left: 0.2em;
}
.lbl-lbl {
  display: inline-block;
  margin-left: 1.6em;
  margin-right: 0.8em;
}
.lbl-value {
  display: inline-block;
  margin-right: 0em;
  width: 3em;
}
.graph-lbl {
  display: inline-block;
  border: rgba(0, 0, 0, 0.2);
  border-style: solid;
  border-width: thin;
  border-radius: 0.4em;
  margin-bottom: 0.2em;
  margin-right: 0.2em;
}
</style>





