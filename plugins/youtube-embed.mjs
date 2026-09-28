function getYouTubeId(href) {
  try {
    const u = new URL(href);
    const host = u.hostname.replace('www.', '');
    if (host === 'youtu.be') {
      return u.pathname.slice(1).split('/')[0] || null;
    }
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v');
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') return parts[1] || null;
    }
    return null;
  } catch (e) {
    return null;
  }
}

function walk(node) {
  if (!node || !Array.isArray(node.children)) return;
  const children = node.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === 'element' && child.tagName === 'p') {
      const meaningful = child.children.filter(function (c) {
        return !(c.type === 'text' && c.value.trim() === '');
      });
      const only = meaningful.length === 1 ? meaningful[0] : null;
      const link = only && only.type === 'element' && only.tagName === 'a' && only.properties && only.properties.href ? only : null;
      if (link) {
        const id = getYouTubeId(String(link.properties.href));
        if (id) {
          children[i] = {
            type: 'element',
            tagName: 'div',
            properties: { className: ['video-embed'] },
            children: [{
              type: 'element',
              tagName: 'iframe',
              properties: {
                src: 'https://www.youtube-nocookie.com/embed/' + id,
                title: 'فيديو يوتيوب',
                loading: 'lazy',
                allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                allowFullscreen: true,
              },
              children: [],
            }],
          };
          continue;
        }
      }
    }
    walk(child);
  }
}

export default function youtubeEmbed() {
  return function (tree) {
    walk(tree);
  };
}
