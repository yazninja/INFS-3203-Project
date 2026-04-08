<template>
  <div>
    Redirecting you to Qatar Living...
  </div>
</template>

<script lang="ts" setup>
const $route = useRoute();
navigateTo(`https://www.qatarliving.com/en/vehicles/cars/${$route.params.id}`, {
  external: true
});
</script>

<style></style>