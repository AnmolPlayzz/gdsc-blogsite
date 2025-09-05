"use server";

import { getCurrentSession, invalidateSession, lucia } from "@/lib/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function logout() {
    const { session } = await getCurrentSession();
    if (session) {
        await invalidateSession(session.id);
    }

    const sessionCookie = lucia.createBlankSessionCookie();
    const cookieStore = await cookies();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    
    redirect("/login");
}