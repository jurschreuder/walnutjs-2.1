<template>

<div class="draggable"
  :style="{
    left: (props.drag.x+props.drag.selected*-1)+'px',
    top: (props.drag.y+props.drag.selected*-1)+'px',
    width: (props.drag.w + props.drag.selected*2)+'px',
    height: (props.drag.h + props.drag.selected*2)+'px',
    borderColor: props.drag.color
  }"
  :class="{
    selected: props.drag.selected
  }"
  @mousedown="mouseDown($event)"
  @mousemove="mouseMove($event)"
  @mouseup="mouseUp($event)"
>
  <div class="draggable-bg" 
    :style="{
      background: props.drag.color
    }" >

  </div>
  
  <span v-if="props.drag.selected" class="label label-big">{{props.drag.node.path}}</span>
  <span v-else class="label">{{props.drag.label}}</span>

  <canvas 
    class="inner-canvas" 
    :width="props.drag.w" 
    :height="props.drag.h" 
    ref="canvas">
  </canvas>

</div>

</template>

<script setup>
import { ref, reactive, computed, onMounted, defineProps } from 'vue'

//import { Drag } from './drag.js'

const props = defineProps(["drag", "parentId"]);
const emit = defineEmits(['dragMove'])

let parentEl = false;
const canvas = ref(false);
let ctx = false;


//const dragg = reactive(props.drag);

const mouseDown = (evt) => {

//  const bounds = parentEl.getBoundingClientRect();
//
//  dragg.startDragging(
//    evt.offsetX,
//    evt.offsetY,
//    evt.clientX - bounds.left,
//    evt.clientY - bounds.top
//  );

  props.drag.startDragging(evt, parentEl);

}

const mouseMove = (evt) => {
  //if(!dragg.isDragging){ return; }

//  const bounds = parentEl.getBoundingClientRect();
//  const x = evt.clientX - bounds.left;
//  const y = evt.clientY - bounds.top;
//
//  dragg.move(x, y);

  props.drag.move(evt, parentEl);
  emit('dragMove');

}

const mouseUp = (evt) => {
  props.drag.isDragging = false;
}

onMounted(() => {
  parentEl = document.getElementById(props.parentId);

  ctx = canvas.value.getContext("2d");

  // test
  //renderNodeVariable("net", -1, 1);

});

const renderNodeVariable = (nodeVar, min, max) => {
  nodeVar = nodeVar || "net";

  // TODO get the min / max values for this nodeVar
  min = min || -1;
  max = max || 1;
  const scalePos = 255 / max;
  const scaleNeg = 255 / min;

  const dr = props.drag;
  console.log("dr", dr);
  for(let x = 0; x < dr.node.width; x++){
    for(let y = 0; y < dr.node.height; y++){
      // get nodeVar value
      const v = dr.node.neuronAtXy(nodeVar, x, y);
      
      // clip between 0 and 255
      const r = Math.max(min, Math.min(v*scaleNeg, 255)).toFixed(0); // neg (red)
      const g = Math.max(min, Math.min(v*scalePos, 255)).toFixed(0); // pos (green)

      // calc color
      ctx.fillStyle = "rgb("+r+" "+g+" 0)";

      // draw on canvas
      ctx.fillRect(
        x*dr.neuronPxSize,
        y*dr.neuronPxSize,
        dr.neuronPxSize,
        dr.neuronPxSize,
      );
    }
  }
}

defineExpose({renderNodeVariable})

</script>


<style scoped>
.draggable{
  position: absolute;
  opacity: 0.8;
}
.draggable-bg{
  position: absolute;
  opacity: 0.2;
  width: 100%;
  height: 100%;
}
.selected {
  border-style: dashed;
  border-width: 2px;
}
.label {
  position: absolute;
  left: 0px;
  top: -14px;
  display: block;
  font-size: 10px;
  user-select: none;
}
.label-big {
  top: -17px;
  font-size: 11px;
  font-weight: 500;
}

.inner-canvas {
  position: absolute;
}

</style>


