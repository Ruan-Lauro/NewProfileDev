const json = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);
  return data;
};

export const api = {
  list: () => fetch("/__admin/articles").then(json),
  get: (slug) => fetch(`/__admin/articles/${slug}`).then(json),
  save: (previousSlug, article) =>
    fetch(`/__admin/articles/${previousSlug || "new"}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article),
    }).then(json),
  remove: (slug) => fetch(`/__admin/articles/${slug}`, { method: "DELETE" }).then(json),
  upload: (file) =>
    fetch("/__admin/upload", {
      method: "POST",
      headers: { "x-file-name": encodeURIComponent(file.name), "Content-Type": "application/octet-stream" },
      body: file,
    }).then(json),
};

/** Abre o seletor de arquivos do sistema e devolve o arquivo escolhido. */
export const pickFile = (accept = "") =>
  new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = () => resolve(input.files?.[0] || null);
    input.click();
  });

// GitHub recusa arquivos > 100 MB; acima de ~25 MB o repositório começa a pesar.
export const LARGE_FILE = 25 * 1024 * 1024;
