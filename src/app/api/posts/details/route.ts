import { NextRequest, NextResponse } from 'next/server';
import { getUserPostById } from '@/lib/actions';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('id');

        if (!postId) {
            return NextResponse.json(
                { error: 'Post ID is required' },
                { status: 400 }
            );
        }

        const post = await getUserPostById(parseInt(postId));

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found or you do not have permission to view it' },
                { status: 404 }
            );
        }

        return NextResponse.json({ post });
    } catch (error) {
        console.error('Error fetching post details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post details' },
            { status: 500 }
        );
    }
}
