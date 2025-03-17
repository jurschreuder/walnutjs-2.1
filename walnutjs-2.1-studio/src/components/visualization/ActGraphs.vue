<template>

<div>

<h2 class="text-muted">Average spikes count</h2>

<div class="btn" @click="downloadGraphSpikesPng(4)">Download .png</div>
<hr />

<div
  id="graphs-axis-y"
  style="
    height: 40px;
    width: 65px;
    position: absolute;
    margin-top: 40px;
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
    :style="{ height: totalGraphsN * 40 + 'px' }"
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
        height: totalGraphsN * 40 + 'px',
        left: sliderBarPerc,
      }"
    ></span>
    <div
      id="spikes-graphs"
      style="width: 100%; pointer-events: none"
      :style="{ height: totalGraphsN * 40 + 'px' }"
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
      v-for="(rec, index) in recs"
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
          :style="{ background: rec.spikeslLine.lineColor }"
        ></span>
        <span class="lbl-lbl no-save">{{ rec.spikesLine.name }}</span>
        <span class="lbl-value no-save">{{
          rec.spikesLine.slider.y.toFixed(2)
        }}</span>
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

const slider = ref(false);
const totalGraphsN = ref(3);
const sliderBarPerc = ref("0%");
const sliderBarMs = ref(0);

const recs = ref([]);


const sliderMouseMove = (evt) => {
  let x = event.offsetX / slider.value.clientWidth;
  sliderBarPerc.value = x * 100 + "%";
  sliderBarMs.value = x * 1000;
  let ms = x * 1000;
  for (let i = 0; i < recs.value.length; i++) {
    //this.recs[i].spikesLine.slideToX(ms);
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

});

const spikesFromRecs = () => {

}

const render = () => {

}

defineExpose({render});

</script>


<style scoped>

</style>





