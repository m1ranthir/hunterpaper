// Adicione apenas apoiadores confirmados. Nenhuma empresa ou pessoa fictícia
// deve ser usada para preencher a interface.
export const supporters = Object.freeze({
  // Formato: { name, url, description? }
  companies: [],
  // Formato: { name, github, url?, description? }
  people: [],
});

// Preencha as URLs quando os perfis estiverem prontos. Enquanto estiverem
// vazias, a interface mantém os botões visíveis, mas desativados.
export const creator = Object.freeze({
  name: "m1ranthir",
  image: "./assets/m1ranthir_logo.png",
  socials: Object.freeze({
    github: "https://github.com/m1ranthir",
    linkedin: "https://www.linkedin.com/in/kaikymoura/",
  }),
});

// Contribuidores do projeto. Autores de papers publicados são combinados com
// esta lista automaticamente por getContributors().
export const projectContributors = Object.freeze([
  {
    id: "m1ranthir",
    name: "m1ranthir",
    githubId: 218008298,
    github: "m1ranthir",
    roles: ["creator", "maintainer"],
  },
]);

export function githubUrl(handle) {
  const normalized = String(handle || "").trim().replace(/^@/, "");
  return normalized ? `https://github.com/${encodeURIComponent(normalized)}` : "";
}

export function getContributors(papers = []) {
  const contributors = new Map();

  const addContributor = ({ id, name, githubId, github, roles = [], paperCount = 0 }) => {
    const normalizedGithub = String(github || "").trim().replace(/^@/, "");
    const key = githubId ? `github-id:${githubId}` : normalizedGithub ? `github:${normalizedGithub.toLowerCase()}` : `id:${id}`;
    if (!key || key === "id:undefined") return;
    const current = contributors.get(key) || {
      id: id || key,
      name: name || normalizedGithub,
      githubId: githubId || null,
      github: normalizedGithub,
      roles: new Set(),
      paperCount: 0,
    };

    roles.forEach((role) => current.roles.add(role));
    current.paperCount += paperCount;
    contributors.set(key, current);
  };

  projectContributors.forEach(addContributor);

  papers.forEach((paper) => {
    const authors = Array.isArray(paper.authors)
      ? paper.authors
      : paper.authorGithub
        ? [
            {
              githubId: paper.authorGithubId,
              github: paper.authorGithub,
              name: paper.authorName || paper.authorGithub,
            },
          ]
        : [];

    authors.forEach((author) => {
      if (!author.githubId && !author.github && !author.githubLogin) return;
      addContributor({
        id: author.id,
        name: author.name || author.displayName || author.github || author.githubLogin,
        githubId: author.githubId,
        github: author.github || author.githubLogin,
        roles: ["researcher", "paperAuthor"],
        paperCount: 1,
      });
    });
  });

  return [...contributors.values()]
    .map((contributor) => ({
      ...contributor,
      roles: [...contributor.roles],
      url: contributor.github ? githubUrl(contributor.github) : "",
    }))
    .sort((a, b) => {
      if (a.id === "m1ranthir") return -1;
      if (b.id === "m1ranthir") return 1;
      return a.name.localeCompare(b.name, "en-US");
    });
}
