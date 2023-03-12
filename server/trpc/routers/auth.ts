import { TRPCError } from '@trpc/server';
import { genSalt, hash } from 'bcrypt';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

const signupSchema = z.object({
  username: z.string().trim(),
  password: z.string()
})

export const authRouter = router({
  signup: publicProcedure.input(signupSchema)
    .mutation(async ({ ctx: { prisma }, input }) => {
      const { username, password } = input;

      const userWithSameUsername = await prisma.user.findUnique({ where: { username } });

      if (userWithSameUsername !== null) {
        throw new TRPCError({
          message: 'Username already taken',
          code: 'CONFLICT'
        })
      }

      const hashedPassword = await hash(password, await genSalt())

      return await prisma.user.create({
        data: {
          username, password: hashedPassword
        }
      })
    })
})
