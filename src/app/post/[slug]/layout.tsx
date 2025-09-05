import { getPostBySlug } from "@/lib/actions";
import { notFound } from "next/navigation";
import styles from "./layout.module.css";
export default async function PostLayout({ 
    children, 
    params 
}: { 
    children: React.ReactNode, 
    params: Promise<{ slug: string }> 
}) {
    const { slug } = await params;
    
    const post = await getPostBySlug(slug);
    
    if (!post) {
        notFound();
    }
    
    return (
        <div style={{
            marginTop: "18px",
            marginBottom: "40px"
        }}>
            <div className={styles.header}>
                <h1 className={styles.title}>{post.title}</h1>
                <div className={styles.meta}>
                    <div className={styles.authorSection}>
                        <div className={styles.avatar}>
                            {post.author.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.authorInfo}>
                            <p className={styles.authorName}>{post.author}</p>
                            <p className={styles.publishDate}>
                                {post.created_at.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    <p className={styles.category}>{post.category}</p>
                </div>
            </div>
            {children}
        </div>
    );
}
