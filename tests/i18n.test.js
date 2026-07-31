import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_LOCALE,
  formatDate,
  getLocale,
  messages,
  plural,
  supportedLocales,
  t,
} from "../src/i18n.js";

test("usa EN-US como idioma padrão e fallback", () => {
  assert.equal(DEFAULT_LOCALE, "en-US");
  assert.equal(getLocale(), "en-US");
  assert.deepEqual([...supportedLocales], ["en-US", "pt-BR"]);
  assert.equal(t("nav.submit", {}, "idioma-inexistente"), "Submit paper");
  assert.equal(t("chave.inexistente", {}, "pt-BR"), "chave.inexistente");
});

test("traduz a interface e interpola valores em PT-BR", () => {
  assert.equal(t("nav.community", {}, "pt-BR"), "Comunidade");
  assert.equal(t("community.supportersTitle", {}, "pt-BR"), "Apoiadores");
  assert.equal(
    t("community.viewGithub", { handle: "pesquisador" }, "pt-BR"),
    "Ver @pesquisador no GitHub",
  );
});

test("aplica pluralização em EN-US e PT-BR", () => {
  assert.equal(plural("home.paperCount", 1, {}, "en-US"), "1 paper");
  assert.equal(plural("home.paperCount", 2, {}, "en-US"), "2 papers");
  assert.equal(plural("community.paperCount", 1, {}, "pt-BR"), "1 paper publicado");
  assert.equal(plural("community.paperCount", 2, {}, "pt-BR"), "2 papers publicados");
});

test("mantém datas editoriais no dia publicado independentemente do fuso", () => {
  assert.equal(formatDate("2026-07-31", {}, "en-US"), "Jul 31, 2026");
});

test("mantém paridade de chaves entre EN-US e PT-BR", () => {
  const englishKeys = Object.keys(messages["en-US"]).sort();
  const portugueseKeys = Object.keys(messages["pt-BR"]).sort();

  assert.deepEqual(portugueseKeys, englishKeys);
});
