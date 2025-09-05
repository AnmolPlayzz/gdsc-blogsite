import { Lucia } from "lucia";
import { NeonHTTPAdapter } from "@lucia-auth/adapter-postgresql";
import { cookies } from "next/headers";
import { cache } from "react";
import sql from "./db";

// Set up the adapter for Lucia
const adapter = new NeonHTTPAdapter(sql, {
    user: "users",
    session: "sessions"
});

// Initialize Lucia
export const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes: (attributes) => {
        return {
            id: attributes.id,
            google_id: attributes.google_id,
            name: attributes.name,
            email: attributes.email,
            role: attributes.role
        };
    }
});

// Declare module for TypeScript
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            id: string;
            google_id: string;
            name: string;
            email: string;
            role: "user";
        };
    }
}

// Delete session token cookie
export async function deleteSessionTokenCookie(): Promise<void> {
    const cookieStore = await cookies();
    const sessionCookie = lucia.createBlankSessionCookie();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}

// Invalidate session
export async function invalidateSession(sessionId: string): Promise<void> {
    await lucia.invalidateSession(sessionId);
}

// Get current session
export const getCurrentSession = cache(async () => {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;
    
    if (!sessionId) {
        return { session: null, user: null };
    }
    
    const result = await lucia.validateSession(sessionId);
    
    if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    
    if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    
    return result;
});