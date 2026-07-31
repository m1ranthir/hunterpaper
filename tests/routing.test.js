import assert from "node:assert/strict";
import test from "node:test";

import { papers } from "../src/data.js";
import {
  canonicalPaperHash,
  isValidPaperId,
  resolvePaper,
} from "../src/routing.js";

test("usa ID opaco na rota canônica do paper", () => {
  const [paper] = papers;

  assert.equal(isValidPaperId(paper.id), true);
  assert.equal(canonicalPaperHash(paper), "#paper/hp-a7f3d9c2");
  assert.equal(canonicalPaperHash(paper).includes(paper.slug), false);
});

test("mantém o slug antigo somente como redirecionamento de compatibilidade", () => {
  const [paper] = papers;
  const legacy = resolvePaper(papers, paper.slug);
  const canonical = resolvePaper(papers, paper.id);

  assert.equal(legacy.paper, paper);
  assert.equal(legacy.usedLegacySlug, true);
  assert.equal(legacy.canonicalHash, "#paper/hp-a7f3d9c2");
  assert.equal(canonical.paper, paper);
  assert.equal(canonical.usedLegacySlug, false);
});

test("rejeita identificadores de rota malformados", () => {
  assert.equal(resolvePaper(papers, "../../etc/passwd"), null);
  assert.equal(resolvePaper(papers, '<img src=x onerror="alert(1)">'), null);
  assert.throws(() => canonicalPaperHash({ id: "id-invalido" }), TypeError);
});
