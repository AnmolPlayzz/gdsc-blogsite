import { deleteSessionTokenCookie, getCurrentSession, invalidateSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function POST() {
  const { session } = await getCurrentSession();
  
  if (session) {
    await invalidateSession(session.id);
  }
  
  await deleteSessionTokenCookie();
  
  return redirect("/login");
}
