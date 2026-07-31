import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { externalUrl, sanitizeContentUrl } from "../src/security.js";

test("aceita somente HTTPS sem credenciais em links externos da interface", () => {
  assert.equal(externalUrl("https://github.com/m1ranthir"), "https://github.com/m1ranthir");
  assert.equal(externalUrl("http://example.com"), "");
  assert.equal(externalUrl("https://user:password@example.com"), "");
  assert.equal(externalUrl("javascript:alert(1)"), "");
  assert.equal(externalUrl("//example.com/path"), "");
});

test("mantém links relativos seguros e rejeita caracteres de controle", () => {
  assert.equal(sanitizeContentUrl("./assets/image.png"), "./assets/image.png");
  assert.equal(sanitizeContentUrl("#resumo"), "#resumo");
  assert.equal(sanitizeContentUrl("java\nscript:alert(1)"), "");
});

test("aplica CSP estrita e remove estilos inline do HTML dinâmico", async () => {
  const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../src/app.js", import.meta.url), "utf8");

  assert.match(index, /http-equiv="Content-Security-Policy"/);
  assert.match(index, /default-src 'self'/);
  assert.match(index, /object-src 'none'/);
  assert.match(index, /base-uri 'none'/);
  assert.match(index, /form-action 'none'/);
  assert.doesNotMatch(index, /unsafe-inline|unsafe-eval/);
  assert.doesNotMatch(index, />hp\//);
  assert.match(index, /use brain/);
  assert.doesNotMatch(app, /style="/);
});
