<template>
  <div>
    <div>I'm protected! Session data: {{ data }}</div>
    <div>{{ hello.data.value?.greeting }}</div>
    <button class="rounded-xl shadow-xl p-2 m-2" @click="signOut()">
      sign out
    </button>
  </div>
</template>

<script setup lang="ts">
const { $client } = useNuxtApp()

definePageMeta({ middleware: 'protected' })

const { data, signOut } = useSession()

const hello = await $client.hello2.useQuery()

</script>
