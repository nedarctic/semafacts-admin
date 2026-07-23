import NextAuth, { type AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

function decodeExp(accessToken: string) {
    const token = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString());
    if (token.expires_in) {
        return Date.now() + token.expires_in * 1000
    }
    if (token.exp) {
        return token.exp * 1000;
    }
    throw new Error("No exporation field found in JWT")
}

async function refreshToken(refreshToken: string, oldToken: JWT) {
    const url = `${process.env.BACKEND_URL}/auth/refresh`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken })
    });

    if (!res.ok) {
        return null;
    }

    const { access_token, refresh_token } = await res.json();
    const expiresAt = decodeExp(access_token);

    if (isNaN(expiresAt)) {
        return null;
    }

    return {
        ...oldToken,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
    }
}

export const authOptions: AuthOptions = {
    providers: [

        // admin auth
        CredentialsProvider({
            id: "admin-access",
            name: "Admin Access",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials) {
                const email = credentials?.email;
                const password = credentials?.password;

                if (!email || !password) {
                    return null;
                }

                const url = `${process.env.BACKEND_URL}/auth/login`;
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!res.ok) {
                    return null;
                }

                const { access_token, refresh_token, user } = await res.json();

                const expiresAt = decodeExp(access_token);

                if (isNaN(expiresAt)) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    companyId: user.companyId,
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiresAt
                }
            }
        }),

        // handler auth
        CredentialsProvider({
            id: "handler-access",
            name: "Handler Access",
            credentials: {
                email: {label: "email", type: "text"},
                password: {label: "password", type: "text"}
            },
            async authorize (credentials) {
                const email = credentials?.email;
                const password = credentials?.password;

                if (!email || !password) {
                    return null;
                }

                const url = `${process.env.BACKEND_URL}/auth/login`;
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!res.ok) {
                    return null;
                }

                const { access_token, refresh_token, user } = await res.json();

                const expiresAt = decodeExp(access_token);

                if (isNaN(expiresAt)) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    companyId: user.companyId,
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiresAt
                }
            }
        }),

        // reporter auth
        CredentialsProvider({
            id: "reporter-access",
            name: "Reporter Access",
            credentials: {
                code: {label: "code", type: "text"},
                secretCode: {label: "secretCode", type: "text"}
            },
            async authorize (credentials) {
                const code = credentials?.code;
                const secretCode = credentials?.secretCode;

                console.log("CODE", code);
                console.log("SECRET CODE", secretCode)

                if (!code || !secretCode) {
                    return null;
                }

                const url = `${process.env.BACKEND_URL}/incident-auth/login`;
                console.log("BACKEND URL", url)
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code, secretCode })
                });

                if (!res.ok) {
                    return null;
                }

                const { accessToken, refreshToken, user, incidentId } = await res.json();

                const expiresAt = decodeExp(accessToken);

                if (isNaN(expiresAt)) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    companyId: user.companyId,
                    accessToken,
                    refreshToken,
                    expiresAt,
                    incidentId
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
                token.companyId = user.companyId;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.expiresAt = user.expiresAt;
                token.incidentId = user.incidentId;
            }

            if (token.expiresAt > Date.now()) {
                return token;
            }

            const refreshedToken = await refreshToken(token.refreshToken, token);
            return refreshedToken || token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.role = token.role;
                session.user.companyId = token.companyId;
                session.accessToken = token.accessToken;
                session.refreshToken = token.refreshToken;
                session.incidentId = token.incidentId;
            }

            return session;
        }
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt"
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };