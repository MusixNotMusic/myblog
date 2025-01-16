
<script setup lang="ts">
import CanvasTemplate from "@/components/CanvasTemplate.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { Cube } from '@/lib/webgpu/cube'
const id = ref("cube");

let cube;

onMounted(() => {
  cube = new Cube(id.value);
  cube.init();
})

</script>

<template>
  <CanvasTemplate :id="id"></CanvasTemplate>
  </template>
