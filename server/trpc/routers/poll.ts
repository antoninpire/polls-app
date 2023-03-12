import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

const createPollSchema = z.object({
    days: z.preprocess(val => Number(val), z.number().min(1).max(7)),
    hours: z.preprocess(val => Number(val), z.number().min(0).max(23)),
    minutes: z.preprocess(val => Number(val), z.number().min(0).max(59)),
    option1: z.string().max(25),
    option2: z.string().max(25),
    option3: z.string().max(25).optional(),
    option4: z.string().max(25).optional(),
    question: z.string()
})

export const pollRouter = router({
    create: protectedProcedure.input(createPollSchema)
        .mutation(async ({ ctx: { prisma, session: { user } }, input }) => {
            const endsAt = new Date();

            // Add days
            endsAt.setDate(endsAt.getDate() + input.days)

            // Add hours
            endsAt.setTime(endsAt.getTime() + (input.hours * 60 * 60 * 1000))

            // Add minutes
            endsAt.setTime(endsAt.getTime() + 1000 * input.minutes)

            const createPollOptionsInput: Prisma.PollOptionCreateManyPollInput[] = [
                {
                    value: input.option1
                },
                {
                    value: input.option2
                },
            ]

            if (input.option3?.length) { createPollOptionsInput.push({ value: input.option3 }) }
            if (input.option4?.length) { createPollOptionsInput.push({ value: input.option4 }) }

            return await prisma.poll.create({
                data: {
                    question: input.question,
                    user: {
                        connect: {
                            id: user.id
                        }
                    },
                    options: {
                        createMany: {
                            data: createPollOptionsInput
                        }
                    },
                    endsAt
                }
            })
        }),
        getAll: protectedProcedure.query(async ({ ctx: { prisma } }) => {
            const polls = await prisma.poll.findMany({
                include: {
                    _count: {
                         select: {
                            comments: true,
                         }
                    },
                    options: {
                        select: {
                            id: true,
                            value: true,
                            _count: {
                                select: {
                                     votes: true
                                }
                            },
                            votes: {
                                select: {
                                    userId: true,
                                    id: true
                                }
                            }
                        }
                    },
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

        const ret = polls.map(poll => ({
            ...poll,
            amountOfVotes: poll.options.reduce((count, option) => count + option._count.votes, 0)
        }))

        return ret;
        }),
})
