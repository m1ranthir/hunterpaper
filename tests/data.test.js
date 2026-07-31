import assert from "node:assert/strict";
import test from "node:test";

import { papers } from "../src/data.js";
import { renderMarkdown } from "../src/markdown.js";

test("publica o primeiro paper aprovado da Issue 1", () => {
  assert.equal(papers.length, 1);

  const [paper] = papers;
  assert.equal(paper.slug, "welcome-to-hunter-paper");
  assert.equal(paper.authorGithub, "m1ranthir");
  assert.equal(paper.authorGithubId, 218008298);
  assert.equal(paper.sourceUrl, "https://github.com/m1ranthir/hunterpaper/issues/1");
  assert.match(renderMarkdown(paper.body), /<img src="https:\/\/github\.com\/user-attachments\/assets\//);
});
