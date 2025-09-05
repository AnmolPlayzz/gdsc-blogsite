"use server";

import { getCurrentSession, invalidateSession, lucia } from "@/lib/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import sql from "@/lib/db";
import { nanoid } from "nanoid";

export async function logout() {
    const { session } = await getCurrentSession();
    if (session) {
        await invalidateSession(session.id);
    }

    const sessionCookie = lucia.createBlankSessionCookie();
    const cookieStore = await cookies();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    
    redirect("/login");
}

export interface Category {
    id: string;
    name: string;
}

export async function getCategories(): Promise<Category[]> {
    try {
        const categories = await sql`
            SELECT * FROM categories ORDER BY name ASC
        `;
        
        return categories.map((category: any) => ({
            id: category.id,
            name: category.name
        }));
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories");
    }
}

function generateSlugFromTitle(title: string): string {
    return title
        .toLowerCase()
        .trim()
        // Replace accented characters with their base equivalents
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Remove special characters except spaces and hyphens
        .replace(/[^a-z0-9\s-]/g, '')
        // Replace multiple spaces with single spaces
        .replace(/\s+/g, ' ')
        // Replace spaces with hyphens
        .replace(/\s/g, '-')
        // Replace multiple hyphens with single hyphen
        .replace(/-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, '');
}

export interface Post {
    id: number;
    slug: string;
    title: string;
    content: string;
    author: string;
    category: string;
    created_at: Date;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        if (!slug || slug.trim().length === 0) {
            throw new Error("Slug is required");
        }

        const posts = await sql`
            SELECT p.*, u.name as author_name 
            FROM posts p
            LEFT JOIN users u ON p.author = u.id
            WHERE p.slug = ${slug}
        `;

        if (posts.length === 0) {
            return null;
        }

        const post = posts[0];
        return {
            id: post.id,
            slug: post.slug,
            title: post.title,
            content: post.content,
            author: post.author_name || post.author,
            category: post.category,
            created_at: new Date(post.created_at)
        };
    } catch (error) {
        console.error("Error fetching post by slug:", error);
        throw new Error("Failed to fetch post");
    }
}

export interface PostSummary {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    author_name: string;
    category: string;
    created_at: Date;
}

export async function getAllPosts(searchQuery?: string, categoryFilter?: string): Promise<PostSummary[]> {
    try {
        let posts;

        if (searchQuery && searchQuery.trim() && categoryFilter && categoryFilter !== 'all') {
            // Both search and category filter
            const searchPattern = `%${searchQuery.trim()}%`;
            posts = await sql`
                SELECT 
                    p.id,
                    p.slug,
                    p.title,
                    LEFT(p.content, 200) as excerpt,
                    u.name as author_name,
                    p.category,
                    p.created_at
                FROM posts p
                LEFT JOIN users u ON p.author = u.id
                WHERE (p.title ILIKE ${searchPattern} OR p.content ILIKE ${searchPattern})
                AND p.category = ${categoryFilter}
                ORDER BY p.created_at DESC
            `;
        } else if (searchQuery && searchQuery.trim()) {
            // Only search filter
            const searchPattern = `%${searchQuery.trim()}%`;
            posts = await sql`
                SELECT 
                    p.id,
                    p.slug,
                    p.title,
                    LEFT(p.content, 200) as excerpt,
                    u.name as author_name,
                    p.category,
                    p.created_at
                FROM posts p
                LEFT JOIN users u ON p.author = u.id
                WHERE p.title ILIKE ${searchPattern} OR p.content ILIKE ${searchPattern}
                ORDER BY p.created_at DESC
            `;
        } else if (categoryFilter && categoryFilter !== 'all') {
            // Only category filter
            posts = await sql`
                SELECT 
                    p.id,
                    p.slug,
                    p.title,
                    LEFT(p.content, 200) as excerpt,
                    u.name as author_name,
                    p.category,
                    p.created_at
                FROM posts p
                LEFT JOIN users u ON p.author = u.id
                WHERE p.category = ${categoryFilter}
                ORDER BY p.created_at DESC
            `;
        } else {
            // No filters
            posts = await sql`
                SELECT 
                    p.id,
                    p.slug,
                    p.title,
                    LEFT(p.content, 200) as excerpt,
                    u.name as author_name,
                    p.category,
                    p.created_at
                FROM posts p
                LEFT JOIN users u ON p.author = u.id
                ORDER BY p.created_at DESC
            `;
        }

        return posts.map((post: any) => ({
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt + (post.excerpt.length >= 200 ? '...' : ''),
            author_name: post.author_name || 'Unknown Author',
            category: post.category,
            created_at: new Date(post.created_at)
        }));
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Failed to fetch posts");
    }
}

export async function createPost(formData: FormData) {
    const { user } = await getCurrentSession();
    
    if (!user) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;

    // Validation
    if (!title || title.trim().length === 0) {
        throw new Error("Title is required");
    }

    if (!content || content.trim().length === 0) {
        throw new Error("Content is required");
    }

    if (!category || category.trim().length === 0) {
        throw new Error("Category is required");
    }

    // Generate slug from title on backend
    let baseSlug = generateSlugFromTitle(title);
    
    // Fallback if slug becomes empty after processing
    if (!baseSlug) {
        baseSlug = 'untitled-post';
    }

    // Generate a unique slug with random number for guaranteed uniqueness
    let finalSlug = '';
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 50;

    while (!isUnique && attempts < maxAttempts) {
        // Generate random number (4-6 digits for better uniqueness)
        const randomNum = Math.floor(Math.random() * 900000) + 100000; // 6-digit random number
        finalSlug = `${baseSlug}-${randomNum}`;

        // Check if this slug already exists
        const existingPost = await sql`
            SELECT id FROM posts WHERE slug = ${finalSlug}
        `;

        if (existingPost.length === 0) {
            isUnique = true;
        }
        
        attempts++;
    }

    if (!isUnique) {
        // Fallback to nanoid for extreme edge cases
        finalSlug = `${baseSlug}-${nanoid(8)}`;
    }

    try {
        // Insert the new post with the final unique slug and category
        await sql`
            INSERT INTO posts (slug, title, content, author, category)
            VALUES (${finalSlug}, ${title}, ${content}, ${user.id}, ${category})
        `;
        
        // Return success with the slug for potential use
        return { success: true, slug: finalSlug };
    } catch (error) {
        console.error("Error creating post:", error);
        throw new Error("Failed to create post");
    }
}

// Comment-related interfaces and functions
export interface Comment {
    id: number;
    author: string;
    author_name: string;
    content: string;
    post_id: string;
    created_at: Date;
}

export async function getCommentsByPostSlug(postSlug: string): Promise<Comment[]> {
    try {
        if (!postSlug || postSlug.trim().length === 0) {
            throw new Error("Post slug is required");
        }

        const comments = await sql`
            SELECT c.*, u.name as author_name 
            FROM comments c
            LEFT JOIN users u ON c.author = u.id
            WHERE c.post_id = ${postSlug}
            ORDER BY c.created_at ASC
        `;

        return comments.map((comment: any) => ({
            id: comment.id,
            author: comment.author,
            author_name: comment.author_name || 'Unknown User',
            content: comment.content,
            post_id: comment.post_id,
            created_at: new Date(comment.created_at)
        }));
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw new Error("Failed to fetch comments");
    }
}

export async function createComment(formData: FormData) {
    const { user } = await getCurrentSession();
    
    if (!user) {
        throw new Error("You must be logged in to comment");
    }

    const content = formData.get("content") as string;
    const postSlug = formData.get("postSlug") as string;

    // Validation
    if (!content || content.trim().length === 0) {
        throw new Error("Comment content is required");
    }

    if (!postSlug || postSlug.trim().length === 0) {
        throw new Error("Post slug is required");
    }

    // Verify that the post exists
    const existingPost = await sql`
        SELECT id FROM posts WHERE slug = ${postSlug}
    `;

    if (existingPost.length === 0) {
        throw new Error("Post not found");
    }

    try {
        // Insert the new comment
        await sql`
            INSERT INTO comments (author, content, post_id)
            VALUES (${user.id}, ${content.trim()}, ${postSlug})
        `;
        
        return { success: true };
    } catch (error) {
        console.error("Error creating comment:", error);
        throw new Error("Failed to create comment");
    }
}