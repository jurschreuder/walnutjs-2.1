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
        ref="drawCanvas"
      ></DrawCanvas>
    </div>

    <div class="col-4">
      <!--<JsonEditor></JsonEditor>-->
      <div class="row">
        <div class="col-12">
          <h6>Activate</h6>
          <div class="input-group">
            <div class="input-group-text">iters</div>
            <input v-model="activateInput.iters" type="number" class="form-control" id="activate_iters" placeholder="1000">
          </div>
        </div>
        <div class="col-12 mt-1">Quick set 
          <div class="badge badge-sm bg-secondary" @click="activateInput.iters=1">1</div>
          <div class="badge badge-sm bg-secondary" @click="activateInput.iters=10">10</div>
          <div class="badge badge-sm bg-secondary" @click="activateInput.iters=100">100</div>
          <div class="badge badge-sm bg-secondary" @click="activateInput.iters=1000">1000</div>
          <div class="badge badge-sm bg-secondary" @click="activateInput.iters=10000">10000</div>
        </div>
        <div class="col-4 mt-3">
          <div class="btn btn-primary" @click="activate(activateInput.iters, 1)">activate</div>
        </div>
        <div class="col-8 mt-3 pt-2">
          Net iteration: {{networkStats.activationIter}}
        </div>
        <div class="col-12 mt-2 mb-1">
          Visualize 
          <div v-for="v in networkStats.nodeVariables" 
              class="badge badge-sm" 
              :class="{ 'bg-primary': v.name === networkStats.curNodeVariable.name, 'bg-secondary': v.name !== networkStats.curNodeVariable.name }"
              @click="visualizeNodeVar(v)">
            {{v.name}}</div>
        </div>
        <div class="col-6">
          <div class="input-group">
            <div class="input-group-text">min</div>
            <input v-model="networkStats.curNodeVariable.range[0]" type="number" class="form-control">
          </div>
        </div>
        <div class="col-6">
          <div class="input-group">
            <div class="input-group-text">max</div>
            <input v-model="networkStats.curNodeVariable.range[1]" type="number" class="form-control">
          </div>
        </div>
      </div>

      <!-- new node -->
      <hr>
      <div class="col-12 my-4">
        <h6>Add node</h6>
        <form class="row gy-2 gx-3 align-items-center">
          <div class="col-12">
            <div class="input-group">
              <div class="input-group-text">Node path</div>
              <input v-model="newNode.path" type="text" class="form-control" id="newNode_path" placeholder="visualCortex/V1">
            </div>
          </div>
          <div class="col-4">
            <div class="input-group">
              <div class="input-group-text">width</div>
              <input v-model="newNode.w" type="number" class="form-control" id="newNode_w" placeholder="10">
            </div>
          </div>
          <div class="col-4">
            <div class="input-group">
              <div class="input-group-text">height</div>
              <input v-model="newNode.h" type="number" class="form-control" id="newNode_h" placeholder="10">
            </div>
          </div>
          <div class="col-4">
            <div class="input-group">
              <div class="input-group-text">pixels</div>
              <input v-model="newNode.pxSize" type="number" class="form-control" id="newNode_pxSize" placeholder="4">
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <div class="input-group-text">color</div>
              <input v-model="newNode.color" type="color" class="form-control form-control-color" id="newNode_color">
            </div>
          </div>
          <div class="col-6">
            <!-- empty -->
          </div>
          <div class="col-6 mt-3">
            <button type="button" class="btn btn-primary" @click="addNodeForm">Add node</button>
          </div>
        </form>
      </div>


      <!-- new tract -->
      <hr>
      <div class="col-12 my-4">
        <h6>Add tract</h6>
        <form class="row gy-2 gx-3 align-items-center">
          <div class="col-12">
            <div class="input-group">
              <div class="input-group-text">Tract path</div>
              <input v-model="newTract.path" type="text" class="form-control" id="newTract_path" placeholder="visualCortex/tract1">
            </div>
          </div>


          <div class="col-12">
            <div class="input-group">
              <div class="input-group-text">From node path</div>
              <input v-model="newTract.fromPath" type="text" class="form-control" id="newTract_from_path" placeholder="visualCortex/V1">
            </div>
          </div>

          <div class="col-12">
            <div class="input-group">
              <div class="input-group-text">To node path</div>
              <input v-model="newTract.toPath" type="text" class="form-control" id="newTract_to_path" placeholder="visualCortex/V2">
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <div class="input-group-text">sparcity</div>
              <input v-model="newTract.sparcity" type="number" class="form-control" id="newTract_sparcity" placeholder="0.5" max="1.0" min="0.0" step="0.1">
            </div>
          </div>

          <div class="col-6">
            <div class="input-group">
              <div class="input-group-text">color</div>
              <input v-model="newTract.color" type="color" class="form-control form-control-color" id="newTract_color">
            </div>
          </div>
          <div class="col-6 mt-3">
            <button type="button" class="btn btn-primary" @click="addTractForm">Add tract</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <hr>

</div>
</template>

<script setup>

import { ref, onMounted } from 'vue'

import JsonEditor from "./../components/editor/JsonEditor.vue";

import DrawCanvas from "./../components/draw/DrawCanvas.vue";


import { Network, Node, Tract, BasicActivate, Izhi9param } from "walnutjs-2.1"

//const paradigm = new BasicActivate();
const paradigm = new Izhi9param();
const network = new Network("WalnutJS-2.1 Network", paradigm);

const networkDict = ref(network.dict);
const display = ref(network.display);
const drawCanvas = ref(null);

const newNode = ref({ path: "my/node1", w: 10, h: 10, x: 100, y: 100, color: 'rgb(0,0,0)', pxSize: 4});

const newTract = ref({ path: "my/tract1", fromPath: "my/node1", toPath: "my/node2", sparcity: 0.5, color: 'rgb(0,0,0)'});

const activateInput = ref({ iters: 1000 });
const networkStats = ref({
  activationIter: network.nodes.activationIter,

  curNodeVariable: {name: "act", range: [-1,1]},
  nodeVariables: network.nodes.nodeVariables,
});

const addNodeForm = () => {
  //if(newNode.path === ""){ return; }

  try{
    const v = newNode.value;
    const node = new Node(network, v.path, v.w, v.h);
    node.addDraggable(v.x, v.y, v.color, v.pxSize);
    network.nodes.addNode(node);

    // might have added new node variables, update

    refresh();

    console.log(networkStats);
  }catch(e){
    console.log(e);
  }

}

const addTractForm = () => {
  try{
    const v = newTract.value;
    console.log(v);
    const inNode = network.nodes.getNodeByPath(v.fromPath);
    const outNode = network.nodes.getNodeByPath(v.toPath);
    const tract = new Tract(network, v.path, inNode, outNode);
    //tract.connectBasicLinear(v.sparcity, -0.5, 0.5);
    tract.connectBasicLinear(v.sparcity, 0.0, 1.0);
    network.tracts.addTract(tract);

    refresh();
  }catch(e){
    console.log(e);
  }
}

const refresh = () => {
  //console.log("network:", network);
  //console.log("network dict:", network.dict);
  //console.log("network display:", network.display);

  networkDict.value = network.dict;

  networkStats.value.nodeVariables = network.nodes.nodeVariables;

  display.value.createHierarchy();
  //console.log("display.value", display.value);
  if(drawCanvas.value){
    drawCanvas.value.render();
  }
}

refresh();


const activate = (itersN, visualizeEveryN) => {
  

  itersN = itersN || 1;
  visualizeEveryN = visualizeEveryN || 0;

  for(let iter = 0; iter < itersN; iter++){

    setTimeout(() => {

      // clear network

      network.nodes.clearNet();
      //network.nodes.clearAct();

      // add some test activation
        for(let i = 0; i < 100; i++){
          //network.nodes.nodes[0].setNeuronAtIndex("net", i+iter%80, 1.0);
          //network.nodes.nodes[0].setNeuronAtIndex("net", i, 100.0);
          //network.nodes.nodes[0].setNeuronAtIndex("act", i, 1.0);
          network.nodes.nodes[0].setNeuronAtIndex("I", i, 1000.0);
        }
      //}

      
      // run network
      network.nodes.activate();

      
      if(visualizeEveryN > 0 && iter%visualizeEveryN === 0){
        const nv = networkStats.value.curNodeVariable;
        drawCanvas.value.renderNodeVariables( nv.name, nv.range[0], nv.range[1] );
      }

      networkStats.value.activationIter = network.nodes.activationIter;

    }, 5);
  }

  console.log(network.nodes.neurons);
  console.log(network);

}

const visualizeNodeVar = (nodeVar) => {
  const nv = { name: nodeVar.name, range: [nodeVar.range[0], nodeVar.range[1]] }
  networkStats.value.curNodeVariable = nv;
  drawCanvas.value.renderNodeVariables( nv.name, nv.range[0], nv.range[1] );
}



</script>

<style scoped>
.badge-sm {
    min-width: 1.8em;
    padding: .25em !important;
    margin-left: .1em;
    margin-right: .1em;
    color: white !important;
    cursor: pointer;
}
.badge-sm:hover {
  opacity: 0.85;
}
</style>
