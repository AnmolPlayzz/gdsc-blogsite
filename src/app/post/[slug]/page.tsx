import { getPostBySlug } from "@/lib/actions";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import styles from "./page.module.css";

export default async function PostPage({ 
    params 
}: { 
    params: { slug: string } 
}) {
    const slug = params.slug;
    
    // Fetch the post data
    const post = await getPostBySlug(slug);
    
    if (!post) {
        notFound();
    }
    
    return (
        <div className={styles['post-content']}>
            <MarkdownRenderer content={post.content} />
        </div>
    );
}
