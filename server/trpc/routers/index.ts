import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { router } from '../trpc';
import { authRouter } from './auth';
import { pollRouter } from './poll';
import { pollCommentRouter } from './poll-comment';
import { pollVoteRouter } from './poll-vote';

export const appRouter = router({
  auth: authRouter,
  poll: pollRouter,
  pollVote: pollVoteRouter,
  pollComment: pollCommentRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
