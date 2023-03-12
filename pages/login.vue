<script lang="ts" setup>
definePageMeta({
  middleware: 'public'
})

const { signIn } = useSession()

const form = reactive({
  data: {
    username: "",
    password: "",
  },
  error: false,
  pending: false,
});
async function onLoginClick () {
  try {
    form.error = false;
    form.pending = true;
    // await login(form.data.email, form.data.password, form.data.rememberMe)
    await signIn('credentials', {
      callbackUrl: '/polls',
      username: form.data.username,
      password: form.data.password
    })
  } catch (error) {
    form.error = true;
  } finally {
    form.pending = false;
  }
}
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center bg-background">
    <div class="rounded p-6 flex flex-col gap-2 border-gray-600 border-[0.25px]">
      <h3 class="text-2xl font-semibold text-white">
        Login
      </h3>
      <form id="login-form" class="flex flex-col gap-2 text-white" @submit.prevent="onLoginClick">
        <fieldset class="flex flex-col">
          <label for="username" class="text-gray-400 font-light text-sm mb-1">Username</label>
          <input id="username" v-model="form.data.username" type="text" placeholder="Username" class="px-3 py-1 bg-secondary rounded outline-none border-none min-w-[18rem]">
        </fieldset>
        <fieldset class="flex flex-col">
          <label for="password" class="text-gray-400 font-light text-sm mb-1">Password</label>
          <input id="password" v-model="form.data.password" type="password" placeholder="Password" class="px-3 py-1 bg-secondary rounded outline-none border-none">
        </fieldset>
      </form>
      <span v-if="form.error" class="text-red-500 text-sm text-center">An error occured while logging in.</span>
      <div class="flex justify-center items-center mt-3">
        <button form="login-form" :disabled="form.pending" type="submit" class="rounded-3xl px-4 py-2 bg-primary text-text hover:bg-primary/90">
          {{ form.pending ? 'Loading...' : 'Login' }}
        </button>
      </div>
    </div>
  </div>
</template>
