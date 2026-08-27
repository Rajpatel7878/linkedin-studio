import { NextAuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    newUser: '/onboarding',
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    // Credentials/Demo Provider for rapid login, testing, and sandbox environments
    CredentialsProvider({
      id: 'demo-login',
      name: 'Demo Account',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'alex@example.com' },
        name: { label: 'Name', type: 'text', placeholder: 'Alex Rivera' },
        plan: { label: 'Plan', type: 'text', placeholder: 'pro' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim() || 'alex@example.com';
        const name = credentials?.name?.trim() || 'Alex Rivera';
        const plan = credentials?.plan || 'pro';

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name,
              plan,
              image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          plan: user.plan,
        } as any;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const email = user.email;
        if (!email) return false;

        let dbUser = await prisma.user.findUnique({ where: { email } });
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email,
              name: user.name || 'New Creator',
              image: user.image,
              plan: 'free',
            },
          });
        }
        user.id = dbUser.id;
        (user as any).plan = dbUser.plan;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan || 'free';
      }

      if (trigger === 'update' && session?.plan) {
        token.plan = session.plan;
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { id: true, plan: true, role: true, stripeCustomerId: true },
        });
        if (dbUser) {
          token.plan = dbUser.plan;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).plan = (token.plan as string) || 'free';
        (session.user as any).role = (token.role as string) || 'USER';
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev_super_secret_jwt_key_for_saas_app_2026',
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    // Fallback to demo user if no session is set in dev mode
    const fallbackUser = await prisma.user.findFirst({
      where: { email: 'alex@example.com' },
    });
    return fallbackUser || null;
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { linkedInAccount: true },
  });

  return user;
}
