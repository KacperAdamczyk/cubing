<script setup lang="ts">

const {data} = useAsyncData('algorithms', () => queryCollection('algorithms').all());
</script>
<template>
  <div>
    <NuxtRouteAnnouncer/>
    <NuxtWelcome/>
    {{ data }}
  </div>
</template>
