"use client";

import { useState, useTransition } from "react";
import { createComment, type Comment } from "@/lib/actions";
import styles from "./Comments.module.css";

interface CommentsProps {
    postSlug: string;
    initialComments: Comment[];
    isLoggedIn: boolean;
    currentUser?: {
        id: string;
        name: string;
        email: string;
    } | null;
}

export default function Comments({ 
    postSlug, 
    initialComments, 
    isLoggedIn, 
    currentUser 
}: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState("");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newComment.trim()) {
            setError("Please enter a comment");
            return;
        }

        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append("content", newComment.trim());
        formData.append("postSlug", postSlug);

        startTransition(async () => {
            try {
                await createComment(formData);
                
                // Add the new comment to the local state for immediate UI update
                const optimisticComment: Comment = {
                    id: Date.now(), // Temporary ID
                    author: currentUser?.id || "",
                    author_name: currentUser?.name || "You",
                    content: newComment.trim(),
                    post_id: postSlug,
                    created_at: new Date()
                };
                
                setComments(prev => [...prev, optimisticComment]);
                setNewComment("");
                setSuccess("Comment added successfully!");
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Failed to add comment");
            }
        });
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className={styles.commentsSection}>
            <h3 className={styles.commentsTitle}>
                Comments ({comments.length})
            </h3>

            {/* Comment Form - Only show if logged in */}
            {isLoggedIn ? (
                <form onSubmit={handleSubmit} className={styles.commentForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="comment" className={styles.label}>
                            Add a comment:
                        </label>
                        <textarea
                            id="comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className={styles.textarea}
                            rows={4}
                            disabled={isPending}
                            required
                        />
                    </div>
                    
                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className={styles.success}>
                            {success}
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        disabled={isPending || !newComment.trim()}
                        className={styles.submitButton}
                    >
                        {isPending ? "Posting..." : "Post Comment"}
                    </button>
                </form>
            ) : (
                <div className={styles.loginPrompt}>
                    <p>Please <a href="/login" className={styles.loginLink}>log in</a> to leave a comment.</p>
                </div>
            )}

            {/* Comments List */}
            <div className={styles.commentsList}>
                {comments.length === 0 ? (
                    <p className={styles.noComments}>
                        No comments yet. Be the first to share your thoughts!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <span className={styles.authorName}>
                                    {comment.author_name}
                                </span>
                                <span className={styles.commentDate}>
                                    {formatDate(comment.created_at)}
                                </span>
                            </div>
                            <div className={styles.commentContent}>
                                {comment.content}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
