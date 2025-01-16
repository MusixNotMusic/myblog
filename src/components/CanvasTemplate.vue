<template>
 <canvas :id="id" :width="width" :height="height"></canvas>
</template>
<script>
export default { 
  props: {
    id: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 500
    }
  }
}
</script>

<style scoped>
  canvas {
    width: 100%;
    height: 100%;
    border: 1px solid black;
  }
</style>
