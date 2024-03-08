<script setup lang="ts">
const {data} = useFetch<{data: Record<string, {id:string}>}>('/products');
console.log(data.value);
</script>

<template>
  <div>
    Hello, I'm the app.
  </div>
</template>

<style>
html {
  background-color: white;
  font: var(--text-sm-regular);
}
</style>