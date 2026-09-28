const RE = /:(teal|amber|red|muted)\[([^\]\n]+)\]/g;

function transformText(value) {
  if (!value || value.indexOf(':') === -1) return null;
  RE.lastIndex = 0;
  const out = [];
  let last = 0;
  let m;
  while ((m = RE.exec(value)) !== null) {
    if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
    const safe = m[2].replace(/</g, '&lt;').replace(/>/g, '&gt;');
    out.push({ type: 'html', value: '<span class="hl-' + m[1] + '">' + safe + '</span>' });
    last = m.index + m[0].length;
  }
  if (!out.length) return null;
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
}

function walk(node) {
  if (!node || !Array.isArray(node.children)) return;
  const kids = node.children;
  for (let i = 0; i < kids.length; i++) {
    const child = kids[i];
    if (child.type === 'text') {
      const replacement = transformText(child.value);
      if (replacement) {
        kids.splice(i, 1, ...replacement);
        i += replacement.length - 1;
      }
    } else {
      walk(child);
    }
  }
}

export default function colorText() {
  return function (tree) {
    walk(tree);
  };
}
