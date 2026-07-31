const HTML_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
}

export function slugify(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function sanitizeUrl(rawUrl, { image = false } = {}) {
  const url = String(rawUrl ?? "")
    .trim()
    .replace(/[\u0000-\u001F\u007F\s]+/g, "");

  if (!url) return "";

  const lower = url.toLowerCase();
  const relative =
    url.startsWith("/") ||
    url.startsWith("./") ||
    url.startsWith("../") ||
    url.startsWith("#") ||
    /^[a-z0-9][a-z0-9._/-]*$/i.test(url);

  if (relative) return url;
  if (lower.startsWith("https://") || lower.startsWith("http://")) return url;
  if (!image && lower.startsWith("mailto:")) return url;
  if (image && lower.startsWith("blob:")) return url;

  return "";
}

function createTokenStore() {
  const tokens = [];

  return {
    add(html) {
      const key = `HPTOKEN${tokens.length}ENDTOKEN`;
      tokens.push({ key, html });
      return key;
    },
    restore(value) {
      return tokens.reduce((output, token) => output.replaceAll(token.key, token.html), value);
    },
  };
}

function renderInline(value, options = {}) {
  const tokenStore = createTokenStore();
  let output = String(value ?? "");

  output = output.replace(/`([^`\n]+)`/g, (_, code) =>
    tokenStore.add(`<code>${escapeHtml(code)}</code>`),
  );

  output = output.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["']([^"']*)["'])?\)/g,
    (original, alt, rawUrl, title) => {
      const resolved = options.resolveImageUrl?.(rawUrl) || rawUrl;
      const safeUrl = sanitizeUrl(resolved, { image: true });

      if (!safeUrl) return escapeHtml(original);

      const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
      return tokenStore.add(
        `<img src="${escapeHtml(safeUrl)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async"${titleAttribute}>`,
      );
    },
  );

  output = output.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+["']([^"']*)["'])?\)/g,
    (original, label, rawUrl, title) => {
      const safeUrl = sanitizeUrl(rawUrl);
      if (!safeUrl) return escapeHtml(original);

      const external = /^https?:\/\//i.test(safeUrl);
      const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
      const externalAttributes = external
        ? ' target="_blank" rel="noopener noreferrer ugc"'
        : "";

      return tokenStore.add(
        `<a href="${escapeHtml(safeUrl)}"${titleAttribute}${externalAttributes}>${escapeHtml(label)}</a>`,
      );
    },
  );

  output = escapeHtml(output);
  output = output.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/__([^_\n]+)__/g, "<strong>$1</strong>");
  output = output.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  output = output.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");

  return tokenStore.restore(output);
}

function createHeadingIdGenerator() {
  const seen = new Map();

  return (heading) => {
    const base = slugify(heading) || "secao";
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

export function extractHeadings(markdown = "") {
  const nextId = createHeadingIdGenerator();
  const headings = [];
  let inCodeBlock = false;

  for (const line of String(markdown).replace(/\r\n?/g, "\n").split("\n")) {
    if (/^\s*```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*$/);
    if (!match) continue;

    const plainText = match[2]
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();

    headings.push({
      depth: match[1].length,
      text: plainText,
      id: nextId(plainText),
    });
  }

  return headings;
}

export function renderMarkdown(markdown = "", options = {}) {
  const lines = String(markdown).replace(/\r\n?/g, "\n").split("\n");
  const html = [];
  const paragraph = [];
  const quote = [];
  let listType = null;
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeLines = [];
  const nextHeadingId = createHeadingIdGenerator();

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInline(paragraph.join(" "), options)}</p>`);
    paragraph.length = 0;
  };

  const flushQuote = () => {
    if (!quote.length) return;
    html.push(`<blockquote><p>${renderInline(quote.join(" "), options)}</p></blockquote>`);
    quote.length = 0;
  };

  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  const flushFlow = () => {
    flushParagraph();
    flushQuote();
    closeList();
  };

  for (const line of lines) {
    const fence = line.match(/^\s*```\s*([a-zA-Z0-9_-]*)\s*$/);

    if (fence) {
      if (!inCodeBlock) {
        flushFlow();
        inCodeBlock = true;
        codeLanguage = fence[1].toLowerCase();
        codeLines = [];
      } else {
        const language = /^[a-z0-9_-]+$/.test(codeLanguage) ? codeLanguage : "text";
        html.push(
          `<pre data-language="${escapeHtml(language || "text")}"><code class="language-${escapeHtml(language || "text")}">${escapeHtml(codeLines.join("\n"))}</code></pre>`,
        );
        inCodeBlock = false;
        codeLanguage = "";
        codeLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushFlow();
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+?)\s*#*$/);
    if (heading) {
      flushFlow();
      const level = heading[1].length;
      const id = nextHeadingId(
        heading[2]
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/[*_`]/g, ""),
      );
      html.push(`<h${level} id="${escapeHtml(id)}">${renderInline(heading[2], options)}</h${level}>`);
      continue;
    }

    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      flushFlow();
      html.push("<hr>");
      continue;
    }

    const blockquote = line.match(/^>\s?(.*)$/);
    if (blockquote) {
      flushParagraph();
      closeList();
      quote.push(blockquote[1]);
      continue;
    }

    const unordered = line.match(/^\s*[-+*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      flushQuote();
      const requestedType = unordered ? "ul" : "ol";
      if (listType !== requestedType) {
        closeList();
        listType = requestedType;
        html.push(`<${listType}>`);
      }
      html.push(`<li>${renderInline((unordered || ordered)[1], options)}</li>`);
      continue;
    }

    if (quote.length) flushQuote();
    if (listType) closeList();
    paragraph.push(line.trim());
  }

  if (inCodeBlock) {
    const language = /^[a-z0-9_-]+$/.test(codeLanguage) ? codeLanguage : "text";
    html.push(
      `<pre data-language="${escapeHtml(language || "text")}"><code class="language-${escapeHtml(language || "text")}">${escapeHtml(codeLines.join("\n"))}</code></pre>`,
    );
  }

  flushFlow();
  return html.join("\n");
}
