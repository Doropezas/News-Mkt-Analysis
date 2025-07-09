
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

// This script is intended to be run from the root of the `news-mkt-app` directory
const dbDir = path.resolve(process.cwd(), 'db');
const dbFilePath = path.resolve(dbDir, 'database.sqlite');

// Create the 'db' directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  console.log(`Creating database directory at: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}

async function setup() {
  console.log(`Opening database at: ${dbFilePath}`);
  const db = await open({
    filename: dbFilePath,
    driver: sqlite3.Database,
  });

  console.log('Running schema migrations...');
  await db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      summary TEXT,
      source TEXT NOT NULL,
      url TEXT UNIQUE NOT NULL,
      published_at DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS article_tags (
      article_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (article_id, tag_id),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `);

  console.log('Database schema created successfully.');

  await db.close();
  console.log('Database connection closed.');
}

setup().catch((err) => {
  console.error('Error setting up database:', err);
  process.exit(1);
});
