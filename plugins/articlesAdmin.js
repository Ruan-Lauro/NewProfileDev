/**
 * Plugin Vite que só roda em `npm run dev`.
 * Expõe uma pequena API local (/__admin/*) usada pelo editor em /admin para
 * salvar artigos como JSON e enviar arquivos para public/uploads.
 * Nada disso vai para o build de produção: os artigos viram arquivos estáticos.
 */
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import process from "node:process";
import { Buffer } from "node:buffer";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "public", "content", "articles");
const INDEX_FILE = path.join(ROOT, "public", "content", "index.json");
const UPLOADS_DIR = path.join(ROOT, "public", "uploads");

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugify = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const stripHtml = (html = "") => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const readingTime = (html) => {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const send = (res, status, data) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
};

const readBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
};

const articlePath = (slug) => path.join(ARTICLES_DIR, `${slug}.json`);

async function readAllArticles() {
  await fsp.mkdir(ARTICLES_DIR, { recursive: true });
  const files = (await fsp.readdir(ARTICLES_DIR)).filter((f) => f.endsWith(".json"));
  const articles = await Promise.all(
    files.map(async (f) => JSON.parse(await fsp.readFile(path.join(ARTICLES_DIR, f), "utf8")))
  );
  return articles.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

/** index.json: só metadados dos artigos publicados (a listagem pública fica leve). */
async function rebuildIndex() {
  const articles = await readAllArticles();
  const index = articles
    .filter((a) => !a.draft)
    .map(({ slug, title, summary, cover, tags, date, readingTime }) => ({
      slug,
      title,
      summary,
      cover,
      tags,
      date,
      readingTime,
    }));
  await fsp.writeFile(INDEX_FILE, JSON.stringify(index, null, 2) + "\n");
}

function normalizeArticle(input) {
  const slug = slugify(input.slug || input.title);
  if (!slug || !SLUG_RE.test(slug)) throw new Error("Slug inválido. Preencha o título.");
  if (!input.title?.trim()) throw new Error("O título é obrigatório.");

  const clean = (list, keys) =>
    (Array.isArray(list) ? list : [])
      .map((item) => Object.fromEntries(keys.map((k) => [k, String(item?.[k] ?? "").trim()])))
      .filter((item) => item.url);

  return {
    slug,
    title: input.title.trim(),
    summary: (input.summary || "").trim(),
    cover: (input.cover || "").trim(),
    tags: (Array.isArray(input.tags) ? input.tags : [])
      .map((t) => String(t).trim())
      .filter(Boolean),
    date: input.date || new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString(),
    draft: Boolean(input.draft),
    readingTime: readingTime(input.content),
    content: input.content || "",
    references: clean(input.references, ["title", "url", "type", "note"]),
    attachments: clean(input.attachments, ["name", "url", "size"]),
  };
}

function safeFileName(original = "arquivo") {
  const ext = path.extname(original).toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 10);
  const base = slugify(path.basename(original, path.extname(original))) || "arquivo";
  return `${base}-${crypto.randomBytes(3).toString("hex")}${ext}`;
}

async function handle(req, res, url) {
  const parts = url.pathname.replace(/^\/__admin\/?/, "").split("/").filter(Boolean);

  // GET /__admin/articles
  if (parts[0] === "articles" && parts.length === 1 && req.method === "GET") {
    const articles = await readAllArticles();
    return send(
      res,
      200,
      articles.map(({ slug, title, date, draft, updatedAt }) => ({ slug, title, date, draft, updatedAt }))
    );
  }

  if (parts[0] === "articles" && parts.length === 2) {
    const slug = parts[1];
    if (!SLUG_RE.test(slug)) return send(res, 400, { error: "Slug inválido." });
    const file = articlePath(slug);

    if (req.method === "GET") {
      if (!fs.existsSync(file)) return send(res, 404, { error: "Artigo não encontrado." });
      return send(res, 200, JSON.parse(await fsp.readFile(file, "utf8")));
    }

    // PUT /__admin/articles/:slug  (slug = slug anterior, ou "new")
    if (req.method === "PUT") {
      const article = normalizeArticle(JSON.parse(await readBody(req)));
      const target = articlePath(article.slug);
      const renamed = slug !== "new" && slug !== article.slug;
      if ((slug === "new" || renamed) && fs.existsSync(target)) {
        return send(res, 409, { error: `Já existe um artigo com o slug "${article.slug}".` });
      }
      await fsp.mkdir(ARTICLES_DIR, { recursive: true });
      await fsp.writeFile(target, JSON.stringify(article, null, 2) + "\n");
      if (renamed && fs.existsSync(file)) await fsp.unlink(file);
      await rebuildIndex();
      return send(res, 200, article);
    }

    if (req.method === "DELETE") {
      if (fs.existsSync(file)) await fsp.unlink(file);
      await rebuildIndex();
      return send(res, 200, { ok: true });
    }
  }

  // POST /__admin/upload  (corpo = bytes do arquivo, nome em x-file-name)
  if (parts[0] === "upload" && req.method === "POST") {
    const original = decodeURIComponent(req.headers["x-file-name"] || "arquivo");
    const month = new Date().toISOString().slice(0, 7);
    const dir = path.join(UPLOADS_DIR, month);
    await fsp.mkdir(dir, { recursive: true });
    const name = safeFileName(original);
    const dest = path.join(dir, name);
    let size = 0;
    await new Promise((resolve, reject) => {
      const out = fs.createWriteStream(dest);
      req.on("data", (c) => (size += c.length));
      req.pipe(out);
      out.on("finish", resolve);
      out.on("error", reject);
      req.on("error", reject);
    });
    return send(res, 200, { url: `/uploads/${month}/${name}`, name: original, size });
  }

  return send(res, 404, { error: "Rota não encontrada." });
}

const MIME = {
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".txt": "text/plain; charset=utf-8",
};

/**
 * O Vite só conhece os arquivos de public/ que existiam ao iniciar (e aqui o
 * watch dessas pastas está desligado). Então servimos /content e /uploads
 * direto do disco, para que arquivos recém-enviados apareçam na hora.
 */
function serveFresh(req, res, next) {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (!/^\/(content|uploads)\//.test(pathname)) return next();
  const publicDir = path.join(ROOT, "public");
  const file = path.join(publicDir, pathname);
  if (!file.startsWith(publicDir + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    return next();
  }
  const stat = fs.statSync(file);
  const type = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
  res.setHeader("Content-Type", type);
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Cache-Control", "no-cache");
  if (range) {
    // Vídeos precisam de Range para avançar/voltar no player.
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;
    res.statusCode = 206;
    res.setHeader("Content-Range", `bytes ${start}-${end}/${stat.size}`);
    res.setHeader("Content-Length", end - start + 1);
    if (req.method === "HEAD") return res.end();
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.setHeader("Content-Length", stat.size);
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(file).pipe(res);
}

export default function articlesAdmin() {
  return {
    name: "articles-admin",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(serveFresh);
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/__admin")) return next();
        // O dev server escuta em 0.0.0.0: só aceita a API vinda do próprio PC.
        const ip = req.socket.remoteAddress || "";
        if (!["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(ip)) {
          return send(res, 403, { error: "Admin disponível apenas em localhost." });
        }
        try {
          await handle(req, res, new URL(req.url, "http://localhost"));
        } catch (err) {
          send(res, 400, { error: err.message || "Erro inesperado." });
        }
      });
    },
  };
}
