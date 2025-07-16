import NextAuth from "next-auth"
import LinkedIn from "next-auth/providers/linkedin"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { Redis } from "@upstash/redis";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { cookies } from "next/headers";
import { createUser, getCompanyById, getUserByID, createCompany } from "./db";

const redisUrl = process.env.UPSTASH_REDIS_URL
const redisKey = process.env.UPSTASH_REDIS_TOKEN

if (!redisUrl || !redisKey) {
  throw new Error('Missing Redis Upstash environment variables');
}

const redis = new Redis({
  url: redisUrl,
  token: redisKey
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: UpstashRedisAdapter(redis),
  providers: [
    Resend({
      from: "Greenleaf Registration <noreply.greenleaf@corithos.com>",
    }),
    Google,
    LinkedIn,
  ],
  pages: {
    signIn: "/users/login",
    verifyRequest: "/"
  },
  callbacks: {
    async signIn({ user, profile }) {
        try {
            const cookieStore = await cookies();
            const userType = cookieStore.get('userType')?.value || 'user';
            
            // Check if account already exists of the other type
            if (userType === "user") {
                // Check if company exists
                try {
                    await getCompanyById(`user:${user.id}`);
                    return false;
                } catch {
                    // Company doesn't exist, continue
                }
            } else if (userType === "company") {
                // Check if user exists
                try {
                    await getUserByID(`company:${user.id} `);
                    return false;
                } catch {
                    // User doesn't exist, continue
                }
            }
            
            // Handle profiles in Supabase with prefixed ID
            const prefixedId = `${userType}:${user.id}`;
            
            if (userType === "user") {
                try {
                    await getUserByID(prefixedId);
                    // User exists, do nothing
                } catch {
                    // User doesn't exit, create it
                    const email = user?.email || profile?.email;
                    if (!email) {
                      await createUser({ id: prefixedId });
                    } else {
                      await createUser({ id: prefixedId, email: email });
                    }
                }
            } else if (userType === "company") {
                try {
                    await getCompanyById(prefixedId);
                    // Company exists, do nothing
                } catch {
                    // Company doesn't exist, create temporary database entry
                    await createCompany({ id: prefixedId, name: prefixedId });
                }
            }

            return true;
        } catch (error) {
            console.error('Error in signIn callback:', error);
            return true;
        }
    },
    async session({ session, user }) {
        try {
            let userType = 'company'; // default assumption
            // Check if user exists in users table first
            try {
                await getUserByID(`user:${user.id}`);
                userType = 'user';
            } catch {
                // User not found in users table, assume company
            }
            session.user.id = `${userType}:${user.id}`;
            return session;
        } catch (error) {
            console.error('Error in session callback:', error);
            return session;
        }
    },
  }
});
