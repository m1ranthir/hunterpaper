const LOCAL_BASE_URL = new URL("https://hunterpaper.invalid/");
const URL_SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const CONTROL_OR_SPACE = /[\u0000-\u0020\u007f]/;
const SAFE_FRAGMENT = /^#[a-z0-9][a-z0-9_-]{0,127}$/i;

function isAllowedGithubImage(url) {
  const host = url.hostname.toLowerCase();

  if (host === "github.com") {
    return url.pathname.startsWith("/user-attachments/assets/");
  }

  return (
    host === "user-images.githubusercontent.com" ||
    host.endsWith(".githubusercontent.com")
  );
}

function sanitizeRelativeUrl(value) {
  if (value.startsWith("//") || value.includes("\\")) return "";
  if (value.startsWith("#")) return SAFE_FRAGMENT.test(value) ? value : "";

  try {
    const url = new URL(value, LOCAL_BASE_URL);
    return url.origin === LOCAL_BASE_URL.origin ? value : "";
  } catch {
    return "";
  }
}

export function sanitizeContentUrl(rawValue, { image = false } = {}) {
  const value = String(rawValue ?? "").trim();
  if (!value || CONTROL_OR_SPACE.test(value)) return "";

  if (!URL_SCHEME.test(value)) {
    return sanitizeRelativeUrl(value);
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    return "";
  }

  if (url.username || url.password) return "";
  if (!image && url.protocol === "mailto:") return url.href;
  if (url.protocol !== "https:") return "";
  if (image && !isAllowedGithubImage(url)) return "";

  return url.href;
}

export function externalUrl(rawValue) {
  const value = sanitizeContentUrl(rawValue);
  if (!value) return "";

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}
