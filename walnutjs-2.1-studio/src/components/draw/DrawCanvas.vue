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
      @dragMove="render"
    ></Draggable>

  </div>


</div>

</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'

import Draggable from './Draggable.vue'


//const display = reactive(props.display);
import { KexCanvas } from "./../../libs/kex-svg/kexCanvas.js";
import { KexSvg } from "./../../libs/kex-svg/kexSvg.js";
import { KexArrow } from "./../../libs/kex-svg/kexArrow.js";

let canv = false;

const props = defineProps([
  "display", // WalnutJS network.display
]);

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

  // setup svg
  canv = new KexCanvas("drawingBackground");
  
  // test some svg stuff
  if(false){
    const arrow = new KexArrow(canv.parentId);
    arrow.lineWidth = 4.0;
    arrow.setFromPoint(400, 400);
    arrow.setToPoint(200, 300);
    canv.addDrawable(arrow);
  }

  // render
  canv.render();

});

watch(() => props.display, (newDisplay, oldDisplay) => {
  console.log("DrawCanvas got a new display:", newDisplay)

  renderArrows();

});

const backgroundSize = computed(() => {
  const big = 100 * layout.value.scale + "px";
  const small = 10 * layout.value.scale + "px";
  const s = big + " " + big + ", " + big + " " + big + ", " + small + " " + small + ", " + small + " " + small;
  return s;
});

const render = () => {
  renderArrows();
}

const renderArrows = () => {
  const arrows = props.display.tractArrows;
  console.log("creating arrows:", arrows);
  
  for(let i = 0; i < arrows.length; i++){
    const arrow = arrows[i];
    if(!arrow.drawable){
      const a = new KexArrow(canv.parentId);
      a.lineWidth = 2.0;
      a.setFromPoint(arrow.fromDraggable.center.x, arrow.fromDraggable.center.y);
      a.setToPoint(arrow.toDraggable.center.x, arrow.toDraggable.center.y);
      //a.arrowRef = arrow;
      arrow.drawable = a;
      canv.addDrawable(a);
    }else{
      const a = arrow.drawable;
      let x1 = arrow.fromDraggable.center.x;
      let y1 = arrow.fromDraggable.center.y;
      let x2 = arrow.toDraggable.center.x;
      let y2 = arrow.toDraggable.center.y;
     
      // left/right
      if(Math.abs(x1-x2) > Math.abs(y1-y2)){
        if(x1 < x2){ // left center
          x1 = arrow.fromDraggable.rightCenter.x;
          y1 = arrow.fromDraggable.rightCenter.y;
          x2 = arrow.toDraggable.leftCenter.x;
          y2 = arrow.toDraggable.leftCenter.y;
        }else{ // right center
          x1 = arrow.fromDraggable.leftCenter.x;
          y1 = arrow.fromDraggable.leftCenter.y;
          x2 = arrow.toDraggable.rightCenter.x;
          y2 = arrow.toDraggable.rightCenter.y;
        }
      }else{ // top/bottom
        if(y1 < y2){ // top center
          x1 = arrow.fromDraggable.bottomCenter.x;
          y1 = arrow.fromDraggable.bottomCenter.y;
          x2 = arrow.toDraggable.topCenter.x;
          y2 = arrow.toDraggable.topCenter.y;
        }else{ // bottom center
          x1 = arrow.fromDraggable.topCenter.x;
          y1 = arrow.fromDraggable.topCenter.y;
          x2 = arrow.toDraggable.bottomCenter.x;
          y2 = arrow.toDraggable.bottomCenter.y;
        }
      }

      //console.log(Date.now(), x1,y1,x2,y2)
      a.setFromPoint(x1,y1);
      a.setToPoint(x2,y2);
    }
  }

  canv.render();
}

const mouseUp = () => {
  const drags = props.display.nodeDraggables;
  for(let i = 0; i < drags.length; i++){
    drags[i].isDragging = false;
  }
  render();
}

const mouseMove = (evt) => {
  const drags = props.display.nodeDraggables;
  for(let i = 0; i < drags.length; i++){
    drags[i].move(evt);
  }
  render();
}

const select = (index) => {
  unselect();
  const drags = props.display.nodeDraggables;
  drags[index].selected = true;
  render();
}

const unselect = () => {
  const drags = props.display.nodeDraggables;
  for(let i = 0; i < drags.length; i++){
    drags[i].selected = false;
  }
  render();
}

defineExpose({
  render
})

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

