import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
  }
  
// Create a singleton PrismaClient instance
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to preserve the PrismaClient instance
  // across hot reloads
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

export { prisma };