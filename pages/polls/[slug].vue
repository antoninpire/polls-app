<script lang="ts" setup>
import Btn from '../../components/btn.vue';
import CommentModal from '../../components/comment-modal.vue';
import Comment from '../../components/comment.vue';
import PollById from '../../components/poll-by-id.vue';

definePageMeta({
  middleware: 'protected',
  layout: 'polls',
})

useHead({
  title: 'Polls App - Poll',
  meta: [{
    name: 'description',
    content: 'Poll page including votes & comments'
  }]
})

defineComponent({
  PollById,
  Btn,
  Comment,
  CommentModal
})

const { $client } = useNuxtApp();
const route = useRoute()
const { data: session } = useSession();

type Store = {
  isOpen: boolean,
}

const store = reactive<Store>({
  isOpen: false,
})

const onClose = () => {
  store.isOpen = false;
}
const onOpen = () => {
  store.isOpen = true
}

const { pending, data: poll } = $client.poll.getById.useQuery({ id: route.params.slug.toString() })

</script>

<template>
  <div class="bg-background w-screen min-h-screen pt-20 pb-6">
    <div class="pt-10 px-[25%] flex flex-col">
      <div class="flex items-center flex-col gap-5 pt-10">
        <div v-if="pending" class="text-white">
          Loading...
        </div>
        <div v-else class="flex flex-col">
          <PollById :poll="poll!" :current-user-has-voted="(poll?.options?.some(option => option.votes.some(vote => vote.userId === session?.user?.id)) ?? false)" />
          <div class="mt-16 flex items-center justify-between border-b border-gray-700 pb-3">
            <h3 class="text-white font-semibold text-xl">
              Comments ({{ poll?._count?.comments ?? 0 }})
            </h3>
            <Btn @click="onOpen()">
              Add Comment
            </Btn>
          </div>
          <div class="flex flex-col py-4 gap-3">
            <div v-for="comment in poll?.comments" :key="comment.id">
              <Comment :comment="comment.value" :username="comment.user.username" :created-at="comment.createdAt" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <CommentModal :is-open="store.isOpen" :on-close="onClose" />
  </div>
</template>
