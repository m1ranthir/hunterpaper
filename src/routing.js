const PAPER_ID_PATTERN = /^hp-[a-z0-9]{8}$/;
const LEGACY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidPaperId(value) {
  return PAPER_ID_PATTERN.test(String(value || ""));
}

export function canonicalPaperHash(paper) {
  if (!isValidPaperId(paper?.id)) {
    throw new TypeError("Paper id must use the format hp- followed by 8 lowercase letters or digits.");
  }

  return `#paper/${encodeURIComponent(paper.id)}`;
}

export function resolvePaper(papers, rawIdentifier) {
  const identifier = String(rawIdentifier || "");
  const validIdentifier =
    isValidPaperId(identifier) ||
    (identifier.length <= 72 && LEGACY_SLUG_PATTERN.test(identifier));

  if (!validIdentifier) return null;

  const paper = papers.find(
    (entry) => entry.id === identifier || entry.slug === identifier,
  );
  if (!paper) return null;

  const canonicalHash = canonicalPaperHash(paper);
  return Object.freeze({
    paper,
    canonicalHash,
    usedLegacySlug: paper.id !== identifier,
  });
}
