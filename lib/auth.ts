import NextAuth from "next-auth"
import LinkedIn from "next-auth/providers/linkedin"
import Resend from "next-auth/providers/resend"
import { Redis } from "@upstash/redis";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";

const redisUrl = process.env.UPSTASH_REDIS_URL
const redisKey = process.env.UPSTASH_REDIS_TOKEN

if (!redisUrl || !redisKey) {
  throw new Error('Missing Redis Upstash environment variables');
}

const redis = new Redis({
  url: redisUrl,
  token: redisKey
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: UpstashRedisAdapter(redis),
  providers: [
    Resend({
      from: "Greenleaf Registration <noreply.greenleaf@corithos.com>"
    }),
    // TODO: Configure LinkedIn App
    LinkedIn,
  ],
  pages: {
    signIn: "/users/login",
    verifyRequest: "/"
  }
})