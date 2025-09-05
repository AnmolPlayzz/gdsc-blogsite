"use client";

import { useState } from 'react';
import Link from 'next/link';
import { PostSummary, Category } from '@/lib/actions';
import styles from './PostList.module.css';

interface PostListProps {
    initialPosts: PostSummary[];
    categories: Category[];
}

export default function PostList({ initialPosts, categories }: PostListProps) {
    const [posts, setPosts] = useState<PostSummary[]>(initialPosts);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(false);

    const fetchPosts = async (search: string = '', category: string = 'all') => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category !== 'all') params.append('category', category);
            
            const response = await fetch(`/api/posts?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        await fetchPosts(searchQuery, selectedCategory);
    };

    const handleCategoryChange = async (category: string) => {
        setSelectedCategory(category);
        await fetchPosts(searchQuery, category);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.filters}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className={styles.searchInput}
                        />
                        <button onClick={handleSearch} className={styles.searchButton}>
                            Search
                        </button>
                    </div>
                    <div className={styles.categoryFilter}>
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className={styles.categorySelect}
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading && (
                <div className={styles.loading}>Loading posts...</div>
            )}

            {!loading && posts.length === 0 && (
                <div className={styles.noPosts}>
                    <p>No posts found.</p>
                    {(searchQuery || selectedCategory !== 'all') && (
                        <p>Try adjusting your search or category filter.</p>
                    )}
                </div>
            )}

            {!loading && posts.length > 0 && (
                <div className={styles.postsGrid}>
                    {posts.map((post) => (
                        <Link key={post.id} href={`/post/${post.slug}`} className={styles.postCard}>
                            <div className={styles.postContent}>
                                <div className={styles.postMeta}>
                                    <span className={styles.category}>{post.category}</span>
                                    <span className={styles.date}>{formatDate(post.created_at)}</span>
                                </div>
                                <h3 className={styles.postTitle}>{post.title}</h3>
                                <p className={styles.postExcerpt}>{post.excerpt}</p>
                                <div className={styles.postFooter}>
                                    <span className={styles.author}>By {post.author_name}</span>
                                    <span className={styles.readMore}>Read more →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}