// auth.ts (Root papkada)
import NextAuth from "next-auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    {
      id: "enwis",
      name: "Enwis ID",
      type: "oauth",
      authorization: "http://127.0.0.1:8001/api/v1/oauth/authorize?scope=openid+profile+email",
      token: "http://127.0.0.1:8001/api/v1/oauth/token",
      userinfo: "http://127.0.0.1:8001/api/v1/oauth/userinfo",
      clientId: "enwis_next_client_id1",
      clientSecret: "12345678",
      profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: profile.roles?.[0] || "user",
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})