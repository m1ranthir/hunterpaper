export const DEFAULT_LOCALE = "en-US";
export const LOCALE_STORAGE_KEY = "hunter-paper:locale:v1";
export const LOCALE_CHANGE_EVENT = "hunter-paper:localechange";
export const supportedLocales = Object.freeze(["en-US", "pt-BR"]);

export const messages = Object.freeze({
  "en-US": {
    "meta.baseTitle": "Hunter Paper — free bug bounty papers",
    "meta.description": "Hunter Paper — free bug bounty papers for the community.",
    "meta.ogDescription": "Free bug bounty papers for beginners and security researchers.",
    "common.skipToContent": "Skip to content",
    "common.backToPapers": "Back to papers",
    "nav.mainLabel": "Main navigation",
    "nav.homeLabel": "Hunter Paper — home",
    "nav.community": "Community",
    "nav.submit": "Submit paper",
    "nav.about": "About",
    "nav.guidelines": "Guidelines",
    "language.label": "Choose language",
    "footer.message": "Share knowledge with the community for free",
    "footer.createdBy": "Created by",

    "home.recentPapers": "Recent papers",
    "home.description": "Free content for bug bounty beginners and other researchers to learn and share knowledge.",
    "home.paperCount.one": "{count} paper",
    "home.paperCount.other": "{count} papers",
    "home.emptyTitle": "No papers published yet.",
    "home.emptyText": "Submit a paper for review.",
    "home.publishFirst": "Publish the first paper",
    "home.noResultsTitle": "No papers found.",
    "home.noResultsText": "Change the search or filter.",
    "home.searchLabel": "Search papers",
    "home.searchPlaceholder": "search papers",
    "home.filter": "Filter",
    "home.filterTopic": "Filter by topic",
    "home.all": "all",
    "home.filterTag": "Filter by {tag}",
    "home.tagsLabel": "Tags",
    "home.readingTime": "{time} read",

    "paper.publishedOn": "published on",
    "paper.tocAria": "Paper table of contents",
    "paper.tocLabel": "In this paper",
    "paper.copyLink": "Copy link",
    "paper.copySuccess": "Paper link copied.",
    "paper.copyError": "Could not copy the link automatically.",
    "difficulty.beginner": "Beginner",
    "difficulty.intermediate": "Intermediate",
    "difficulty.advanced": "Advanced",

    "githubSubmit.eyebrow": "GitHub submission",
    "githubSubmit.title": "Submit a paper",
    "githubSubmit.description": "Papers are submitted and reviewed manually through GitHub.",
    "githubSubmit.stepOne": "Sign in to GitHub and complete the paper form in Markdown.",
    "githubSubmit.stepTwo": "Add redacted images and confirm responsible disclosure.",
    "githubSubmit.stepThree": "m1ranthir reviews the paper and approves, requests changes or declines it.",
    "githubSubmit.button": "Continue on GitHub",
    "githubSubmit.requirement": "A GitHub account is required.",
    "githubSubmit.publicNotice": "The submission will be public on GitHub. Send only material that is cleared for disclosure and contains no credentials, personal data or active vulnerabilities.",

    "about.title": "About Hunter Paper",
    "about.description": "An open source, nonprofit project created by m1ranthir.",
    "about.objectiveTitle": "Purpose",
    "about.objectiveOne": "Collect bug bounty papers so beginners and researchers can learn from real experiences and share their own knowledge.",
    "about.objectiveTwo": "All content is free for the community. Papers are reviewed before publication to prevent sensitive data exposure and maintain technical quality.",
    "about.participationTitle": "Participation",
    "about.participationText": "Anyone can read for free. Researchers can also submit Markdown papers for review.",
    "about.submit": "Submit a paper",

    "guidelines.title": "Publishing guidelines",
    "guidelines.description": "Rules used when reviewing papers.",
    "guidelines.acceptedTitle": "What we want to read",
    "guidelines.acceptedOne": "discoveries made in authorized programs, labs or environments;",
    "guidelines.acceptedTwo": "methods, automation and lessons another person can apply;",
    "guidelines.acceptedThree": "false positives and paths that helped validate or reject a hypothesis;",
    "guidelines.acceptedFour": "safely demonstrated impact and practical mitigation;",
    "guidelines.acceptedFive": "references and credit for previous work.",
    "guidelines.rejectedTitle": "What will be rejected",
    "guidelines.rejectedOne": "credentials, tokens, PII or real user data;",
    "guidelines.rejectedTwo": "active vulnerabilities without disclosure authorization;",
    "guidelines.rejectedThree": "attacks against out-of-scope systems;",
    "guidelines.rejectedFour": "copied, promotional or technically unsupported content;",
    "guidelines.rejectedFive": "steps whose primary purpose is to harm systems.",
    "guidelines.reviewTitle": "How review works",
    "guidelines.reviewOne": "The paper is sent to the review queue.",
    "guidelines.reviewTwo": "The author may receive a change request.",
    "guidelines.reviewThree": "After approval, the paper appears on the home page.",

    "community.title": "Community",
    "community.description": "People and organizations that support or contribute to Hunter Paper.",
    "community.createdByTitle": "Created by",
    "community.createdByDescription": "Independent, open source and nonprofit project for the bug bounty community.",
    "community.creatorImageAlt": "m1ranthir logo",
    "community.socialPending": "{network} link will be added later",
    "community.supportersTitle": "Supporters",
    "community.supportersDescription": "Companies and people who help maintain the project.",
    "community.companies": "Companies",
    "community.people": "People",
    "community.noSupporters": "No supporters listed yet.",
    "community.contributorsTitle": "Contributors",
    "community.contributorsDescription": "Project contributors and authors of published papers.",
    "community.noContributors": "No contributors listed yet.",
    "community.visit": "Visit",
    "community.visitWebsite": "Visit {name}'s website",
    "community.viewGithub": "View @{handle} on GitHub",
    "community.role.creator": "Creator",
    "community.role.maintainer": "Maintainer",
    "community.role.code": "Code contributor",
    "community.role.researcher": "Researcher",
    "community.role.paperAuthor": "Paper author",
    "community.paperCount.one": "{count} published paper",
    "community.paperCount.other": "{count} published papers",

    "notFound.title": "This page does not exist.",
    "notFound.description": "The paper may have moved or may not be published yet.",
    "notFound.back": "Back to the archive",
    "title.submit": "Submit paper",
    "title.about": "About",
    "title.guidelines": "Guidelines",
    "title.community": "Community",
    "title.notFound": "Page not found",
  },

  "pt-BR": {
    "meta.baseTitle": "Hunter Paper — papers gratuitos de bug bounty",
    "meta.description": "Hunter Paper — papers gratuitos de bug bounty para a comunidade.",
    "meta.ogDescription": "Papers gratuitos de bug bounty para iniciantes e pesquisadores.",
    "common.skipToContent": "Pular para o conteúdo",
    "common.backToPapers": "Voltar aos papers",
    "nav.mainLabel": "Navegação principal",
    "nav.homeLabel": "Hunter Paper — página inicial",
    "nav.community": "Comunidade",
    "nav.submit": "Submeter paper",
    "nav.about": "Sobre",
    "nav.guidelines": "Diretrizes",
    "language.label": "Selecionar idioma",
    "footer.message": "Compartilhe conhecimento com a comunidade gratuitamente",
    "footer.createdBy": "Criado por",

    "home.recentPapers": "Papers recentes",
    "home.description": "Conteúdo gratuito para iniciantes em bug bounty e outros pesquisadores aprenderem e compartilharem conhecimento.",
    "home.paperCount.one": "{count} paper",
    "home.paperCount.other": "{count} papers",
    "home.emptyTitle": "Nenhum paper publicado ainda.",
    "home.emptyText": "Envie um paper para revisão.",
    "home.publishFirst": "Publicar o primeiro paper",
    "home.noResultsTitle": "Nenhum paper encontrado.",
    "home.noResultsText": "Altere a busca ou o filtro.",
    "home.searchLabel": "Buscar papers",
    "home.searchPlaceholder": "buscar papers",
    "home.filter": "Filtrar",
    "home.filterTopic": "Filtrar por tópico",
    "home.all": "todos",
    "home.filterTag": "Filtrar por {tag}",
    "home.tagsLabel": "Tags",
    "home.readingTime": "{time} de leitura",

    "paper.publishedOn": "publicado em",
    "paper.tocAria": "Índice do paper",
    "paper.tocLabel": "Neste paper",
    "paper.copyLink": "Copiar link",
    "paper.copySuccess": "Link do paper copiado.",
    "paper.copyError": "Não foi possível copiar o link automaticamente.",
    "difficulty.beginner": "Iniciante",
    "difficulty.intermediate": "Intermediário",
    "difficulty.advanced": "Avançado",

    "githubSubmit.eyebrow": "Submissão pelo GitHub",
    "githubSubmit.title": "Submeter um paper",
    "githubSubmit.description": "Os papers são enviados e revisados manualmente pelo GitHub.",
    "githubSubmit.stepOne": "Entre no GitHub e preencha o formulário do paper em Markdown.",
    "githubSubmit.stepTwo": "Adicione imagens redigidas e confirme a divulgação responsável.",
    "githubSubmit.stepThree": "m1ranthir revisa o paper e aprova, solicita mudanças ou recusa a submissão.",
    "githubSubmit.button": "Continuar no GitHub",
    "githubSubmit.requirement": "É necessário ter uma conta no GitHub.",
    "githubSubmit.publicNotice": "A submissão ficará pública no GitHub. Envie somente material liberado para divulgação e sem credenciais, dados pessoais ou vulnerabilidades ativas.",

    "about.title": "Sobre o Hunter Paper",
    "about.description": "Projeto open source e sem fins lucrativos criado por m1ranthir.",
    "about.objectiveTitle": "Objetivo",
    "about.objectiveOne": "Reunir papers de bug bounty para iniciantes e pesquisadores aprenderem com experiências reais e compartilharem o próprio conhecimento.",
    "about.objectiveTwo": "Todo o conteúdo é gratuito para a comunidade. Papers são revisados antes da publicação para evitar dados sensíveis e manter a qualidade técnica.",
    "about.participationTitle": "Participação",
    "about.participationText": "Qualquer pessoa pode ler gratuitamente. Pesquisadores também podem enviar papers em Markdown para revisão.",
    "about.submit": "Publicar um paper",

    "guidelines.title": "Diretrizes para publicação",
    "guidelines.description": "Regras usadas na revisão dos papers.",
    "guidelines.acceptedTitle": "O que queremos ler",
    "guidelines.acceptedOne": "descobertas feitas em programas, laboratórios ou ambientes autorizados;",
    "guidelines.acceptedTwo": "metodologias, automações e aprendizados que outra pessoa consiga aplicar;",
    "guidelines.acceptedThree": "falsos positivos e caminhos que ajudaram a validar ou descartar a hipótese;",
    "guidelines.acceptedFour": "impacto demonstrado com segurança e mitigação prática;",
    "guidelines.acceptedFive": "referências e crédito para trabalhos anteriores.",
    "guidelines.rejectedTitle": "O que será recusado",
    "guidelines.rejectedOne": "credenciais, tokens, PII ou dados reais de usuários;",
    "guidelines.rejectedTwo": "vulnerabilidades ativas sem autorização de divulgação;",
    "guidelines.rejectedThree": "ataques contra sistemas fora de escopo;",
    "guidelines.rejectedFour": "conteúdo copiado, promocional ou sem evidência técnica;",
    "guidelines.rejectedFive": "passos cujo objetivo principal seja causar dano.",
    "guidelines.reviewTitle": "Como a revisão funciona",
    "guidelines.reviewOne": "O paper é enviado para a fila de revisão.",
    "guidelines.reviewTwo": "O autor pode receber um pedido de alteração.",
    "guidelines.reviewThree": "Depois da aprovação, o paper aparece na página inicial.",

    "community.title": "Comunidade",
    "community.description": "Pessoas e organizações que apoiam ou contribuem com o Hunter Paper.",
    "community.createdByTitle": "Criado por",
    "community.createdByDescription": "Projeto independente, open source e sem fins lucrativos para a comunidade de bug bounty.",
    "community.creatorImageAlt": "Logo de m1ranthir",
    "community.socialPending": "O link do {network} será adicionado depois",
    "community.supportersTitle": "Apoiadores",
    "community.supportersDescription": "Empresas e pessoas que ajudam a manter o projeto.",
    "community.companies": "Empresas",
    "community.people": "Pessoas",
    "community.noSupporters": "Nenhum apoiador listado ainda.",
    "community.contributorsTitle": "Contribuidores",
    "community.contributorsDescription": "Contribuidores do projeto e autores de papers publicados.",
    "community.noContributors": "Nenhum contribuidor listado ainda.",
    "community.visit": "Visitar",
    "community.visitWebsite": "Visitar o site de {name}",
    "community.viewGithub": "Ver @{handle} no GitHub",
    "community.role.creator": "Criador",
    "community.role.maintainer": "Mantenedor",
    "community.role.code": "Contribuidor de código",
    "community.role.researcher": "Pesquisador",
    "community.role.paperAuthor": "Autor de paper",
    "community.paperCount.one": "{count} paper publicado",
    "community.paperCount.other": "{count} papers publicados",

    "notFound.title": "Esse caminho não existe.",
    "notFound.description": "O paper pode ter mudado de endereço ou ainda não foi publicado.",
    "notFound.back": "Voltar ao arquivo",
    "title.submit": "Submeter paper",
    "title.about": "Sobre",
    "title.guidelines": "Diretrizes",
    "title.community": "Comunidade",
    "title.notFound": "Página não encontrada",
  },
});

let activeLocale;

function normalizeLocale(locale) {
  return supportedLocales.includes(locale) ? locale : DEFAULT_LOCALE;
}

export function getLocale() {
  if (activeLocale) return activeLocale;
  try {
    activeLocale = normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    activeLocale = DEFAULT_LOCALE;
  }
  return activeLocale;
}

export function setLocale(locale) {
  activeLocale = normalizeLocale(locale);
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, activeLocale);
  } catch {
    // The interface still changes if storage is unavailable.
  }

  if (typeof document !== "undefined") document.documentElement.lang = activeLocale;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(LOCALE_CHANGE_EVENT, { detail: { locale: activeLocale } }));
  }
  return activeLocale;
}

export function t(key, params = {}, locale = getLocale()) {
  const dictionary = messages[normalizeLocale(locale)] || messages[DEFAULT_LOCALE];
  const template = dictionary[key] ?? messages[DEFAULT_LOCALE][key] ?? key;
  return String(template).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : `{${name}}`,
  );
}

export function plural(key, count, params = {}, locale = getLocale()) {
  const category = new Intl.PluralRules(normalizeLocale(locale)).select(Number(count));
  const suffix = category === "one" ? "one" : "other";
  return t(`${key}.${suffix}`, { ...params, count }, locale);
}

export function formatDate(value, options = {}, locale = getLocale()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "");
  return new Intl.DateTimeFormat(normalizeLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(date);
}

export function formatDateTime(value, options = {}, locale = getLocale()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "");
  return new Intl.DateTimeFormat(normalizeLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
    ...options,
  }).format(date);
}
