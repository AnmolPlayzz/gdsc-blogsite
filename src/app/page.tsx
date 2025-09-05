import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();
  
  if (user) {
    return redirect("/home");
  }
  
  return redirect("/login");
}
