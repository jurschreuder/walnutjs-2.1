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
    }" ></div>
  <span class="label">{{props.drag.label}}</span>
</div>

</template>

<script setup>
import { ref, reactive, computed, onMounted, defineProps } from 'vue'

//import { Drag } from './drag.js'

const props = defineProps(["drag", "parentId"]);

let parentEl = false;


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

}

const mouseUp = (evt) => {
  props.drag.isDragging = false;
}

onMounted(() => {
  parentEl = document.getElementById(props.parentId);
});


</script>


<style scoped>
.draggable{
  position: absolute;
  opacity: 0.8;
}
.draggable-bg{
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
  left: 2px;
  top: 0px;
  display: block;
  font-size: 10px;
  user-select: none;
}

</style>


