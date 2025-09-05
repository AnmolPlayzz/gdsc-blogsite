import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  return <div>
    <h1>
      Welcome to NXBlogs!
    </h1>
  </div>

}
