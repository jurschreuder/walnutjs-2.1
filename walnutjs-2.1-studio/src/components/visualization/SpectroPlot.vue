<template>

<div>

  <canvas 
    ref="canvas" 
    style="width:500px;height:200px;"
    :width="canvWidth" 
    :height="canvHeight" 
    class="act-canvas">
  </canvas>

</div>

</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import FFT from "fft.js";

const walnut = inject('walnut');

const props = defineProps([
  "node" /* Node */, 
  "nodeVarName" /* string */, 
]);

const canvas = ref(false);
let ctx = false;

const canvWidth = ref(500);
const canvHeight = ref(50);

const conf = ref({
  min: -1,
  max: 1,
});

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
  //ctx.fillStyle = "rgb(100 100 100)";

  // draw on canvas
  //ctx.fillRect(0, 0, 100, 100);

  render();

});

const render = (min, max) => {

  const nodeVarName = props.nodeVarName;
  const node = props.node;
  const rec = walnut.recordings.recs[nodeVarName];

  console.log("node:", node);
  console.log("nodeVarName:", nodeVarName);
  console.log("rec:", rec);

  if(!rec || rec.length <= 0){
    console.log("trying to render rec but no data:", rec);
    return;
  }

  //canvWidth.value = rec.length.toFixed(0);
  //canvHeight.value = node.flatSize.toFixed(0);
  console.log("canvW", canvWidth.value, "canvH", canvHeight.value);

  const avgs = [];

  const yStart = node.startNeuronIndex;
  const ySize = node.flatSize;
  for(let x = 1; x < rec.length; x++){ // first one is NaN somehow
    let av = 0.0;
    for(let y = 0; y < ySize; y++){

      // get nodeVar value
      const v = rec[x][y+yStart];
      av += v / ySize;
    }
    avgs.push(av);
  }
  console.log("avgs:", avgs);

  // create spectro
  const sampleRate = 1000;
  const windowSize = 512;

  const f = new FFT(windowSize);
  const input = new Array(windowSize);
  input.fill(0);
  const out = f.createComplexArray();

  const maxFreq = 50;
  const amps = new Array(maxFreq);

  const spectro = [];

  for(let i = 0; i < rec.length - windowSize; i++){
    
    for(let j = 0; j < windowSize; j++){
      input[j] = avgs[i+j];
    }
    
    f.realTransform(out, input);
    // calculate the frequency amplitudes of first 100
    for (let j = 0; j < maxFreq * 2; j += 2) {
      let k = j / 2;
      let re = out[j];
      let im = out[j + 1];
      let v = Math.sqrt(re * re + im * im);
      amps[k] = v;

      // draw
      v *= 10;
      if (v > 255) {
        v = 255;
      }
      ctx.fillStyle = "rgb(" + v + "," + v + "," + v + ")";
      ctx.fillRect(i, maxFreq - k, 1, 1);
    }
    if (i == 0) {
      console.log("fourier output:", out);
      console.log("frequency magnitudes", amps);
    }
    spectro[i] = amps;
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





