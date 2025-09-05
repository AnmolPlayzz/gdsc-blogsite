import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default async function LoginPage() {
    const { user } = await getCurrentSession();
    if (user) {
        return redirect("/home");
    }

    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <h1 style={{
                    fontSize: "2rem",
                    fontWeight: "800"
                }}>Sign in</h1>
                <p>Sign in to your account</p>
                <a className={styles.loginButton} href="/login/google">
                    Sign in with Google
                </a>
            </div>
        </div>
    );
}