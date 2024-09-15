import NextAuth, {AuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const prisma = new PrismaClient();

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn(params) {
      const {user, account} = params;
      if (!account || !user) {
        return false;
      }
      if (account.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });

        if (!existingUser) {
            return false;
        }
        return true;
      }
      return false;
    },
    // async session({ session }) {
    //   // Attach user status to the session object
    //   const dbUser = await prisma.user.findUnique({
    //     where: { email: session.user!.email! }
    //   });

    //   return session;
    // }
  }
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);