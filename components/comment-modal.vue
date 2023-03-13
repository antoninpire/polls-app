<template>
  <TransitionRoot appear :show="props.isOpen" as="template">
    <Dialog as="div" class="relative z-10" @close="props.onClose">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-secondary p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-2xl font-bold leading-6 text-white"
              >
                Add a Comment
              </DialogTitle>
              <form @submit.prevent="onCreateClick">
                <div class="mt-5 text-gray-400 flex flex-col gap-4">
                  <div class="relative">
                    <textarea v-model="form.data.value" placeholder="Add your comment here ..." class="px-3 py-3 bg-secondary w-full outline-none border rounded-lg border-gray-500 text-gray-200" maxlength="244" rows="5" />
                    <span class="text-gray-400 absolute top-2 right-2 text-xs">{{ form.data.value.length }}/244</span>
                  </div>
                </div>

                <div class="mt-6 flex items-center justify-center gap-3">
                  <Btn variant="default" class="font-semibold" @click.prevent="props.onClose">
                    Cancel
                  </Btn>
                  <Btn variant="default" class="font-semibold" :is-loading="form.pending">
                    Add
                  </Btn>
                </div>
                <div class="flex justify-center items-center">
                  <span v-if="form.error" class="text-red-500 mt-2 text-center font-semibold text-sm">{{ form.error }}</span>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
Dialog,
DialogPanel,
DialogTitle,
TransitionChild,
TransitionRoot,
} from '@headlessui/vue';

const { $client, $toast } = useNuxtApp()
const route = useRoute()

const { refresh } = $client.poll.getById.useQuery({ id: route.params.slug.toString() }, { lazy: true, immediate: false })

const props = defineProps<{
  isOpen: boolean,
  onClose:() => void
}>()

const initialState = {
  data: {
    value: ''
  },
  pending: false,
  error: ''
}

const form = reactive<typeof initialState>({
  ...initialState
})

async function onCreateClick () {
  try {
    form.error = '';
    form.pending = true;

    if (!form.data.value.length) {
      form.error = 'Please fill in a question';
      return;
    }

    await $client.pollComment.create.mutate({
      pollId: route.params.slug.toString(),
      value: form.data.value
    })

    // Reset form
    // Object.assign(form, initialState);
    form.data = {
      value: ''
    }
    form.pending = false
    form.error = ''
    props.onClose();

    $toast.success(`Comment added with success !`)

    refresh()
  } catch (error: any) {
    if (error.message) { form.error = error.message }
  } finally {
    form.pending = false;
  }
}

</script>
