import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from "@/app/utils/prisma";


const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',   // Custom sign-in page
    signOut: '/auth/signout', // Custom sign-out page
    error: '/auth/error',     // Custom error page
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },


    async redirect({ url, baseUrl }) {
      if (url === '/api/auth/callback/google') {
        return `${baseUrl}/manage`;
      }
      return baseUrl;
    },
  },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);