import { config } from "./config.js";
import { creator, getContributors, githubUrl, supporters } from "./community.js";
import { papers, topicOrder } from "./data.js";
import {
  formatDate,
  getLocale,
  LOCALE_CHANGE_EVENT,
  plural,
  setLocale,
  t,
} from "./i18n.js";
import { escapeHtml, extractHeadings, renderMarkdown } from "./markdown.js";

const app = document.querySelector("#app");
const masthead = document.querySelector(".masthead");
const toastRegion = document.querySelector("#toast-region");

const state = {
  query: "",
  topic: "all",
};

function routeParts() {
  return location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
}

function setDocumentTitle(title) {
  document.title = title ? `${title} — Hunter Paper` : t("meta.baseTitle");
}

function setCurrentNavigation(route) {
  document.querySelectorAll(".site-header a, .footer-inner a").forEach((link) =>
    link.removeAttribute("aria-current"),
  );
  const current = document.querySelector(`a[href="#${route}"]`);
  current?.setAttribute("aria-current", "page");
}

function applyStaticTranslations() {
  document.documentElement.lang = getLocale();
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  const languageSwitcher = document.querySelector("#language-switcher");
  if (languageSwitcher) languageSwitcher.value = getLocale();

  const description = document.querySelector('meta[name="description"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (description) description.content = t("meta.description");
  if (ogDescription) ogDescription.content = t("meta.ogDescription");
  if (ogLocale) ogLocale.content = getLocale() === "pt-BR" ? "pt_BR" : "en_US";
}

function showToast(message, tone = "success") {
  const toast = document.createElement("div");
  toast.className = `toast${tone === "error" ? " toast-error" : ""}`;
  toast.setAttribute("role", tone === "error" ? "alert" : "status");
  toast.textContent = message;
  toastRegion.append(toast);

  window.setTimeout(() => toast.remove(), 4200);
}

function formatIndex(index) {
  return String(index + 1).padStart(2, "0");
}

function normalizeDifficulty(value) {
  const aliases = {
    iniciante: "beginner",
    beginner: "beginner",
    "intermediário": "intermediate",
    intermediario: "intermediate",
    intermediate: "intermediate",
    "avançado": "advanced",
    avancado: "advanced",
    advanced: "advanced",
  };
  return aliases[value] || "intermediate";
}

function paperRow(paper, index) {
  const tags = paper.tags
    .slice(0, 3)
    .map(
      (tag) =>
        `<button class="tag" type="button" data-topic="${escapeHtml(tag)}" aria-label="${escapeHtml(t("home.filterTag", { tag }))}">#${escapeHtml(tag)}</button>`,
    )
    .join("");

  return `
    <article class="paper-row">
      <span class="paper-index" aria-hidden="true">${formatIndex(index)}</span>
      <div>
        <div class="paper-meta">
          <span class="category">${escapeHtml(paper.category)}</span>
          <span class="separator" aria-hidden="true"></span>
          <time datetime="${paper.publishedAt}">${escapeHtml(paper.publishedAt ? formatDate(paper.publishedAt) : paper.publishedLabel || "")}</time>
          <span class="separator" aria-hidden="true"></span>
          <span>${escapeHtml(t("home.readingTime", { time: paper.readTime || `${paper.readMinutes || 0} min` }))}</span>
        </div>
        <h2 class="paper-title"><a href="#paper/${paper.slug}">${escapeHtml(paper.title)}</a></h2>
        <p class="paper-excerpt">${escapeHtml(paper.excerpt)}</p>
        <div class="paper-byline">
          <span class="author">${escapeHtml(paper.author)}</span>
          <div class="tag-list" aria-label="${escapeHtml(t("home.tagsLabel"))}">${tags}</div>
        </div>
      </div>
      <span class="paper-arrow" aria-hidden="true">↗</span>
    </article>`;
}

function filteredPapers() {
  const normalizedQuery = state.query.trim().toLocaleLowerCase(getLocale());

  return papers.filter((paper) => {
    const matchesTopic =
      state.topic === "all" ||
      paper.category === state.topic ||
      paper.tags.includes(state.topic);
    const haystack = [paper.title, paper.excerpt, paper.author, paper.category, ...paper.tags]
      .join(" ")
      .toLocaleLowerCase(getLocale());
    return matchesTopic && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
}

function renderFeed() {
  const feed = document.querySelector("#paper-feed");
  const count = document.querySelector("#paper-count");
  const matches = filteredPapers();
  if (!feed) return;

  if (count) {
    count.textContent = plural("home.paperCount", matches.length, {
      count: String(matches.length).padStart(2, "0"),
    });
  }

  if (papers.length === 0) {
    feed.innerHTML = `
      <div class="empty-state empty-archive">
        <strong>${t("home.emptyTitle")}</strong>
        <p>${t("home.emptyText")}</p>
        <a class="button button-primary" href="#submit">${t("home.publishFirst")}</a>
      </div>`;
  } else {
    feed.innerHTML = matches.length
      ? matches.map(paperRow).join("")
      : `<div class="empty-state"><strong>${t("home.noResultsTitle")}</strong><p>${t("home.noResultsText")}</p></div>`;
  }

  document.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      state.topic = button.dataset.topic;
      updateTopicButtons();
      renderFeed();
      document.querySelector("#paper-search")?.focus();
    });
  });
}

function updateTopicButtons() {
  document.querySelectorAll(".topic-filter").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === state.topic));
  });
}

function renderHome() {
  const hasPapers = papers.length > 0;
  const filters = hasPapers
    ? topicOrder
        .map(
          (topic) => `
            <button
              class="topic-filter"
              type="button"
              data-filter="${topic}"
              aria-pressed="${String(topic === state.topic)}"
            >${topic === "all" ? t("home.all") : `#${topic}`}</button>`,
        )
        .join("")
    : "";

  app.className = "shell home-shell";
  app.innerHTML = `
    <section class="home-feed" aria-labelledby="recent-heading">
      <div class="section-heading home-heading">
        <div>
          <h1 id="recent-heading">${t("home.recentPapers")}</h1>
          <p>${t("home.description")}</p>
        </div>
        ${hasPapers ? '<span class="paper-count" id="paper-count"></span>' : ""}
      </div>

      ${
        hasPapers
          ? `<div class="feed-tools">
              <label class="search-box">
                <span class="sr-only">${t("home.searchLabel")}</span>
                <svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17">
                  <circle cx="8.5" cy="8.5" r="5.5"></circle>
                  <path d="m12.5 12.5 4 4"></path>
                </svg>
                <input id="paper-search" type="search" placeholder="${t("home.searchPlaceholder")}" value="${escapeHtml(state.query)}" autocomplete="off">
                <span class="search-shortcut" aria-hidden="true">/</span>
              </label>
              <button class="button filter-button" id="toggle-filters" type="button" aria-expanded="true" aria-controls="topic-filters">${t("home.filter")}</button>
            </div>
            <div class="topic-filters" id="topic-filters" aria-label="${t("home.filterTopic")}">${filters}</div>`
          : ""
      }
      <div class="paper-feed" id="paper-feed"></div>
    </section>`;

  renderFeed();

  const search = document.querySelector("#paper-search");
  search?.addEventListener("input", () => {
    state.query = search.value;
    renderFeed();
  });

  document.querySelectorAll(".topic-filter").forEach((button) => {
    button.addEventListener("click", () => {
      state.topic = button.dataset.filter;
      updateTopicButtons();
      renderFeed();
    });
  });

  document.querySelector("#toggle-filters")?.addEventListener("click", (event) => {
    const filterList = document.querySelector("#topic-filters");
    const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
    event.currentTarget.setAttribute("aria-expanded", String(!expanded));
    filterList.hidden = expanded;
  });

  setDocumentTitle("");
}

function renderPaper(slug) {
  const paper = papers.find((item) => item.slug === slug);
  if (!paper) {
    renderNotFound();
    return;
  }

  const headings = extractHeadings(paper.body);
  const toc = headings
    .filter((heading) => heading.depth === 2)
    .map((heading) => `<li><a href="#${heading.id}" data-anchor-link>${escapeHtml(heading.text)}</a></li>`)
    .join("");
  const tags = paper.tags.map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`).join("");

  app.className = "shell paper-shell";
  app.innerHTML = `
    <a class="back-link" href="#home"><span aria-hidden="true">←</span> ${t("common.backToPapers")}</a>

    <article>
      <header class="paper-header">
        <div class="paper-meta">
          <span class="category">${escapeHtml(paper.category)}</span>
          <span class="separator" aria-hidden="true"></span>
          <span>${escapeHtml(t(`difficulty.${normalizeDifficulty(paper.difficulty)}`))}</span>
          <span class="separator" aria-hidden="true"></span>
          <span>${escapeHtml(t("home.readingTime", { time: paper.readTime || `${paper.readMinutes || 0} min` }))}</span>
        </div>
        <h1>${escapeHtml(paper.title)}</h1>
        <p class="lead">${escapeHtml(paper.excerpt)}</p>
        <div class="paper-author-card">
          <span class="author-avatar" aria-hidden="true">${escapeHtml(paper.initials)}</span>
          <div>
            <strong>${escapeHtml(paper.author)}</strong>
            <span>${t("paper.publishedOn")} <time datetime="${paper.publishedAt}">${escapeHtml(paper.publishedAt ? formatDate(paper.publishedAt) : paper.publishedLabel || "")}</time></span>
          </div>
        </div>
        <div class="tag-list" style="margin-top: 18px">${tags}</div>
      </header>

      <div class="paper-layout">
        <div class="paper-content">${renderMarkdown(paper.body)}</div>
        <aside class="article-actions" aria-label="${t("paper.tocAria")}">
          <p class="toc-label">${t("paper.tocLabel")}</p>
          <ol class="table-of-contents">${toc}</ol>
          <button class="button share-button" type="button" id="copy-paper-link">${t("paper.copyLink")}</button>
        </aside>
      </div>
    </article>`;

  document.querySelectorAll("[data-anchor-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.getElementById(link.getAttribute("href").slice(1))?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelector("#copy-paper-link")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      showToast(t("paper.copySuccess"));
    } catch {
      showToast(t("paper.copyError"), "error");
    }
  });

  setDocumentTitle(paper.title);
}

function renderSubmit() {
  const submissionUrl =
    externalUrl(config.paperSubmissionUrl) ||
    `${config.githubRepository}/issues`;

  app.className = "shell github-submit-shell";
  app.innerHTML = `
    <section class="github-submit-page" aria-labelledby="github-submit-title">
      <p class="eyebrow">${t("githubSubmit.eyebrow")}</p>
      <h1 class="page-title" id="github-submit-title">${t("githubSubmit.title")}</h1>
      <p class="page-description">${t("githubSubmit.description")}</p>

      <ol class="github-submit-steps">
        <li><span aria-hidden="true">01</span><p>${t("githubSubmit.stepOne")}</p></li>
        <li><span aria-hidden="true">02</span><p>${t("githubSubmit.stepTwo")}</p></li>
        <li><span aria-hidden="true">03</span><p>${t("githubSubmit.stepThree")}</p></li>
      </ol>

      <div class="github-submit-actions">
        <a class="button button-primary" href="${escapeHtml(submissionUrl)}" target="_blank" rel="noopener noreferrer">
          ${t("githubSubmit.button")} <span aria-hidden="true">↗</span>
        </a>
        <span>${t("githubSubmit.requirement")}</span>
      </div>

      <p class="github-public-notice">${t("githubSubmit.publicNotice")}</p>
    </section>`;

  setDocumentTitle(t("title.submit"));
}

function renderAbout() {
  app.className = "shell prose-page prose-page-single";
  app.innerHTML = `
    <div>
      <h1 class="page-title">${t("about.title")}</h1>
      <p class="page-description">${t("about.description")}</p>

      <section class="prose-section">
        <h2>${t("about.objectiveTitle")}</h2>
        <p>${t("about.objectiveOne")}</p>
        <p>${t("about.objectiveTwo")}</p>
      </section>

      <section class="prose-section">
        <h2>${t("about.participationTitle")}</h2>
        <p>${t("about.participationText")}</p>
        <a class="button button-primary" href="#submit">${t("about.submit")}</a>
      </section>
    </div>`;
  setDocumentTitle(t("title.about"));
}

function renderGuidelines() {
  app.className = "shell prose-page prose-page-single";
  app.innerHTML = `
    <div>
      <h1 class="page-title">${t("guidelines.title")}</h1>
      <p class="page-description">${t("guidelines.description")}</p>

      <section class="prose-section">
        <h2>${t("guidelines.acceptedTitle")}</h2>
        <ul>
          <li>${t("guidelines.acceptedOne")}</li>
          <li>${t("guidelines.acceptedTwo")}</li>
          <li>${t("guidelines.acceptedThree")}</li>
          <li>${t("guidelines.acceptedFour")}</li>
          <li>${t("guidelines.acceptedFive")}</li>
        </ul>
      </section>

      <section class="prose-section">
        <h2>${t("guidelines.rejectedTitle")}</h2>
        <ul>
          <li>${t("guidelines.rejectedOne")}</li>
          <li>${t("guidelines.rejectedTwo")}</li>
          <li>${t("guidelines.rejectedThree")}</li>
          <li>${t("guidelines.rejectedFour")}</li>
          <li>${t("guidelines.rejectedFive")}</li>
        </ul>
      </section>

      <section class="prose-section">
        <h2>${t("guidelines.reviewTitle")}</h2>
        <ol>
          <li>${t("guidelines.reviewOne")}</li>
          <li>${t("guidelines.reviewTwo")}</li>
          <li>${t("guidelines.reviewThree")}</li>
        </ol>
      </section>
      <a class="button button-primary" href="#submit" style="margin-top: 28px">${t("about.submit")}</a>
    </div>`;
  setDocumentTitle(t("title.guidelines"));
}

function externalUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function renderSocialButton(network, value) {
  const url = externalUrl(value);
  if (!url) {
    const pendingLabel = t("community.socialPending", { network });
    return `<button class="social-button is-disabled" type="button" disabled title="${escapeHtml(pendingLabel)}">${network}</button>`;
  }

  return `<a class="social-button" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${network}<span aria-hidden="true">↗</span></a>`;
}

function renderSupporterGroup(titleKey, entries) {
  if (!entries.length) return "";

  const rows = entries
    .filter((supporter) => supporter?.name)
    .map((supporter) => {
      const github = String(supporter.github || "").replace(/^@/, "");
      const url = externalUrl(supporter.url || supporter.website || githubUrl(github));
      const linkLabel = github
        ? t("community.viewGithub", { handle: github })
        : t("community.visitWebsite", { name: supporter.name });
      const visibleLink = github ? `@${escapeHtml(github)}` : t("community.visit");

      return `
        <li class="community-row">
          <div>
            <p class="community-name">${escapeHtml(supporter.name)}</p>
            ${supporter.description ? `<span class="community-meta">${escapeHtml(supporter.description)}</span>` : ""}
          </div>
          ${url ? `<a class="community-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(linkLabel)}">${visibleLink}<span aria-hidden="true">↗</span></a>` : ""}
        </li>`;
    })
    .join("");

  if (!rows) return "";
  return `
    <section>
      <h3>${t(titleKey)}</h3>
      <ul class="supporter-list">${rows}</ul>
    </section>`;
}

function renderCommunity() {
  const supporterGroups = [
    renderSupporterGroup("community.companies", supporters.companies),
    renderSupporterGroup("community.people", supporters.people),
  ].filter(Boolean);
  const contributors = getContributors(papers);
  const contributorRows = contributors
    .map((contributor) => {
      const roles = contributor.roles
        .map((role) => `<li>${t(`community.role.${role}`)}</li>`)
        .join("");
      const paperCount = contributor.paperCount
        ? `<span class="community-meta">${plural("community.paperCount", contributor.paperCount)}</span>`
        : "";
      const profileUrl = externalUrl(contributor.url);
      const profileLink = profileUrl
        ? `<a class="community-link" href="${escapeHtml(profileUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(t("community.viewGithub", { handle: contributor.github }))}">@${escapeHtml(contributor.github)}<span aria-hidden="true">↗</span></a>`
        : "";

      return `
        <li class="contributor-row">
          <div>
            <p class="community-name">${escapeHtml(contributor.name)}</p>
            ${roles ? `<ul class="role-list">${roles}</ul>` : ""}
            ${paperCount}
          </div>
          ${profileLink}
        </li>`;
    })
    .join("");

  app.className = "shell community-page";
  app.innerHTML = `
    <header class="community-intro">
      <h1 class="page-title">${t("community.title")}</h1>
      <p class="page-description">${t("community.description")}</p>
    </header>

    <section class="creator-profile" aria-labelledby="creator-title">
      <div class="creator-logo">
        <img src="${escapeHtml(creator.image)}" alt="${t("community.creatorImageAlt")}" width="104" height="104">
      </div>
      <div class="creator-copy">
        <h2 id="creator-title">${t("community.createdByTitle")}</h2>
        <strong>${escapeHtml(creator.name)}</strong>
        <p>${t("community.createdByDescription")}</p>
      </div>
      <div class="creator-socials" aria-label="${t("community.createdByTitle")}">
        ${renderSocialButton("GitHub", creator.socials.github)}
        ${renderSocialButton("LinkedIn", creator.socials.linkedin)}
      </div>
    </section>

    <section class="community-section" aria-labelledby="supporters-title">
      <div class="community-section-header">
        <h2 id="supporters-title">${t("community.supportersTitle")}</h2>
        <p>${t("community.supportersDescription")}</p>
      </div>
      ${
        supporterGroups.length
          ? `<div class="supporter-groups">${supporterGroups.join("")}</div>`
          : `<div class="community-empty"><p>${t("community.noSupporters")}</p></div>`
      }
    </section>

    <section class="community-section" aria-labelledby="contributors-title">
      <div class="community-section-header">
        <h2 id="contributors-title">${t("community.contributorsTitle")}</h2>
        <p>${t("community.contributorsDescription")}</p>
      </div>
      ${
        contributorRows
          ? `<ul class="contributor-list">${contributorRows}</ul>`
          : `<div class="community-empty"><p>${t("community.noContributors")}</p></div>`
      }
    </section>`;

  setDocumentTitle(t("title.community"));
}

function renderNotFound() {
  app.className = "shell submission-success";
  app.innerHTML = `
    <h1 class="page-title">${t("notFound.title")}</h1>
    <p class="page-description">${t("notFound.description")}</p>
    <a class="button button-primary" href="#home" style="margin-top: 24px">${t("notFound.back")}</a>`;
  setDocumentTitle(t("title.notFound"));
}

function renderRoute({ preserveScroll = false } = {}) {
  const [route = "home", value] = routeParts();
  const knownTopLevel = ["home", "paper", "submit", "community", "about", "guidelines"];
  const navRoute = knownTopLevel.includes(route) ? route : "";
  setCurrentNavigation(navRoute);
  masthead.classList.toggle("is-condensed", route !== "home");

  if (route === "home") renderHome();
  else if (route === "paper") renderPaper(value);
  else if (route === "submit" && !value) renderSubmit();
  else if (route === "community") renderCommunity();
  else if (route === "about") renderAbout();
  else if (route === "guidelines") renderGuidelines();
  else renderNotFound();

  if (!preserveScroll) window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", () => {
  renderRoute();
});

document.querySelector("#language-switcher")?.addEventListener("change", (event) => {
  setLocale(event.currentTarget.value);
});

window.addEventListener(LOCALE_CHANGE_EVENT, () => {
  applyStaticTranslations();
  renderRoute({ preserveScroll: true });
});

window.addEventListener("keydown", (event) => {
  const interactive = /^(INPUT|TEXTAREA|SELECT)$/i.test(document.activeElement?.tagName || "");
  if (event.key === "/" && !interactive && routeParts()[0] === "home") {
    event.preventDefault();
    document.querySelector("#paper-search")?.focus();
  }
});

if (!location.hash) history.replaceState(null, "", "#home");
applyStaticTranslations();
renderRoute();
