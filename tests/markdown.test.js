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
    "[javascript](javascript:alert(1))\n\n[http](http://example.com)\n\n![data](data:image/svg+xml;base64,PHN2Zy8+)\n\n![blob](blob:https://example.com/id)",
  );
  assert.equal(output.includes('href="javascript:'), false);
  assert.equal(output.includes('href="http:'), false);
  assert.equal(output.includes('src="data:'), false);
  assert.equal(output.includes('src="blob:'), false);
});

test("permite somente imagens locais ou hospedadas nos anexos do GitHub", () => {
  const output = renderMarkdown(
    "![permitida](https://github.com/user-attachments/assets/12345678)\n\n![tracking](https://tracker.example/pixel.png)\n\n![protocol-relative](//tracker.example/pixel.png)",
  );

  assert.match(output, /<img src="https:\/\/github\.com\/user-attachments\/assets\/12345678"/);
  assert.equal(output.includes('src="https://tracker.example'), false);
  assert.equal(output.includes('src="//tracker.example'), false);
});

test("escapa atributos de links e imagens", () => {
  const output = renderMarkdown(
    '![\" onerror=\"alert(1)](./assets/safe.png)',
  );

  assert.doesNotMatch(output, /alt=""\s+onerror=/);
  assert.match(output, /&quot;/);
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
