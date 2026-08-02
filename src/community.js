// Adicione apenas apoiadores confirmados.
// Nenhuma empresa ou pessoa fictícia deve ser usada para preencher a interface.
export const supporters = Object.freeze({
  // Formato: { name, url, description? }
  companies: Object.freeze([]),

  // Formato: { name, github, url?, description? }
  people: Object.freeze([]),
});

// Informações e perfis oficiais do criador do projeto.
export const creator = Object.freeze({
  name: "m1ranthir",
  image: "./assets/m1ranthir_logo.png",

  socials: Object.freeze({
    github: "https://github.com/m1ranthir",
    linkedin: "https://www.linkedin.com/in/kaikymoura/",
  }),
});

// Contribuidores cadastrados diretamente no projeto.
// Autores de papers publicados são combinados automaticamente
// com esta lista pela função getContributors().
export const projectContributors = Object.freeze([
  Object.freeze({
    id: "m1ranthir",
    name: "m1ranthir",
    githubId: 218008298,
    github: "m1ranthir",
    roles: Object.freeze(["creator", "maintainer"]),
  }),
]);

/**
 * Gera uma URL segura para um perfil do GitHub.
 *
 * @param {string} handle Nome de usuário do GitHub.
 * @returns {string} URL do perfil ou uma string vazia.
 */
export function githubUrl(handle) {
  const normalizedHandle = String(handle ?? "")
    .trim()
    .replace(/^@/, "");

  if (!normalizedHandle) {
    return "";
  }

  return `https://github.com/${encodeURIComponent(normalizedHandle)}`;
}

/**
 * Combina os contribuidores cadastrados com os autores dos papers.
 *
 * Contribuidores que possuem o mesmo GitHub ID são agrupados para impedir
 * duplicações. Quando não existe GitHub ID, o handle do GitHub é utilizado.
 *
 * @param {Array<object>} papers Lista de papers publicados.
 * @returns {Array<object>} Lista consolidada de contribuidores.
 */
export function getContributors(papers = []) {
  const contributors = new Map();

  const addContributor = ({
    id,
    name,
    githubId,
    github,
    roles = [],
    paperCount = 0,
  }) => {
    const normalizedGithub = String(github ?? "")
      .trim()
      .replace(/^@/, "");

    const contributorKey = githubId
      ? `github-id:${githubId}`
      : normalizedGithub
        ? `github:${normalizedGithub.toLowerCase()}`
        : id
          ? `id:${id}`
          : "";

    if (!contributorKey) {
      return;
    }

    const currentContributor = contributors.get(contributorKey) ?? {
      id: id || contributorKey,
      name: name || normalizedGithub || contributorKey,
      githubId: githubId || null,
      github: normalizedGithub,
      roles: new Set(),
      paperCount: 0,
    };

    if (!currentContributor.name && name) {
      currentContributor.name = name;
    }

    if (!currentContributor.github && normalizedGithub) {
      currentContributor.github = normalizedGithub;
    }

    if (!currentContributor.githubId && githubId) {
      currentContributor.githubId = githubId;
    }

    roles.forEach((role) => {
      if (role) {
        currentContributor.roles.add(role);
      }
    });

    currentContributor.paperCount += Number(paperCount) || 0;

    contributors.set(contributorKey, currentContributor);
  };

  projectContributors.forEach((contributor) => {
    addContributor(contributor);
  });

  papers.forEach((paper) => {
    const authors = Array.isArray(paper?.authors)
      ? paper.authors
      : paper?.authorGithub
        ? [
            {
              githubId: paper.authorGithubId,
              github: paper.authorGithub,
              name: paper.authorName || paper.authorGithub,
            },
          ]
        : [];

    authors.forEach((author) => {
      const authorGithub = author?.github || author?.githubLogin;

      if (!author?.githubId && !authorGithub) {
        return;
      }

      addContributor({
        id: author.id,
        name:
          author.name ||
          author.displayName ||
          authorGithub,
        githubId: author.githubId,
        github: authorGithub,
        roles: ["researcher", "paperAuthor"],
        paperCount: 1,
      });
    });
  });

  return [...contributors.values()]
    .map((contributor) => ({
      ...contributor,
      roles: [...contributor.roles],
      url: contributor.github
        ? githubUrl(contributor.github)
        : "",
    }))
    .sort((firstContributor, secondContributor) => {
      if (firstContributor.id === "m1ranthir") {
        return -1;
      }

      if (secondContributor.id === "m1ranthir") {
        return 1;
      }

      return firstContributor.name.localeCompare(
        secondContributor.name,
        "en-US",
      );
    });
}
