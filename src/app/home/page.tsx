import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { logout } from "@/lib/actions";
import styles from "./page.module.css";

export default async function HomePage() {
    const { user } = await getCurrentSession();
    console.log("Current User:", user);
    if (!user) {
        return redirect("/login");
    }

    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1>Welcome, {user.name}!</h1>
                    <p>Role: <span className={styles.role}>{user.role}</span></p>
                    <p>Email: {user.email}</p>
                </div>

                <div className={styles.userInfo}>
                    <h2>Dashboard</h2>
                    <p>You are successfully authenticated and logged in.</p>
                </div>

                <form action={logout} className={styles.logoutForm}>
                    <button type="submit" className={styles.logoutButton}>
                        Logout
                    </button>
                </form>
            </div>
        </div>
    );
}