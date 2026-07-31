// Papers entram aqui somente depois da revisão e aprovação manual.
export const papers = [
  Object.freeze({
    slug: "welcome-to-hunter-paper",
    title: "Welcome to Hunter Paper",
    excerpt:
      "An introduction to Hunter Paper, its commitment to free knowledge and the kind of security research the community wants to publish.",
    category: "community",
    tags: ["community", "bug-bounty", "open-source"],
    publishedAt: "2026-07-31",
    readMinutes: 2,
    difficulty: "beginner",
    author: "m1ranthir",
    authorName: "m1ranthir",
    authorGithub: "m1ranthir",
    authorGithubId: 218008298,
    initials: "M1",
    sourceUrl: "https://github.com/m1ranthir/hunterpaper/issues/1",
    body: `![Hunter Paper community announcement](https://github.com/user-attachments/assets/94075b1d-e924-418d-8e95-33a9aa56bc7a)

We are a new community dedicated to bringing quality content to audiences of all levels. Whether you are a beginner, a bug bounty enthusiast, or simply someone who loves hacking and breaking things, you’ve come to the right place!

We will never charge for anything; we fully support the free sharing of information.

Expect great content, including new techniques, fresh perspectives, and tools.

All published tools and PoCs will be thoroughly tested.

Want to help? Write something—but please note that we do not accept generic AI-generated content.

Use your brain, and let’s go break some poorly written code! =D

By: Hunter Paper | m1ranthir`,
  }),
];

// Filtros preparados para quando houver conteúdo publicado.
export const topicOrder = [
  "all",
  "community",
  "web",
  "api",
  "auth",
  "server-side",
  "mobile",
  "recon",
];
