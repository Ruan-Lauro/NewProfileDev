export const REFERENCE_TYPES = [
  "Artigo",
  "Vídeo",
  "Documentação",
  "Curso",
  "Livro",
  "Exercício",
  "Ferramenta",
  "Outro",
];

export const formatDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatSize = (bytes) => {
  const n = Number(bytes);
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
};

export const fileExt = (url = "") => (url.split("?")[0].split(".").pop() || "").toUpperCase().slice(0, 4);

export const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

/** Navegação sem recarregar a página entre /artigos e /artigos/:slug. */
export const navigate = (to) => {
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
};

export const onLinkClick = (to) => (e) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  navigate(to);
};

export const storage = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* modo privado / storage bloqueado */
    }
  },
};
