<script lang="ts" setup>
// eslint-disable-next-line import/order
import { RouterOutputs } from '~~/server/trpc/routers';
import Btn from '../../components/btn.vue';
import Modal from '../../components/modal.vue';

const { $client } = useNuxtApp()

const { data: session } = useSession()

definePageMeta({
  middleware: 'protected',
  layout: 'polls'
})

defineComponent({
  Btn,
  Modal
})

type Store = {
  isOpen: boolean,
  searchQuery: string,
  filter: 'complete' | 'ongoing' | 'yours'
}

const store = reactive<Store>({
  isOpen: false,
  searchQuery: '',
  filter: 'ongoing'
})

const onClose = () => {
  store.isOpen = false;
}
const onOpen = () => {
  store.isOpen = true
}

const { data: allPolls, pending } = await $client.poll.getAll.useQuery();

const now = new Date();

const votedPolls = computed(() => allPolls.value?.filter(poll => poll.options?.some(option => option.votes.some(vote => vote.userId === session.value?.user?.id))))

const polls = computed(() => {
  const matchesSearchQuery = (poll: RouterOutputs['poll']['getAll'][number]) => {
    if (!store.searchQuery) { return true; }
    const query = store.searchQuery.toLowerCase();
    return poll.question.toLowerCase().includes(query) || poll.options.some(option => option.value.toLowerCase().includes(query))
  }

  if (store.filter === 'complete') { return allPolls.value?.filter(poll => poll.endsAt.getTime() < now.getTime() && matchesSearchQuery(poll)) } else if (store.filter === 'ongoing') { return allPolls.value?.filter(poll => poll.endsAt.getTime() >= now.getTime() && matchesSearchQuery(poll)) } else if (store.filter === 'yours') { return allPolls.value?.filter(poll => poll.userId === session.value?.user?.id && matchesSearchQuery(poll)) }

  return allPolls.value?.filter(poll => matchesSearchQuery(poll))
})

</script>

<template>
  <div class="bg-background w-screen min-h-screen pt-20 pb-6">
    <div class="pt-10 px-[25%] flex flex-col">
      <div class="flex items-center justify-between">
        <input v-model="store.searchQuery" type="search" class="bg-secondary outline-none border-gray-400 rounded-3xl px-4 py-2 text-lg min-w-[25rem] text-white" placeholder="Search through polls ...">
        <div class="flex gap-10">
          <div class="flex gap-1">
            <button :class="store.filter === 'ongoing' ? 'border-primary text-primary' : 'border-gray-400 text-gray-400'" class="text-sm py-2 px-2 rounded border-2 font-semibold" @click="store.filter = 'ongoing'">
              ONGOING
            </button>
            <button :class="store.filter === 'complete' ? 'border-primary text-primary' : 'border-gray-400 text-gray-400'" class="text-sm py-2 px-2 rounded border-2  font-semibold" @click="store.filter = 'complete'">
              COMPLETE
            </button>
            <button :class="store.filter === 'yours' ? 'border-primary text-primary' : 'border-gray-400 text-gray-400'" class="text-sm py-2 px-2 rounded border-2  font-semibold" @click="store.filter = 'yours'">
              YOURS
            </button>
          </div>
          <Btn @click="onOpen()">
            Create
          </Btn>
        </div>
      </div>
      <div v-if="pending">
        Loading ...
      </div>
      <div v-else class="flex items-center flex-col gap-5 pt-10">
        <div v-for="poll in polls" :key="poll.id">
          <!-- <p v-if="votedPolls?.find(p => p.id === poll.id) || poll.endsAt.getTime() < now.getTime()" class="font-semibold text-gray-400 text-xs mb-2">
            {{ poll.amountOfVotes }} votes
          </p>
          <p v-else class="font-semibold text-gray-400 mb-2 text-xs">
            Ends on {{ poll.endsAt.toLocaleDateString() }} at {{ poll.endsAt.toLocaleTimeString() }}
          </p>
          <h4 class="text-white font-semibold text-lg">
            {{ poll.question }}
          </h4>
          <div v-if="votedPolls?.find(p => p.id === poll.id) || poll.endsAt.getTime() < now.getTime()" class="flex flex-col px-4 py-4 gap-2">
            <div v-for="option in poll.options" :key="option.id" class="bg-gray-700 rounded-lg p-2 text-gray-200 hover:cursor-pointer hover:bg-gray-700/80 justify-between flex">
              <p>{{ option.value }}</p>
              <p class="text-sm">
                {{ Math.round(option._count.votes * 100 / poll.amountOfVotes) }}% ({{ option._count.votes }} vote(s))
              </p>
            </div>
          </div>
          <div v-else class="flex flex-col px-4 pt-4 pb-1 gap-2">
            <div v-for="option in poll.options" :key="option.id" class="rounded-lg text-gray-200 flex items-center gap-2">
              <input :id="`option-${option.id}`" :name="poll.id" type="radio">
              <label :for="`option-${option.id}`">{{ option.value }}</label>
            </div>
            <div class="flex items-center justify-center">
              <Btn>Vote</Btn>
            </div>
          </div> -->
          <Poll :current-user-has-voted="!!votedPolls?.find(p => p.id === poll.id)" :poll="poll" />
        </div>
      </div>
    </div>

    <Modal title="Create a Poll" :is-open="store.isOpen" :on-close="onClose" />
  </div>
</template>
