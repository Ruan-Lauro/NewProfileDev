import { useEffect, useMemo, useState } from "react";
import { REFERENCE_TYPES, fileExt, formatDate, formatSize, hostOf, onLinkClick, storage } from "./utils.js";

function StudyReferences({ slug, references }) {
  const key = `estudo:${slug}`;
  const [done, setDone] = useState(() => storage.get(key, []));

  const toggle = (url) => {
    const next = done.includes(url) ? done.filter((u) => u !== url) : [...done, url];
    setDone(next);
    storage.set(key, next);
  };

  const groups = useMemo(() => {
    const order = (t) => {
      const i = REFERENCE_TYPES.indexOf(t);
      return i === -1 ? REFERENCE_TYPES.length : i;
    };
    const map = new Map();
    references.forEach((r) => {
      const type = r.type || "Outro";
      if (!map.has(type)) map.set(type, []);
      map.get(type).push(r);
    });
    return [...map.entries()].sort((a, b) => order(a[0]) - order(b[0]));
  }, [references]);

  const count = references.filter((r) => done.includes(r.url)).length;
  const pct = Math.round((count / references.length) * 100);

  return (
    <section className="study-box" aria-labelledby="study-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="study-title" className="text-2xl font-semibold text-neutral-800">Referências e estudo</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Marque o que você já estudou. O progresso fica salvo neste navegador.
          </p>
        </div>
        <p className="text-sm font-medium text-neutral-600">
          {count} de {references.length} estudados
        </p>
      </div>
      <div className="study-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${pct}%` }} />
      </div>

      {groups.map(([type, items]) => (
        <div key={type} className="mt-6">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-neutral-400">{type}</h3>
          <ul className="flex flex-col gap-2">
            {items.map((r) => {
              const checked = done.includes(r.url);
              return (
                <li key={r.url} className={`study-item ${checked ? "study-item-done" : ""}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(r.url)}
                    aria-label={`Marcar "${r.title || r.url}" como estudado`}
                  />
                  <div className="min-w-0 flex-1">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="study-link">
                      {r.title || r.url}
                    </a>
                    <span className="ml-2 text-xs text-neutral-400">{hostOf(r.url)}</span>
                    {r.note && <p className="mt-1 text-sm text-neutral-500">{r.note}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}

export default function ArticlePage({ slug }) {
  const [article, setArticle] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch(`/content/articles/${encodeURIComponent(slug)}.json`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!data?.slug || (data.draft && !import.meta.env.DEV)) throw new Error();
        setArticle(data);
        setStatus("ok");
        document.title = `${data.title} | Ruan Lauro`;
        document.querySelector('meta[name="description"]')?.setAttribute("content", data.summary || "");
      })
      .catch(() => setStatus("missing"));
  }, [slug]);

  if (status === "loading") return <p className="pt-40 text-neutral-400">Carregando…</p>;

  if (status === "missing") {
    return (
      <div className="pt-40">
        <h1 className="text-3xl font-semibold text-neutral-700">Artigo não encontrado</h1>
        <a href="/artigos" onClick={onLinkClick("/artigos")} className="mt-4 inline-block text-primary hover:underline">
          ← Ver todos os artigos
        </a>
      </div>
    );
  }

  const { title, summary, cover, tags = [], date, readingTime, content, references = [], attachments = [] } = article;

  return (
    <article className="mx-auto max-w-3xl pt-32 sm:pt-36">
      <a href="/artigos" onClick={onLinkClick("/artigos")} className="text-sm text-neutral-500 hover:text-black/80">
        ← Todos os artigos
      </a>

      <header className="mt-6">
        {tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}
        <h1 className="text-3xl font-semibold leading-tight text-neutral-800 sm:text-5xl">{title}</h1>
        {summary && <p className="mt-4 text-lg text-neutral-500">{summary}</p>}
        <p className="mt-4 text-sm text-neutral-400">
          {formatDate(date)} · {readingTime} min de leitura
          {article.draft && <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-amber-700">Rascunho</span>}
        </p>
      </header>

      {cover && <img src={cover} alt="" className="mt-8 w-full rounded-2xl border border-neutral-100 object-cover" />}

      <div className="article-content mt-10" dangerouslySetInnerHTML={{ __html: content }} />

      {attachments.length > 0 && (
        <section className="mt-14" aria-labelledby="files-title">
          <h2 id="files-title" className="text-2xl font-semibold text-neutral-800">Materiais para download</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {attachments.map((f) => (
              <li key={f.url}>
                <a href={f.url} download={f.url.startsWith("/") ? "" : undefined} target="_blank" rel="noopener noreferrer" className="file-card">
                  <span className="file-ext">{fileExt(f.url) || "ARQ"}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-neutral-800">{f.name || f.url}</span>
                    {f.size && <span className="text-xs text-neutral-400">{formatSize(f.size)}</span>}
                  </span>
                  <span aria-hidden="true" className="text-neutral-400">↓</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {references.length > 0 && <StudyReferences slug={slug} references={references} />}
    </article>
  );
}
