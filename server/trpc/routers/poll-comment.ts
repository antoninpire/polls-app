import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

const createPollCommentSchema = z.object({
    pollId: z.string().cuid(),
    value: z.string().max(244)
})

export const pollCommentRouter = router({
    create: protectedProcedure.input(createPollCommentSchema)
        .mutation(async ({ ctx: { prisma, session: { user } }, input: { pollId, value } }) => {
            return await prisma.pollComment.create({
                data: {
                    userId: user.id,
                    value,
                    pollId
                }
            })
        }),
})
