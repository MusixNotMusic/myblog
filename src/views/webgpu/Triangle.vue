
<script setup lang="ts">
import CanvasTemplate from "@/components/CanvasTemplate.vue";
import { ref, onMounted } from "vue";
import { Triangle } from '@/lib/webgpu/triangle'
const id = ref("triangle");

let triangle;

onMounted(() => {
  triangle = new Triangle(id.value);
  triangle.init();
})

</script>

<template>
  <CanvasTemplate :id="id"></CanvasTemplate>
  </template>
