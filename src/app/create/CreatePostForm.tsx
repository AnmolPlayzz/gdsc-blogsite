"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, Category } from "@/lib/actions";
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import styles from './CreatePostForm.module.css';

interface CreatePostFormProps {
    categories: Category[];
}

export default function CreatePostForm({ categories }: CreatePostFormProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content || "");
            formData.append("category", selectedCategory);

            const result = await createPost(formData);
            
            if (result?.success) {
                setSuccess("Post created successfully!");
                setTitle("");
                setContent("");
                setSelectedCategory("");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.createPostForm}>
            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}
            
            {success && (
                <div className={styles.successMessage}>
                    {success}
                </div>
            )}
            
            <div className={styles.formGroup}>
                <label htmlFor="title">Title *</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter post title"
                    disabled={isSubmitting}
                />
                <small>A unique URL will be automatically generated from your title</small>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="category">Category *</label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className={styles.categorySelect}
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.formGroup}>
                <div className={styles.contentHeader}>
                    <label htmlFor="content">Content *</label>
                </div>
                <div className={styles.markdownContainer} data-color-mode="dark">
                    <MDEditor
                        value={content}
                        onChange={(val) => setContent(val || "")}
                        hideToolbar={false}
                        height={400}
                        preview="live"
                        draggable={false}
                    
                        data-color-mode="dark"
                    />
                </div>
                {content && (
                    <small>{content.length} characters</small>
                )}
            </div>

            <div className={styles.formActions}>
                <button 
                    type="submit" 
                    disabled={isSubmitting || !title || !content || !selectedCategory}
                    className={styles.submitBtn}
                >
                    {isSubmitting ? "Creating..." : "Create Post"}
                </button>
            </div>
        </form>
    );
}
