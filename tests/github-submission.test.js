import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { config } from "../src/config.js";

test("aponta a submissão para o repositório oficial sem endpoint de API", () => {
  assert.equal(config.githubRepository, "https://github.com/m1ranthir/hunterpaper");
  assert.equal(
    config.paperSubmissionUrl,
    "https://github.com/m1ranthir/hunterpaper/issues/new?template=paper-submission.yml",
  );
  assert.equal("submissionEndpoint" in config, false);
});

test("mantém o formulário de paper estruturado para revisão manual", async () => {
  const form = await readFile(
    new URL("../.github/ISSUE_TEMPLATE/paper-submission.yml", import.meta.url),
    "utf8",
  );

  assert.match(form, /paper:pending/);
  assert.match(form, /type: textarea\n    id: paper/);
  assert.match(form, /type: upload\n    id: images/);
  assert.match(form, /id: disclosure/);
  assert.doesNotMatch(form, /submissionEndpoint|GitHub App/);
});
