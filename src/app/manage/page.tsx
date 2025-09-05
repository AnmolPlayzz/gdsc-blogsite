import { getCurrentSession } from '@/lib/session';
import { getUserPosts, getCategories } from '@/lib/actions';
import { redirect } from 'next/navigation';
import ManagePostsClient from './ManagePostsClient';

export default async function ManagePage() {
    const { user } = await getCurrentSession();
    
    if (!user) {
        redirect('/login');
    }

    try {
        const [posts, categories] = await Promise.all([
            getUserPosts(),
            getCategories()
        ]);

        return (
            <div>
                <ManagePostsClient 
                    initialPosts={posts} 
                    categories={categories}
                    userName={user.name}
                />
            </div>
        );
    } catch (error) {
        console.error('Error loading manage page:', error);
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'white' }}>
                <h1>Error Loading Posts</h1>
                <p>There was an error loading your posts. Please try again later.</p>
            </div>
        );
    }
}