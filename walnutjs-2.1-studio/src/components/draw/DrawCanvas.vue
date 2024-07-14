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
      v-for="(drag, index) in props.display.nodeDraggables"
      :drag="drag"
      :parentId="'drawingBackground'"
      @click="select(index)"
    ></Draggable>

  </div>


</div>

</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'

import Draggable from './Draggable.vue'

const props = defineProps([
  "display", // WalnutJS network.display
]);

//const display = reactive(props.display);

const layout = ref({
  width: 2000,
  height: 2000,
  scale: 1,
});

//const neuronSizePx = 4;

//const nodeDraggablse = ref([]);
//let dragPaths = {}; // key: path, value: drag

//let drawX = 100; // where to start drawing
//let drawY = 100;

//const dragsFromNetworkDict = (networkDict) => {
//  const updatedDrags = [];
//  const updatedDragPaths = {};
//
//  const gutterPx = 20;
//
//  for(let i = 0; i < networkDict.nodes.nodes.length; i++){
//    const node = networkDict.nodes.nodes[i];
//    if(node.path in dragPaths){ // only update
//      dragPaths[node.path].width = node.width*neuronSizePx;
//      dragPaths[node.path].height = node.height*neuronSizePx;
//      // rebuild draw lists
//      updatedDrags.push(dragPaths[node.path]);
//      updatedDragPaths[node.path] = dragPaths[node.path];
//    }else{ // add new
//      const w = node.width*neuronSizePx;
//      const h = node.height*neuronSizePx;
//      const lbl = node.path.split("/").at(-1);
//      const drag = new Drag(drawX, drawY, w, h, lbl);
//      console.log("added drag:", drag);
//      console.log("node.name:", node.name);
//      // rebuild draw lists
//      updatedDrags.push(drag);
//      updatedDragPaths[node.path] = drag;
//
//      // dont draw on top of each other
//      drawX += gutterPx;
//      drawY += gutterPx;
//    }
//  }
//  drags.value = updatedDrags;
//  dragPaths = updatedDragPaths;
//}


onMounted(() => {
  //dragsFromNetworkDict(props.networkDict);
  console.log("DrawCanvas display:", props.display);
});

watch(() => props.display, (newDisplay, oldDisplay) => {
  console.log("DrawCanvas got a new display:", newDisplay)
});


const backgroundSize = computed(() => {
  const big = 100 * layout.value.scale + "px";
  const small = 10 * layout.value.scale + "px";
  const s = big + " " + big + ", " + big + " " + big + ", " + small + " " + small + ", " + small + " " + small;
  return s;
});


const mouseUp = () => {
  const drags = props.display.nodeDraggables;
  for(let i = 0; i < drags.length; i++){
    drags[i].isDragging = false;
  }
}

const mouseMove = (evt) => {
  const drags = props.display.nodeDraggables;
  for(let i = 0; i < drags.length; i++){
    drags[i].move(evt);
  }
}

const select = (index) => {
  unselect();
  const drags = props.display.nodeDraggables;
  drags[index].selected = true;
}

const unselect = () => {
  const drags = props.display.nodeDraggables;
  for(let i = 0; i < drags.length; i++){
    drags[i].selected = false;
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

