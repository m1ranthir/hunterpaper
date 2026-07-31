import assert from "node:assert/strict";
import test from "node:test";

import {
  creator,
  getContributors,
  githubUrl,
  projectContributors,
  supporters,
} from "../src/community.js";

test("não cria apoiadores fictícios", () => {
  assert.deepEqual(supporters.companies, []);
  assert.deepEqual(supporters.people, []);
});

test("lista m1ranthir como criador do projeto", () => {
  assert.equal(creator.name, "m1ranthir");
  assert.equal(creator.image, "./assets/m1ranthir_logo.png");
  assert.deepEqual(creator.socials, { github: "", linkedin: "" });
  assert.equal(projectContributors[0].name, "m1ranthir");
  assert.equal(projectContributors[0].githubId, 218008298);
  assert.equal(projectContributors[0].github, "m1ranthir");
  assert.deepEqual(projectContributors[0].roles, ["creator", "maintainer"]);
});

test("combina autores publicados pelo GitHub ID sem duplicar", () => {
  const result = getContributors([
    { authors: [{ githubId: 218008298, github: "m1ranthir", name: "m1ranthir" }], title: "Paper A" },
    { authors: [{ githubId: 2, github: "researcher", name: "Researcher" }], title: "Paper B" },
    { authors: [{ githubId: 2, github: "researcher", name: "Researcher" }], title: "Paper C" },
  ]);

  assert.equal(result.length, 2);
  const creator = result.find((item) => item.id === "m1ranthir");
  const researcher = result.find((item) => item.github === "researcher");
  assert.deepEqual(
    creator.roles.sort(),
    ["creator", "maintainer", "researcher", "paperAuthor"].sort(),
  );
  assert.equal(creator.paperCount, 1);
  assert.equal(researcher.paperCount, 2);
});

test("gera links GitHub seguros a partir de handles", () => {
  assert.equal(githubUrl("@m1ranthir"), "https://github.com/m1ranthir");
  assert.equal(githubUrl(""), "");
});
