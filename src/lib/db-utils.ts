import sql from './db';
import { nanoid } from 'nanoid';

// User type
export interface User {
  id: string;
  google_id: string;
  name: string;
  email: string;
  role: 'user';
}

// Check if user exists by Google ID
export async function getUserFromGoogleId(googleId: string): Promise<User | null> {
    const users = await sql`
        SELECT * FROM users WHERE google_id = ${googleId}
    `;

    return users.length > 0 ? users[0] as User : null;
}

// Create a new user with Google data
export async function createUserWithGoogle(
    googleId: string, 
    name: string, 
    email: string, 
    role: 'user' = 'user'
): Promise<User> {
    const userId = nanoid(12);

    await sql`
        INSERT INTO users (id, google_id, name, email, role)
        VALUES (${userId}, ${googleId}, ${name}, ${email}, ${role})
    `;

    return {
        id: userId,
        google_id: googleId,
        name,
        email,
        role
    };
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
    const users = await sql`
        SELECT * FROM users WHERE id = ${userId}
    `;

    return users.length > 0 ? users[0] as User : null;
}