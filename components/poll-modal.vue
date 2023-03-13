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
                Create a Poll
              </DialogTitle>
              <form @submit.prevent="onCreateClick">
                <div class="mt-5 text-gray-400 flex flex-col gap-4">
                  <div class="relative">
                    <textarea v-model="form.data.question" placeholder="Ask your question here ..." class="px-3 py-3 bg-secondary w-full outline-none border rounded-lg border-gray-500 text-gray-200" maxlength="244" rows="5" />
                    <span class="text-gray-400 absolute top-2 right-2 text-xs">{{ form.data.question.length }}/244</span>
                  </div>
                  <div class="relative">
                    <input v-model="form.data.option1" maxlength="25" type="text" placeholder="Option 1" class="px-3 py-3 text-lg bg-secondary w-full outline-none border rounded-lg border-gray-500 text-gray-200">
                    <span class="text-gray-400 absolute top-2 right-2 text-xs">{{ form.data.option1.length }}/25</span>
                  </div>
                  <div class="relative">
                    <input v-model="form.data.option2" maxlength="25" type="text" placeholder="Option 2" class="px-3 py-3 text-lg bg-secondary w-full outline-none border rounded-lg border-gray-500 text-gray-200">
                    <span class="text-gray-400 absolute top-2 right-2 text-xs">{{ form.data.option2.length }}/25</span>
                  </div>
                  <div v-if="form.amountOfOptionsToShow === 2" class="flex items-center justify-center text-primary p-1 rounded hover:cursor-pointer hover:bg-transparent/5">
                    <span class="font-semibold" @click="form.amountOfOptionsToShow = 3">Add An Option</span>
                  </div>
                  <div v-if="form.amountOfOptionsToShow >= 3" class="relative">
                    <input v-model="form.data.option3" maxlength="25" type="text" placeholder="Option 3 (optional)" class="px-3 py-3 text-lg bg-secondary w-full outline-none border rounded-lg border-gray-500 text-gray-200">
                    <span class="text-gray-400 absolute top-2 right-2 text-xs">{{ form.data.option3.length }}/25</span>
                  </div>
                  <div v-if="form.amountOfOptionsToShow === 3" class="flex items-center justify-center text-primary p-1 rounded hover:cursor-pointer hover:bg-transparent/5">
                    <span class="font-semibold" @click="form.amountOfOptionsToShow = 4">Add An Option</span>
                  </div>
                  <div v-if="form.amountOfOptionsToShow >= 4" class="relative">
                    <input v-model="form.data.option4" maxlength="25" type="text" placeholder="Option 4 (optional)" class="px-3 py-3 text-lg bg-secondary w-full outline-none border rounded-lg border-gray-500 text-gray-200">
                    <span class="text-gray-400 absolute top-2 right-2 text-xs">{{ form.data.option4.length }}/25</span>
                  </div>
                </div>

                <div class="mt-5 flex flex-col gap-2">
                  <span class="text-white">Poll Duration</span>
                  <div class="flex items-center justify-between gap-6">
                    <fieldset class="flex flex-col gap-1 w-full">
                      <span class="text-sm text-gray-200">Days</span>
                      <select v-model="form.data.days" class="bg-transparent text-gray-400 border border-gray-500 rounded-lg text-lg py-3 px-2 outline-none">
                        <option v-for="n in 7" :key="n" :value="n">
                          {{ n }}
                        </option>
                      </select>
                    </fieldset>

                    <fieldset class="flex flex-col gap-1 w-full">
                      <span class="text-sm text-gray-200">Hours</span>
                      <select v-model="form.data.hours" class="bg-transparent text-gray-400 border border-gray-500 rounded-lg text-lg py-3 px-2 outline-none">
                        <option v-for="(n, index) in 24" :key="index" :value="index">
                          {{ index }}
                        </option>
                      </select>
                    </fieldset>

                    <fieldset class="flex flex-col gap-1 w-full">
                      <span class="text-sm text-gray-200">Minutes</span>
                      <select v-model="form.data.minutes" class="bg-transparent text-gray-400 border border-gray-500 rounded-lg text-lg py-3 px-2 outline-none">
                        <option v-for="(n, index) in 60" :key="index" :value="index">
                          {{ index }}
                        </option>
                      </select>
                    </fieldset>
                  </div>
                </div>

                <div class="mt-6 flex items-center justify-center gap-3">
                  <Btn variant="default" class="font-semibold" @click.prevent="props.onClose">
                    Cancel
                  </Btn>
                  <Btn variant="default" class="font-semibold" :is-loading="form.pending">
                    Create
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

const { refresh } = $client.poll.getAll.useQuery(undefined, { lazy: true, immediate: false })

const props = defineProps<{isOpen: boolean, onClose:() => void}>()

const initialState = {
  data: {
    days: '1',
    hours: '0',
    minutes: '0',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    question: '',
  },
  amountOfOptionsToShow: 2,
  pending: false,
  error: ''
}

const form = reactive({
  ...initialState
})

async function onCreateClick () {
  try {
    form.error = '';
    form.pending = true;

    if (!form.data.question.length) {
      form.error = 'Please fill in a question';
      return;
    }

    if (!form.data.option1.length || !form.data.option2.length) {
      form.error = 'Please fill at least 2 options';
      return;
    }

    await $client.poll.create.mutate({
      ...form.data
    });
    // Reset form
    form.amountOfOptionsToShow = 2;
    form.pending = false;
    form.error = '';
    form.data = {
      days: '1',
      hours: '0',
      minutes: '0',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      question: '',
    }
    props.onClose();

    $toast.success(`Poll created with success !`)

    refresh()
  } catch (error: any) {
    if (error.message) { form.error = error.message }
  } finally {
    form.pending = false;
  }
}

</script>
