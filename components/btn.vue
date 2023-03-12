<script lang="ts" setup>

const props = defineProps({
  variant: {
    type: String,
    validators: (value: string) => ['default', 'outline'].includes(value),
    required: false,
    default: 'default',
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false
  },
  onClick: {
    type: Function,
    required: false,
    default: () => {}
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
})

const defaultClass = "rounded-3xl px-4 py-2"

const classes = reactive<{[key: string]: string}>({
  default: 'bg-primary text-gray-700 hover:bg-primary/90',
  secondary: 'bg-secondary text-gray-200 hover:bg-secondary/70',
})

const selectedClass = computed(() => props.variant in classes ? classes[props.variant] : classes.default)
</script>

<template>
  <button :class="`${defaultClass} ${selectedClass}`" :disabled="props.isLoading || props.disabled" @click="props.onClick">
    <slot v-if="props.isLoading === false" />
    <span v-else>Loading...</span>
  </button>
</template>
