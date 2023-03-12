<script lang="ts" setup>
definePageMeta({
  middleware: 'protected'
})

const { signOut } = useSession();
</script>

<template>
  <div>
    <div>Polls Page</div>
    <button class="rounded-xl shadow-xl p-2 m-2" @click="signOut()">
      sign out
    </button>
  </div>
</template>
