<script lang="ts" setup>
definePageMeta({
  middleware: 'public'
})

useHead({
  title: 'Polls App',
  meta: [{
    name: 'description',
    content: 'A simple polls app using Vue, Nuxt, TRPC and Tailwind'
  }]
})
</script>

<template>
  <div class="w-screen h-screen bg-slate-800 flex justify-center items-center">
    <div class="flex flex-col gap-4">
      <h1 class="text-5xl text-white">
        A Simple Poll App
      </h1>
      <div class="flex flex-col gap-2">
        <p class="text-white text-lg">
          Using Vue, Nuxt, TRPC and Tailwind.
        </p>
        <div class="flex items-center gap-3 font-semibold justify-center mt-6">
          <NuxtLink to="/signup">
            <button class="rounded-3xl px-4 py-2 bg-secondary text-gray-200 hover:bg-secondary/70">
              Create an Account
            </button>
          </NuxtLink>
          <NuxtLink to="/login">
            <button class="rounded-3xl px-4 py-2 bg-primary text-gray-700 hover:bg-primary/90">
              Login
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  h1 {
    font-family: 'climate';
  }
</style>
