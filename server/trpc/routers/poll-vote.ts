import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

const createPollVoteSchema = z.object({
    optionId: z.string().cuid()
})

export const pollVoteRouter = router({
    create: protectedProcedure.input(createPollVoteSchema)
        .mutation(async ({ ctx: { prisma, session: { user } }, input: { optionId } }) => {
            return await prisma.pollVote.create({
                data: {
                    optionId,
                    userId: user.id
                }
            })
        })
})
