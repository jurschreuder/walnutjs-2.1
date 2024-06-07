<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-12">
      <h1>Draw</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <DrawCanvas></DrawCanvas>
    </div>
  </div>
</div>
</template>

<script setup>

import { ref } from 'vue'

import DrawCanvas from "./../components/draw/DrawCanvas.vue";

</script>
