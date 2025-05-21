import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export const auth = () => NextAuth(authConfig);

// Tạo handler riêng cho route API
export const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
export const { signIn, signOut } = NextAuth(authConfig);
