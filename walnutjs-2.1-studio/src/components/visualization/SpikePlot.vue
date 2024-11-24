<template>

<div>

  <canvas 
    ref="canvas" 
    :width="canvWidth" 
    :height="canvHeight" 
    class="act-canvas">
  </canvas>

</div>

</template>

<script setup>
import { ref, onMounted, inject, defineProps, defineExpose } from 'vue'

const walnut = inject('walnut');

const props = defineProps([
  "node" /* Node */, 
  "nodeVar" /* string */, 
]);

const canvas = ref(false);
let ctx = false;

const canvWidth = ref(1000);
const canvHeight = ref(100);

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
  
  console.log("canvas",canvas.value);
  ctx = canvas.value.getContext("2d");
  console.log("ctx",ctx);

  // calc color
  ctx.fillStyle = "rgb(100 100 100)";

  // draw on canvas
  ctx.fillRect(0, 0, 100, 100);

  render(props.min,props.max);

});

const render = (min, max) => {

  const nodeVar = props.nodeVar;
  const node = props.node;
  const rec = walnut.recordings.recs[nodeVar];

  console.log("node:", node);
  console.log("nodeVar:", nodeVar);
  console.log("rec:", rec);

  if(!rec || rec.length <= 0){
    console.log("trying to render rec but no data:", rec);
    return;
  }

  //canvWidth.value = rec.length.toFixed(0);
  //canvHeight.value = node.flatSize.toFixed(0);
  console.log("canvW", canvWidth.value, "canvH", canvHeight.value);

  min = min || -1;
  max = max || 1;
  const scalePos = 255 / max;
  const scaleNeg = 255 / min;

  //console.log("dr", dr);
  const yStart = node.startNeuronIndex;
  for(let x = 0; x < rec.length; x++){
    for(let y = 0; y < node.flatSize; y++){

      // get nodeVar value
      const v = rec[x][y+yStart];
      
      // clip between 0 and 255
      //const r = '100';//Math.max(min, Math.min(v*scaleNeg, 255)).toFixed(0); // neg (red)
      const g = Math.max(min, Math.min(v*scalePos, 255)).toFixed(0); // pos (green)

      // calc color
      ctx.fillStyle = "rgb("+g+" "+g+" "+g+")";

      // draw on canvas
      ctx.fillRect(
        x,
        y,
        x+1,
        y+1,
      );
    }
  }
}

defineExpose({render});

</script>


<style scoped>

.act-canvas {
  width: 100%;
  height: 100px;
}

</style>




