<template>

<div class="draggable"
  :style="{
    left: (dragg.x+dragg.selected*-1)+'px',
    top: (dragg.y+dragg.selected*-1)+'px',
    width: (dragg.w + dragg.selected*2)+'px',
    height: (dragg.h + dragg.selected*2)+'px'
  }"
  :class="{
    selected: dragg.selected
  }"
  @mousedown="mouseDown($event)"
  @mousemove="mouseMove($event)"
  @mouseup="mouseUp($event)"
>

</div>

</template>

<script setup>
import { ref, reactive, computed, onMounted, defineProps } from 'vue'

import { Drag } from './drag.js'

const props = defineProps(["drag", "parentId"]);

let parentEl = false;

const dragg = reactive(props.drag);

const mouseDown = (evt) => {

  const bounds = parentEl.getBoundingClientRect();

  dragg.startDragging(
    evt.offsetX,
    evt.offsetY,
    evt.clientX - bounds.left,
    evt.clientY - bounds.top
  );

}

const mouseMove = (evt) => {
  if(!dragg.isDragging){ return; }

  const bounds = parentEl.getBoundingClientRect();
  const x = evt.clientX - bounds.left;
  const y = evt.clientY - bounds.top;

  dragg.move(x, y);

}

const mouseUp = (evt) => {
  dragg.isDragging = false;
}

onMounted(() => {
  parentEl = document.getElementById(props.parentId);
});


</script>


<style scoped>
.draggable{
  position: absolute;
  background: lightgray;
}
.selected {
  border-style: dashed;
  border-color: #0d6efd;
  border-width: 2px;
}

</style>


