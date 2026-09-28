import { defineConfig } from 'astro/config';
import youtubeEmbed from './plugins/youtube-embed.mjs';
import colorText from './plugins/color-text.mjs';

export default defineConfig({
  site: 'https://yahyaalasiri.com',
  markdown: {
    remarkPlugins: [colorText],
    rehypePlugins: [youtubeEmbed],
  },
});
