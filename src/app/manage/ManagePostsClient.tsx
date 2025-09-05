"use client";

import { useState } from 'react';
import Link from 'next/link';
import { PostSummary, Category, deletePost, updatePost } from '@/lib/actions';
import styles from './page.module.css';

interface ManagePostsClientProps {
    initialPosts: PostSummary[];
    categories: Category[];
    userName: string;
}

interface EditingPost {
    id: number;
    title: string;
    content: string;
    category: string;
}

export default function ManagePostsClient({ initialPosts, categories, userName }: ManagePostsClientProps) {
    const [posts, setPosts] = useState<PostSummary[]>(initialPosts);
    const [editingPost, setEditingPost] = useState<EditingPost | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDeletePost = async (postId: number) => {
        if (deleteConfirm !== postId) {
            setDeleteConfirm(postId);
            setTimeout(() => setDeleteConfirm(null), 3000); // Reset after 3 seconds
            return;
        }

        setLoading(true);
        try {
            await deletePost(postId);
            setPosts(posts.filter(post => post.id !== postId));
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditPost = async (post: PostSummary) => {
        setLoading(true);
        try {
            // Fetch the full post content
            const response = await fetch(`/api/posts/details?id=${post.id}`);
            if (response.ok) {
                const data = await response.json();
                setEditingPost({
                    id: data.post.id,
                    title: data.post.title,
                    content: data.post.content,
                    category: data.post.category
                });
            } else {
                throw new Error('Failed to fetch post details');
            }
        } catch (error) {
            console.error('Error fetching post details:', error);
            alert('Failed to load post details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPost) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('postId', editingPost.id.toString());
            formData.append('title', editingPost.title);
            formData.append('content', editingPost.content);
            formData.append('category', editingPost.category);

            const result = await updatePost(formData);
            if (result.success) {
                // Update the post in the list
                setPosts(posts.map(post => 
                    post.id === editingPost.id 
                        ? { 
                            ...post, 
                            title: editingPost.title, 
                            category: editingPost.category,
                            excerpt: editingPost.content.substring(0, 200) + (editingPost.content.length > 200 ? '...' : '')
                        }
                        : post
                ));
                setEditingPost(null);
            }
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setEditingPost(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Your Posts</h1>
                <p className={styles.subtitle}>Welcome back, {userName}!</p>
                <Link href="/create" className={styles.createButton}>
                    Create New Post
                </Link>
            </div>

            {posts.length === 0 && (
                <div className={styles.noPosts}>
                    <h2>No posts yet</h2>
                    <p>You haven't created any posts yet. Create your first post to get started!</p>
                </div>
            )}

            {posts.length > 0 && (
                <div className={styles.postsGrid}>
                    {posts.map((post) => (
                        <div key={post.id} className={styles.postCard}>
                            <div className={styles.postContent}>
                                <div className={styles.postMeta}>
                                    <span className={styles.category}>{post.category}</span>
                                    <span className={styles.date}>{formatDate(post.created_at)}</span>
                                </div>
                                <h3 className={styles.postTitle}>{post.title}</h3>
                                <p className={styles.postExcerpt}>{post.excerpt}</p>
                                <div className={styles.postActions}>
                                    <button 
                                        onClick={() => handleEditPost(post)}
                                        className={styles.editButton}
                                        disabled={loading}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeletePost(post.id)}
                                        className={`${styles.deleteButton} ${deleteConfirm === post.id ? styles.confirmDelete : ''}`}
                                        disabled={loading}
                                    >
                                        {deleteConfirm === post.id ? 'Confirm Delete' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editingPost && (
                <div className={styles.editModal}>
                    <div className={styles.editModalContent}>
                        <div className={styles.editModalHeader}>
                            <h2>Edit Post</h2>
                            <button onClick={cancelEdit} className={styles.closeButton}>×</button>
                        </div>
                        <form onSubmit={handleUpdatePost} className={styles.editForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="editTitle">Title</label>
                                <input
                                    id="editTitle"
                                    type="text"
                                    value={editingPost.title}
                                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                                    required
                                    className={styles.formInput}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="editCategory">Category</label>
                                <select
                                    id="editCategory"
                                    value={editingPost.category}
                                    onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                                    required
                                    className={styles.formSelect}
                                >
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="editContent">Content (Markdown)</label>
                                <textarea
                                    id="editContent"
                                    value={editingPost.content}
                                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                                    required
                                    rows={12}
                                    className={styles.formTextarea}
                                />
                            </div>
                            <div className={styles.formActions}>
                                <button type="button" onClick={cancelEdit} className={styles.cancelButton}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className={styles.saveButton}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingSpinner}>Processing...</div>
                </div>
            )}
        </div>
    );
}
