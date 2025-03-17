<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { provide } from "vue";

let walnut = {
  network: false,
  recordings: {}
}
provide("walnut", walnut);

</script>

<style scoped>
</style>
