import credentials from "next-auth/providers/credentials";
import type { NextAuthOptions, Session, TokenSet } from "next-auth";
import { verifyToken, customToken, customVerify } from "./jwt";
import type { JWT } from "next-auth/jwt";
import type { CustomSession } from "@/interfaces/global";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    credentials({
      name: "Credentials",
      credentials: {
        access_token: {
          placeholder: "access_token",
          type: "access_token",
          label: "access_token",
        },
      },
      async authorize(credentials) {
        try {
          const { id, role } = verifyToken(credentials?.access_token);

          return {
            id,
            name: "user",
            access_token: credentials?.access_token,
            role,
          };
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  jwt: {
    decode({ secret, token }) {
      return customVerify(token, secret) as JWT;
    },
    encode({ secret, token }) {
      return customToken(token as JWT, secret);
    },
  },
  callbacks: {
    session({
      session,
      token,
    }: {
      session: Session | CustomSession | any;
      token: TokenSet;
    }) {
      session.user.id = token.id;
      session.user.access_token = token.access_token;
      session.user.role = token.role;

      return session;
    },
    jwt({
      token,
      user,
      account,
    }: {
      token: JWT | any;
      user?: any;
      account?: any;
    }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      if (account) {
        token.access_token = user?.access_token;
      }
      return token;
    },
  },
};
