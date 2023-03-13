<script lang="ts" setup>
const { signOut } = useSession()
</script>

<template>
  <nav class="fixed top-0 left-0 w-screen px-5 flex items-center justify-between bg-transparent/10 h-20">
    <div />
    <NuxtLink to="/polls">
      <h3 class="text-white text-2xl font-bold">
        Polls App
      </h3>
    </NuxtLink>
    <Btn variant="default" @click="signOut()">
      Logout
    </Btn>
  </nav>
</template>
