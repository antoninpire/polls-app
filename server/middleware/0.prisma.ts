import { PrismaClient } from '@prisma/client'
import { prisma } from '../lib/prisma'

// let prisma: PrismaClient

declare module 'h3' {
  interface H3EventContext {
    prisma: PrismaClient,
  }
}

export default eventHandler((event) => {
  // if (!prisma) {
  //   prisma = new PrismaClient()
  // }
  // const { data } = useSession()
  // event.context.user = data?.value?.user
  event.context.prisma = prisma
})
