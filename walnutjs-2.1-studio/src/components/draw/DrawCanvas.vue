<template>
<div
  id="drawingBackgroundContainer"
  ref="backgroundContainer">

    <div
      id="drawingBackground"
      ref="background"
      :style="{
        width: layout.width+'px',
        height: layout.height+'px',
        'background-size': backgroundSize,
      }"
      @mousemove.self="mouseMove($event)"
      @mouseup.self="mouseUp()"
      @click.self="unselect()"
    >

    <Draggable
      v-for="(drag, index) in drags"
      :drag="drag"
      :parentId="'drawingBackground'"
      @click="select(index)"
    ></Draggable>

  </div>


</div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import { Drag } from './drag.js'
import Draggable from './Draggable.vue'

defineProps({
  msg: String,
})

const layout = ref({
  width: 2000,
  height: 2000,
  scale: 1,
});

const drags = ref([]);

onMounted(() => {

  const d1 = new Drag( 100, 100, 50, 50);
  drags.value.push(d1);
  const d2 = new Drag( 300, 100, 100, 100);
  drags.value.push(d2);

});


const backgroundSize = computed(() => {
  const big = 100 * layout.value.scale + "px";
  const small = 10 * layout.value.scale + "px";
  const s = big + " " + big + ", " + big + " " + big + ", " + small + " " + small + ", " + small + " " + small;
  return s;
});


const mouseUp = () => {
  for(let i = 0; i < drags.value.length; i++){
    drags.value[i].isDragging = false;
  }
}

const mouseMove = (evt) => {
  for(let i = 0; i < drags.value.length; i++){
    drags.value[i].move(evt.offsetX, evt.offsetY);
  }
}

const select = (index) => {
  unselect();
  drags.value[index].selected = true;
}

const unselect = () => {
  console.log("unselect");
  for(let i = 0; i < drags.value.length; i++){
    drags.value[i].selected = false;
  }
}



</script>


<style scoped lang="scss">

$grid-color: grey;
$full-height: 100vh;

#drawingBackground {
  position: relative;
  background-color: rgba(#fff, 1);
  background-image: linear-gradient($grid-color 1px, transparent 1px),
    linear-gradient(90deg, $grid-color 1px, transparent 1px),
    linear-gradient(rgba(150, 150, 150, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(150, 150, 150, 0.1) 1px, transparent 1px);
  background-position:
    -1px -1px,
    -1px -1px,
    -1px -1px,
    -1px -1px;
  border: 1px solid $grid-color;
  z-index: 0;
}

#drawingBackgroundContainer {
  max-width: 100%;
  padding: 0;
  height: calc(100vh - 100px);
  overflow: scroll;
}

.selectedElement {
  outline: 2px solid rgba(244, 3, 3, 0.5) !important;
  outline-offset: 1px;
  border-radius: 5px;
}

.draggingElement {
  pointer-events: none;
}


</style>

