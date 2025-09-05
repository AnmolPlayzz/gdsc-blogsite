import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getCategories } from "@/lib/actions";
import CreatePostForm from "./CreatePostForm";

import styles from "./page.module.css";

export default async function CreatePage() {

    const { user } = await getCurrentSession();
    console.log("Current User:", user);
    if (!user) {
        return redirect("/login");
    }

    // Fetch categories for the dropdown
    const categories = await getCategories();
    
    return (
        <div className={styles.container}>
            <CreatePostForm categories={categories} />
        </div>
    );
}