<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-12 mt-4">
      <h1>About</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <div 
        id="svg-canvas"
        @mousemove="mouseMove($event)">

      </div> 
    </div>
  </div>
</div>
</template>

<script setup>

import { ref, onMounted } from 'vue'

import { KexCanvas } from "./../libs/kex-svg/kexCanvas.js";
import { KexSvg } from "./../libs/kex-svg/kexSvg.js";
import { KexArrow } from "./../libs/kex-svg/kexArrow.js";

let canv = false;

let arrow = false;

onMounted(() => {

  // setup svg
  canv = new KexCanvas("svg-canvas");
  
  // test some svg stuff
  {
    arrow = new KexArrow(canv.parentId);
    arrow.lineWidth = 4.0;
    arrow.setFromPoint(400, 400);
    arrow.setToPoint(200, 300);
    canv.addDrawable(arrow);
  }

  // render
  canv.render();

});

const mouseMove = (evt) => {
  console.log("mouse move", evt);  
  arrow.setToPoint(evt.offsetX, evt.offsetY);
  canv.render();

}

</script>

<style scoped>
#svg-canvas{
  position: relative;
  width: 100%;
  height: 800px;
  background: #eee;
}
</style>
