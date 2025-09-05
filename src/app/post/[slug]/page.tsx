import { getPostBySlug, getCommentsByPostSlug } from "@/lib/actions";
import { getCurrentSession } from "@/lib/session";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Comments from "@/components/Comments";
import styles from "./page.module.css";

export default async function PostPage({ 
    params 
}: { 
    params: Promise<{ slug: string }> 
}) {
    const { slug } = await params;
    
    // Fetch the post data and comments in parallel
    const [post, comments, { user }] = await Promise.all([
        getPostBySlug(slug),
        getCommentsByPostSlug(slug),
        getCurrentSession()
    ]);
    
    if (!post) {
        notFound();
    }
    
    return (
        <div className={styles['post-content']}>
            <MarkdownRenderer content={post.content} />
            
            <Comments 
                postSlug={slug}
                initialComments={comments}
                isLoggedIn={!!user}
                currentUser={user}
            />
        </div>
    );
}
