import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('articles'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'يحيى العسيري — المقالات',
    description: 'شروحات مبسطة عن بناء الأنظمة بالذكاء الاصطناعي والتقنية اليومية.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description || '',
      pubDate: post.data.date,
      link: '/articles/' + post.id + '/',
    })),
  });
}
