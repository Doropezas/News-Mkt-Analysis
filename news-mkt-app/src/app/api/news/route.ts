import { NextResponse } from 'next/server';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import Parser from 'rss-parser';

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

// RSS Feed URLs for emerging markets, commodities, US/LatAm economic/monetary policy
const RSS_FEED_URLS = [
  'https://www.reuters.com/arc/outboundfeeds/rss/?outputType=xml', // Reuters Top News (general, but often includes relevant)
  'https://www.oilprice.com/rss.xml', // OilPrice.com for commodities
  'https://www.stlouisfed.org/on-the-economy/rss', // Federal Reserve Bank of St. Louis - On The Economy Blog (US economic policy)
  'https://www.mercopress.com/rss/latin-america', // MercoPress - Latin America News (English)
  'https://www.mercopress.com/rss/es/latin-america', // MercoPress - Latin America News (Spanish)
  'https://www.investing.com/rss/news_301.rss', // Investing.com - Commodities Analysis & Opinion (Spanish)
  'https://www.investing.com/rss/news_25.rss', // Investing.com - Economic News (Spanish)
];

export async function GET() {
  let db;
  try {
    db = await open({
      filename: dbFilePath,
      driver: sqlite3.Database,
    });

    const parser = new Parser();

    // Fetch and parse RSS feeds
    for (const feedUrl of RSS_FEED_URLS) {
      try {
        const feed = await parser.parseURL(feedUrl);
        console.log(`Fetched feed: ${feed.title}`);

        if (feed.items) {
          for (const item of feed.items) {
            const title = item.title || 'No Title';
            const summary = item.contentSnippet || item.summary || item.content || '';
            const source = feed.title || new URL(feedUrl).hostname;
            const url = item.link;
            const rawDateString = item.isoDate || item.pubDate;
            let publishedAt;

            if (rawDateString) {
              const dateObj = new Date(rawDateString);
              if (!isNaN(dateObj.getTime())) {
                publishedAt = dateObj.toISOString();
              } else {
                publishedAt = new Date().toISOString();
              }
            } else {
              publishedAt = new Date().toISOString();
            }

            if (url) {
              // Filter out Arabic Reuters URLs
              if (url.startsWith('https://www.reuters.com/ar/') || url.startsWith('https://ar.reuters.com/')) {
                console.log(`Skipping Arabic article: ${url}`);
                continue; // Skip to the next item
              }

              await db.run(
                `INSERT OR IGNORE INTO articles (title, content, summary, source, url, published_at)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [title, item.content || summary, summary, source, url, publishedAt]
              );
            }
          }
        }
      } catch (rssError) {
        console.error(`Error fetching or parsing RSS feed ${feedUrl}:`, rssError);
      }
    }

    // Retrieve all articles from our local database
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

    const articles: Article[] = articlesFromDb.map(article => ({
        ...article,
        tags: JSON.parse(article.tags || '[]'),
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Failed to fetch or process articles:', error);
    return NextResponse.json({ error: 'Failed to fetch or process articles' }, { status: 500 });
  } finally {
    await db?.close();
  }
}
