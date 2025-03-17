<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-12 mt-4">
      <h1>Visualize</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <ActGraphs></ActGraphs>
    </div>
  </div>
  <div class="row">
    <div v-for="r in recs">
      <div class="col-12">
        <h3 class="text-primary mx-2">{{r.node.path}}</h3>
      </div>
      <div class="col-12" v-for="nodeVar in r.nodeVars">
        <h5>{{nodeVar}}</h5>
        <SpikePlot :node="r.node" :nodeVarName="nodeVar"></SpikePlot>
      </div>
      <hr>
    </div>
  </div>
</div>
</template>

<script setup>

import { ref, inject, onMounted } from 'vue'
import ActGraphs from "./../components/visualization/ActGraphs.vue";
import SpikePlot from "./../components/visualization/SpikePlot.vue";

const walnut = inject('walnut');

const recs = ref([]);

onMounted(() => {
  console.log("visualize walnut:", walnut);

  update();

});

const update = () => {
  if(!walnut.network){ return; } // nothing to see here

  const rs = [];
  // get all the nodes
  for(let i = 0; i < walnut.network.nodes.nodes.length; i++){
    const r = { 
      node: walnut.network.nodes.nodes[i], nodeVars: walnut.recordings.nodeVars
    }
    console.log("node rec:", r);
    rs.push(r);
  }
  recs.value = rs;

  console.log("recs:", recs);
}

defineExpose({update});

</script>

<style scoped>
</style>

