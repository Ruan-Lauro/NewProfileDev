import { useEffect, useMemo, useState } from "react";
import { formatDate, onLinkClick } from "./utils.js";

export default function ArticleList() {
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    document.title = "Artigos e estudos | Ruan Lauro";
    fetch("/content/index.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setError(true));
  }, []);

  const tags = useMemo(
    () => [...new Set((articles || []).flatMap((a) => a.tags || []))].sort((a, b) => a.localeCompare(b)),
    [articles]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (articles || []).filter(
      (a) =>
        (!tag || a.tags?.includes(tag)) &&
        (!q || `${a.title} ${a.summary} ${(a.tags || []).join(" ")}`.toLowerCase().includes(q))
    );
  }, [articles, query, tag]);

  return (
    <>
      <section className="pt-36 pb-10 sm:pt-40">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">Conhecimento</p>
        <h1 className="mt-3 text-4xl font-semibold text-neutral-700 sm:text-6xl">Artigos e estudos</h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-500">
          Explicações curtas, materiais e referências para quem está aprendendo desenvolvimento comigo.
        </p>
      </section>

      {articles && articles.length > 0 && (
        <div className="mb-10 flex flex-col gap-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por assunto…"
            aria-label="Buscar artigos"
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-700 outline-none transition focus:border-neutral-400 sm:max-w-md"
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tema">
              {["", ...tags].map((t) => (
                <button
                  key={t || "all"}
                  type="button"
                  onClick={() => setTag(t)}
                  aria-pressed={tag === t}
                  className={`chip ${tag === t ? "chip-active" : ""}`}
                >
                  {t || "Todos"}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-neutral-500">Não foi possível carregar os artigos agora.</p>}
      {!articles && !error && <p className="text-neutral-400">Carregando…</p>}
      {articles && articles.length === 0 && (
        <p className="text-neutral-500">Nenhum artigo publicado ainda. Volte em breve!</p>
      )}
      {articles && articles.length > 0 && filtered.length === 0 && (
        <p className="text-neutral-500">Nada encontrado para essa busca.</p>
      )}

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <li key={a.slug}>
            <a href={`/artigos/${a.slug}`} onClick={onLinkClick(`/artigos/${a.slug}`)} className="article-card group">
              {a.cover ? (
                <img src={a.cover} alt="" loading="lazy" decoding="async" className="article-card-cover" />
              ) : (
                <div className="article-card-cover article-card-cover-empty" aria-hidden="true">
                  {a.title.slice(0, 1)}
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs text-neutral-400">
                  {formatDate(a.date)} · {a.readingTime} min de leitura
                </p>
                <h2 className="mt-2 text-lg font-semibold text-neutral-800 group-hover:text-black">{a.title}</h2>
                {a.summary && <p className="mt-2 line-clamp-3 text-sm text-neutral-500">{a.summary}</p>}
                {a.tags?.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {a.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
