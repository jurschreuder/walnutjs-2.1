<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-12">
      <h1>Draw</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-8">
      <DrawCanvas></DrawCanvas>
    </div>

    <div class="col-4">
      <JsonEditor></JsonEditor>
    </div>
  </div>
</div>
</template>

<script setup>

import { ref } from 'vue'

import JsonEditor from "./../components/editor/JsonEditor.vue";

import DrawCanvas from "./../components/draw/DrawCanvas.vue";


import { Network, Node, Tract, BasicActivate } from "walnutjs-2.1"

const paradigm = new BasicActivate();
const network = new Network("WalnutJS-2.1 Network", paradigm);
console.log("network:", network);

</script>
