import { NextResponse } from 'next/server';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

// Define a type for our article structure for type safety
export interface Article {
  id: number;
  title: string;
  summary: string;
  source: string;
  url: string;
  published_at: string;
  tags: string[];
}

// The database file path
const dbFilePath = path.resolve(process.cwd(), 'db', 'database.sqlite');

export async function GET() {
  let db;
  try {
    // Open the database connection
    db = await open({
      filename: dbFilePath,
      driver: sqlite3.Database,
      mode: sqlite3.OPEN_READONLY, // Open in read-only mode for safety
    });

    // This query joins articles with their tags and aggregates the tags into a single JSON array string
    const articlesFromDb = await db.all(`
      SELECT
        a.id,
        a.title,
        a.summary,
        a.source,
        a.url,
        a.published_at,
        json_group_array(t.name) FILTER (WHERE t.name IS NOT NULL) as tags
      FROM
        articles a
      LEFT JOIN
        article_tags at ON a.id = at.article_id
      LEFT JOIN
        tags t ON at.tag_id = t.id
      GROUP BY
        a.id
      ORDER BY
        a.published_at DESC;
    `);

    // The tags are returned as a JSON string, so we need to parse them
    const articles: Article[] = articlesFromDb.map(article => ({
        ...article,
        tags: JSON.parse(article.tags || '[]'),
    }));


    return NextResponse.json(articles);
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    // Return a 500 Internal Server Error response
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  } finally {
    // Ensure the database connection is closed
    await db?.close();
  }
}
