import rss from '@astrojs/rss';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export async function GET(context: any) {
  const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');
  const articles: any[] = [];
  if (fs.existsSync(ARTICLES_DIR)) {
    for (const file of fs.readdirSync(ARTICLES_DIR)) {
      if (!file.endsWith('.md')) continue;
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
      const fm = matter(raw);
      if (fm.data) articles.push(fm);
    }
  }
  const published = articles.filter((a: any) => a.data.status !== 'draft');
  published.sort((a: any, b: any) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: 'The Veil Press — Desk',
    description: 'Independent press documenting durable power — architecture, money, narrative, access.',
    site: context.site,
    items: published.map((article: any) => ({
      title: article.data.title,
      description: article.data.dek || article.data.description || '',
      pubDate: article.data.date,
      link: `/desk/${article.data.slug}`,
      categories: article.data.tags || [],
    })),
  });
}
