<template>

<div class="draggable"
  :style="{
    width: drag.w+'px',
    height: drag.h+'px',
    left: drag.x+'px',
    top: drag.y+'px'
  }"
>

</div>

</template>

<script setup>
import { ref, defineProps } from 'vue'

import { Drag } from './drag.js'

defineProps(["drag"]);

</script>


<style scoped>
.draggable{
  position: absolute;
  background: lightgray;
}

</style>


