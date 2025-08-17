<script setup lang="ts">
import {db, usersTable} from 'db'

const users = useAsyncData('users', () => db.select().from(usersTable))

effect(() => {
  console.log('users', users.data)
})
</script>
<template>
  <div>
    <NuxtRouteAnnouncer/>
    <NuxtWelcome/>
  </div>
</template>
