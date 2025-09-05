// This is a utility script to seed the categories table with sample data
// You can run this once to populate your database with categories

import sql from './db';

export async function seedCategories() {
    const sampleCategories = [
        'Technology',
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Artificial Intelligence',
        'Cloud Computing',
        'DevOps',
        'UI/UX Design',
        'Programming',
        'Database',
        'Cybersecurity',
        'Blockchain',
        'Open Source',
        'Career Advice',
        'Tutorials',
        'News',
        'Events',
        'Community'
    ];

    try {
        // First check if categories already exist
        const existingCategories = await sql`SELECT COUNT(*) as count FROM categories`;
        
        if (existingCategories[0].count > 0) {
            console.log('Categories already exist in the database');
            return;
        }

        // Insert sample categories
        for (const categoryName of sampleCategories) {
            await sql`
                INSERT INTO categories (name) 
                VALUES (${categoryName})
                ON CONFLICT (name) DO NOTHING
            `;
        }

        console.log(`Successfully seeded ${sampleCategories.length} categories`);
    } catch (error) {
        console.error('Error seeding categories:', error);
        throw error;
    }
}

// Uncomment the line below and run this file directly to seed categories
// seedCategories().catch(console.error);
