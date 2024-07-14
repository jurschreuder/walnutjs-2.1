<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-12">
      <h1>Draw</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-8">
      <DrawCanvas 
        :display="display"
      ></DrawCanvas>
    </div>

    <div class="col-4">
      <!--<JsonEditor></JsonEditor>-->
    </div>
  </div>
  <div class="row">
    <div class="col-12 my-2">
      <form class="row gy-2 gx-3 align-items-center">
        <div class="col-4">
          <div class="input-group">
            <div class="input-group-text">Node path</div>
            <input v-model="newNode.path" type="text" class="form-control" id="newNode_path" placeholder="visualCortex/V1">
          </div>
        </div>
        <div class="col-2">
          <div class="input-group">
            <div class="input-group-text">width</div>
            <input v-model="newNode.w" type="number" class="form-control" id="newNode_w" placeholder="10">
          </div>
        </div>
        <div class="col-2">
          <div class="input-group">
            <div class="input-group-text">height</div>
            <input v-model="newNode.h" type="number" class="form-control" id="newNode_h" placeholder="10">
          </div>
        </div>
        <div class="col-2">
          <div class="input-group">
            <div class="input-group-text">color</div>
            <input v-model="newNode.color" type="color" class="form-control form-control-color" id="newNode_color">
          </div>
        </div>
        <div class="col-auto">
          <button type="button" class="btn btn-primary" @click="addNodeForm">Add node</button>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script setup>

import { ref, onMounted } from 'vue'

import JsonEditor from "./../components/editor/JsonEditor.vue";

import DrawCanvas from "./../components/draw/DrawCanvas.vue";


import { Network, Node, Tract, BasicActivate } from "walnutjs-2.1"

const paradigm = new BasicActivate();
const network = new Network("WalnutJS-2.1 Network", paradigm);

const networkDict = ref(network.dict);
const display = ref(network.display);

const newNode = ref({ path: "my/node", w: 10, h: 10, x: 100, y: 100, color: 'rgb(0,0,0)'});

const addNodeForm = () => {
  //if(newNode.path === ""){ return; }

  try{
    console.log(newNode.value);
    const v = newNode.value;

    const node = new Node(network, v.path, v.w, v.h);
    node.addDraggable(v.x, v.y, v.color);
    network.nodes.addNode(node);

    refresh();
  }catch(e){
    console.log(e);
  }

}

const addTract = (path, inNode, outNode) => {
  const tract = new Tract(network, path, inNode, outNode);
  network.tracts.addTract(tract);
}

const refresh = () => {
  //console.log("network:", network);
  //console.log("network dict:", network.dict);
  //console.log("network display:", network.display);

  networkDict.value = network.dict;

  display.value.createHierarchy();
  //console.log("display.value", display.value);

}

refresh();

</script>
