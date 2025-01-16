
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { init } from '@/lib/threejs/earth'
import { getTotalCloudCover } from '@/services/tcc'

onMounted(() => {
  init();

  getTotalCloudCover();
})

</script>

<template>
</template>
<style>
body {
  background: #000;
}
</style>
