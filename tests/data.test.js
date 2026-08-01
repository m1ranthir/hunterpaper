import assert from "node:assert/strict";
import test from "node:test";

import { papers, sortPapersForFeed } from "../src/data.js";
import { renderMarkdown } from "../src/markdown.js";

test("publica o primeiro paper aprovado da Issue 1", () => {
  assert.equal(papers.length, 1);

  const [paper] = papers;
  assert.equal(paper.id, "hp-a7f3d9c2");
  assert.equal(paper.slug, "welcome-to-hunter-paper");
  assert.equal(paper.authorGithub, "m1ranthir");
  assert.equal(paper.authorGithubId, 218008298);
  assert.equal(paper.sourceUrl, "https://github.com/m1ranthir/hunterpaper/issues/1");
  assert.equal(paper.pinned, true);
  assert.equal(paper.pinOrder, 1);
  assert.match(renderMarkdown(paper.body), /<img src="https:\/\/github\.com\/user-attachments\/assets\//);
});

test("mantém IDs e slugs únicos para todos os papers", () => {
  const ids = papers.map((paper) => paper.id);
  const slugs = papers.map((paper) => paper.slug);

  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(slugs).size, slugs.length);
  ids.forEach((id) => assert.match(id, /^hp-[a-z0-9]{8}$/));
});

test("ordena papers fixados antes dos mais recentes sem alterar a lista original", () => {
  const input = [
    { id: "hp-00000003", publishedAt: "2026-07-30" },
    { id: "hp-00000001", publishedAt: "2026-01-01", pinned: true, pinOrder: 2 },
    { id: "hp-00000004", publishedAt: "2026-07-31" },
    { id: "hp-00000002", publishedAt: "2025-01-01", pinned: true, pinOrder: 1 },
  ];

  const ordered = sortPapersForFeed(input);

  assert.deepEqual(
    ordered.map((paper) => paper.id),
    ["hp-00000002", "hp-00000001", "hp-00000004", "hp-00000003"],
  );
  assert.deepEqual(
    input.map((paper) => paper.id),
    ["hp-00000003", "hp-00000001", "hp-00000004", "hp-00000002"],
  );
});
