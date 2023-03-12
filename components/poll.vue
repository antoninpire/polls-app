<template>
  <div class="w-[27rem] border border-gray-600 px-3 py-2 rounded">
    <p v-if="hasVoted" class="font-semibold text-gray-400 text-xs mb-2">
      {{ poll.amountOfVotes }} votes
    </p>
    <p v-else class="font-semibold text-gray-400 mb-2 text-xs">
      Ends on {{ poll.endsAt.toLocaleDateString() }} at {{ props.poll.endsAt.toLocaleTimeString() }}
    </p>
    <h4 class="text-white font-semibold text-lg">
      {{ poll.question }}
    </h4>
    <div v-if="hasVoted || props.poll.endsAt.getTime() < now.getTime()" class="flex flex-col px-4 py-4 gap-2">
      <div v-for="option in poll.options" :key="option.id" class="relative overflow-hidden rounded-lg p-2 text-gray-200 justify-between flex">
        <div class="absolute top-0 left-0 w-full h-full bg-gray-700" :style="`width: ${Math.round(option._count.votes * 100 / poll.amountOfVotes)}%;`" />

        <p class="z-10">
          {{ option.value }}
        </p>
        <p class="text-sm z-10">
          {{ Math.round(option._count.votes * 100 / poll.amountOfVotes) }}% ({{ option._count.votes }} vote(s))
        </p>
      </div>
    </div>
    <div v-else class="flex flex-col px-4 pt-4 pb-1 gap-2">
      <div v-for="option in poll.options" :key="option.id" class="rounded-lg text-gray-200 flex items-center gap-2">
        <input :id="`option-${option.id}`" v-model="selectedOption" :name="poll.id" type="radio" :value="option.id">
        <label :for="`option-${option.id}`">{{ option.value }}</label>
      </div>
      <div class="flex items-center justify-center">
        <Btn :disabled="selectedOption === undefined" :is-loading="pending" @click="onClickVote()">
          Vote
        </Btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import { type RouterOutputs } from '~~/server/trpc/routers';

    const { $client, $toast } = useNuxtApp()

    const props = defineProps<{
        currentUserHasVoted: boolean,
        poll: RouterOutputs['poll']['getAll'][number]
    }>()

    const hasVoted = ref(props.currentUserHasVoted)
    const poll = ref<RouterOutputs['poll']['getAll'][number]>(props.poll)

    const now = new Date();

    const selectedOption = ref<string | undefined>();
    const pending = ref(false);

    const onClickVote = async () => {
        if (selectedOption.value === undefined) {
            $toast.error('Please select an option')
            return;
        }

        pending.value = true;
        try {
          const vote = await $client.pollVote.create.mutate({
            optionId: selectedOption.value
        })
        hasVoted.value = true;
        poll.value = {
          ...poll.value,
          amountOfVotes: poll.value.amountOfVotes + 1,
          options: [...poll.value.options.map((option) => {
            if (option.id === selectedOption.value) {
              option._count.votes = option._count.votes + 1
              option.votes.push(vote)
            }

            return option
          })]
        }
        } catch {}
    }
</script>
