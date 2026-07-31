import assert from "node:assert/strict";
import test from "node:test";

import { escapeHtml, extractHeadings, renderMarkdown, slugify } from "../src/markdown.js";

test("escapa HTML arbitrário", () => {
  const output = renderMarkdown('<script>alert("xss")</script>');
  assert.equal(output.includes("<script>"), false);
  assert.match(output, /&lt;script&gt;/);
});

test("bloqueia protocolos perigosos em links e imagens", () => {
  const output = renderMarkdown(
    "[clique](javascript:alert(1))\n\n![imagem](data:image/svg+xml;base64,PHN2Zy8+)",
  );
  assert.equal(output.includes('href="javascript:'), false);
  assert.equal(output.includes('src="data:'), false);
});

test("renderiza a estrutura principal de um paper", () => {
  const output = renderMarkdown(`## Resumo

Texto com **impacto** e \`código\`.

- evidência um
- evidência dois

\`\`\`http
GET /safe HTTP/1.1
\`\`\``);

  assert.match(output, /<h2 id="resumo">Resumo<\/h2>/);
  assert.match(output, /<strong>impacto<\/strong>/);
  assert.match(output, /<code>código<\/code>/);
  assert.match(output, /<ul>/);
  assert.match(output, /data-language="http"/);
});

test("gera ids únicos e índice para headings repetidos", () => {
  const headings = extractHeadings("## Impacto\n\n## Impacto\n\n### Detalhes");
  assert.deepEqual(headings, [
    { depth: 2, text: "Impacto", id: "impacto" },
    { depth: 2, text: "Impacto", id: "impacto-2" },
    { depth: 3, text: "Detalhes", id: "detalhes" },
  ]);
});

test("normaliza texto para slugs estáveis", () => {
  assert.equal(slugify("Condição de Corrida: visão prática"), "condicao-de-corrida-visao-pratica");
  assert.equal(escapeHtml('<a href="x">'), "&lt;a href=&quot;x&quot;&gt;");
});
