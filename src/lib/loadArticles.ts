import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type ArticleDoc = {
  data: Record<string, any>;
  body: string;
  file: string;
};

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

export function loadArticles(): ArticleDoc[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const out: ArticleDoc[] = [];
  for (const file of fs.readdirSync(ARTICLES_DIR)) {
    if (!file.endsWith('.md')) continue;
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
    const fm = matter(raw);
    if (!fm.data?.slug || fm.data.status === 'draft') continue;
    out.push({ data: fm.data, body: fm.content || '', file });
  }
  return out;
}

export function loadArticleBySlug(slug: string): ArticleDoc | undefined {
  return loadArticles().find((a) => a.data.slug === slug);
}

export function uniqueArticleSlugs(): string[] {
  const seen = new Set<string>();
  const slugs: string[] = [];
  for (const a of loadArticles()) {
    const s = a.data.slug as string;
    if (!seen.has(s)) {
      seen.add(s);
      slugs.push(s);
    }
  }
  return slugs;
}
