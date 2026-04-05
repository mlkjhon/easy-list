import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt", // needed for CredentialsProvider
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email e Senha",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Return the user object with additional fields
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          plan: user.plan, // Include plan
          role: user.role, // Include role
          status: user.status, // Include status
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // The 'user' object here comes from the adapter (for OAuth) or the authorize function (for Credentials).
        // With PrismaAdapter, the 'user' object will be the full User model from the database.
        // So, we can directly assign its properties to the token.
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        (token as any).plan = (user as any).plan;
        (token as any).role = (user as any).role;
        (token as any).status = (user as any).status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id;
        (session.user as any).name = token.name;
        (session.user as any).email = token.email;
        (session.user as any).image = token.image;
        (session.user as any).plan = (token as any).plan;
        (session.user as any).role = (token as any).role;
        (session.user as any).status = (token as any).status;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_build",
};
