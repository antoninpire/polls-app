<template>
  <div class="border-gray-600 rounded p-3">
    <div class="flex items-center justify-between">
      <p class="font-semibold text-gray-200">
        @{{ props.username }}
      </p>
      <span class="text-gray-400 text-xs">
        {{ props.createdAt.toLocaleDateString() }} {{ props.createdAt.toLocaleTimeString() }}
      </span>
    </div>

    <p class="text-gray-400 text-sm mt-1">
      {{ props.comment }}
    </p>
  </div>
</template>

<script lang="ts" setup>
    const props = defineProps<{
        username: string;
        comment: string;
        createdAt: Date;
    }>()
</script>
