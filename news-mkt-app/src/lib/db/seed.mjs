import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbFilePath = path.resolve(process.cwd(), 'db', 'database.sqlite');

async function seed() {
  console.log('Opening database connection for seeding...');
  const db = await open({
    filename: dbFilePath,
    driver: sqlite3.Database,
  });

  console.log('Seeding initial data...');

  // Seed Tags
  const tags = ['Emerging Markets', 'Commodities', 'Brazil', 'Technology'];
  for (const name of tags) {
    await db.run('INSERT OR IGNORE INTO tags (name) VALUES (?)', name);
  }
  console.log('Tags seeded.');

  // Seed Articles
  const articles = [
    {
      title: 'Brazil Central Bank Holds Rates Steady Amid Inflation Concerns',
      content: 'Full text of the article about Brazil\'s central bank decision...',
      summary: 'BCB keeps Selic rate at current level, citing persistent inflationary pressures and fiscal risks.',
      source: 'Reuters',
      url: 'https://www.reuters.com/world/americas/brazil-central-bank-holds-rates-steady-2025-07-08/',
      published_at: new Date().toISOString(),
    },
    {
      title: 'Global Tech Rally Continues, Driven by AI Optimism',
      content: 'Full text of the article about the tech rally...',
      summary: 'Major tech stocks are surging as investors pour capital into AI-related ventures and infrastructure.',
      source: 'The Wall Street Journal',
      url: 'https://www.wsj.com/articles/global-tech-rally-continues-2025-07-08/',
      published_at: new Date().toISOString(),
    },
    {
        title: 'Oil Prices Fluctuate as OPEC+ Decision Looms',
        content: 'Full text of the article about oil prices...',
        summary: 'Crude oil prices see volatility ahead of the upcoming OPEC+ meeting to decide on production quotas.',
        source: 'Financial Times',
        url: 'https://www.ft.com/content/oil-prices-opec-decision-2025-07-08',
        published_at: new Date().toISOString(),
    }
  ];

  for (const article of articles) {
    await db.run(
      'INSERT OR IGNORE INTO articles (title, content, summary, source, url, published_at) VALUES (?, ?, ?, ?, ?, ?)',
      [article.title, article.content, article.summary, article.source, article.url, article.published_at]
    );
  }
  console.log('Articles seeded.');

  // Seed Article-Tag relationships (example)
  // Link "Brazil" and "Emerging Markets" to the Brazil article
  await db.run('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (1, 1)');
  await db.run('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (1, 3)');
  // Link "Technology" to the tech rally article
  await db.run('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (2, 4)');
  // Link "Commodities" to the oil prices article
  await db.run('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (3, 2)');
  console.log('Article-tag relationships seeded.');


  await db.close();
  console.log('Database connection closed.');
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
