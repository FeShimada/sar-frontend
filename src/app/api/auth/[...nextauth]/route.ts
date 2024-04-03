import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from "next-auth/jwt";

async function refreshToken(token: JWT): Promise<JWT> {
    const res = await fetch("http://localhost:8000" + "/auth/refresh", {
        method: "POST",
        headers: {
            authorization: `Refresh ${token.backendTokens.refreshToken}`,
        },
    });

    const response = await res.json();

    return {
        ...token,
        backendTokens: response,
    };
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials.password) return null
                const { email, password } = credentials
                const res = await fetch("http://localhost:8000/auth/login", {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        password
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                if (res.status === 401) {
                    return null
                }
                const user = await res.json()
                return user
            }
        })
    ],
    pages: {
        signIn: '/'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) return { ...token, ...user };
            if (new Date().getTime() < token.backendTokens.expiresIn) return token

            return await refreshToken(token);
        },
        async session({ token, session }) {
            session.user = token.user;
            session.backendTokens = token.backendTokens;

            return session;
        },
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
