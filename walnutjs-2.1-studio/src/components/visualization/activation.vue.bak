<template>

<div>

  <canvas ref="canvas" class="act-canvas"></canvas>

</div>

</template>

<script setup>
import { ref, onMounted, inject, defineProps } from 'vue'

const props = defineProps(["node", "nodeVariable"]);
const walnut = inject('walnut');

const canvas = ref(false);
let ctx = false;

const mouseDown = (evt) => {
  // todo
  //    evt.offsetX,
  //    evt.offsetY,
  //    evt.clientX - bounds.left,
  //    evt.clientY - bounds.top
}

const mouseMove = (evt) => {
  // todo
}

onMounted(() => {

  // TODO scale the canvas



  ctx = canvas.value.getContext("2d");

});

const renderNodeVariable = (node, nodeVar, min, max) => {
  nodeVar = nodeVar || "act";

  min = min || -1;
  max = max || 1;
  const scalePos = 255 / max;
  const scaleNeg = 255 / min;

  //console.log("dr", dr);
  for(let i = 0; i < node.todo; i++){
    // get nodeVar value
    const v = node.neuronAtIndex(nodeVar, i);
    
    // clip between 0 and 255
    const r = Math.max(min, Math.min(v*scaleNeg, 255)).toFixed(0); // neg (red)
    const g = Math.max(min, Math.min(v*scalePos, 255)).toFixed(0); // pos (green)

    // calc color
    ctx.fillStyle = "rgb("+r+" "+g+" 0)";

    // draw on canvas
    ctx.fillRect(
      1+x*px1,
      1+y*px1,
      px2,
      px2,
    );
  }
}

</script>


<style scoped>

.act-canvas {
  width: 100%;
  height: 20px;
}

</style>



