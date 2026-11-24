import { useCallback, useEffect, useRef, useState } from "react";
import RichEditor from "./RichEditor.jsx";
import { api, pickFile, LARGE_FILE } from "./api.js";
import { REFERENCE_TYPES, formatDate, formatSize } from "../articles/utils.js";
import "../articles/articles.css";
import "./admin.css";

const today = () => new Date().toISOString().slice(0, 10);

const slugify = (v = "") =>
  v
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const emptyArticle = () => ({
  slug: "",
  title: "",
  summary: "",
  cover: "",
  tags: [],
  date: today(),
  draft: true,
  content: "",
  references: [],
  attachments: [],
});

const Field = ({ label, hint, children }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-sm font-medium text-neutral-700">{label}</span>
    {children}
    {hint && <span className="text-xs text-neutral-400">{hint}</span>}
  </label>
);

function ReferencesEditor({ value, onChange }) {
  const update = (i, patch) => onChange(value.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const move = (i, dir) => {
    const next = [...value];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {value.map((r, i) => (
        <div key={i} className="grid gap-2 rounded-xl border border-neutral-200 bg-white p-3 sm:grid-cols-[1fr_1fr_9rem_auto]">
          <input className="admin-input" placeholder="Título (ex.: MDN – Flexbox)" value={r.title} onChange={(e) => update(i, { title: e.target.value })} />
          <input className="admin-input" placeholder="https://…" value={r.url} onChange={(e) => update(i, { url: e.target.value })} />
          <select className="admin-input" value={r.type} onChange={(e) => update(i, { type: e.target.value })}>
            {REFERENCE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <div className="flex gap-1">
            <button type="button" className="admin-icon-btn" title="Subir" onClick={() => move(i, -1)}>↑</button>
            <button type="button" className="admin-icon-btn" title="Descer" onClick={() => move(i, 1)}>↓</button>
            <button type="button" className="admin-icon-btn text-red-600" title="Remover" onClick={() => onChange(value.filter((_, idx) => idx !== i))}>✕</button>
          </div>
          <input className="admin-input sm:col-span-4" placeholder="Nota para os alunos (opcional): o que estudar nesse link" value={r.note} onChange={(e) => update(i, { note: e.target.value })} />
        </div>
      ))}
      <button type="button" className="admin-btn-ghost self-start" onClick={() => onChange([...value, { title: "", url: "", type: "Artigo", note: "" }])}>
        + Adicionar referência
      </button>
    </div>
  );
}

function AttachmentsEditor({ value, onChange, onBusy }) {
  const add = async () => {
    const file = await pickFile();
    if (!file) return;
    if (file.size > LARGE_FILE && !window.confirm(`"${file.name}" é grande (${formatSize(file.size)}) e vai para o git. Continuar?`)) return;
    onBusy(true);
    try {
      const up = await api.upload(file);
      onChange([...value, { name: up.name, url: up.url, size: String(up.size) }]);
    } catch (e) {
      window.alert(e.message);
    } finally {
      onBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {value.map((f, i) => (
        <div key={f.url} className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2 pl-3">
          <input
            className="admin-input flex-1"
            value={f.name}
            onChange={(e) => onChange(value.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))}
          />
          <span className="hidden text-xs text-neutral-400 sm:inline">{formatSize(f.size)}</span>
          <a href={f.url} target="_blank" rel="noreferrer" className="admin-icon-btn" title="Abrir">↗</a>
          <button type="button" className="admin-icon-btn text-red-600" title="Remover" onClick={() => onChange(value.filter((_, idx) => idx !== i))}>✕</button>
        </div>
      ))}
      <button type="button" className="admin-btn-ghost self-start" onClick={add}>+ Enviar arquivo (PDF, zip, slides…)</button>
    </div>
  );
}

export default function AdminApp() {
  const [list, setList] = useState([]);
  const [article, setArticle] = useState(emptyArticle);
  const [savedSlug, setSavedSlug] = useState(null); // slug no disco (null = novo)
  const [docKey, setDocKey] = useState(0);
  const [slugTouched, setSlugTouched] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const articleRef = useRef(article);
  useEffect(() => {
    articleRef.current = article;
  }, [article]);

  const refreshList = useCallback(() => api.list().then(setList).catch((e) => setMsg({ type: "error", text: e.message })), []);

  useEffect(() => {
    document.title = "Admin · Artigos";
    refreshList();
  }, [refreshList]);

  useEffect(() => {
    const warn = (e) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (patch) => {
    setArticle((a) => ({ ...a, ...patch }));
    setDirty(true);
  };

  const confirmDiscard = () => !dirty || window.confirm("Há alterações não salvas. Descartar?");

  const open = async (slug) => {
    if (!confirmDiscard()) return;
    try {
      const a = await api.get(slug);
      setArticle({ ...emptyArticle(), ...a });
      setSavedSlug(a.slug);
      setSlugTouched(true);
      setDirty(false);
      setDocKey((k) => k + 1);
      setMsg(null);
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    }
  };

  const createNew = () => {
    if (!confirmDiscard()) return;
    setArticle(emptyArticle());
    setSavedSlug(null);
    setSlugTouched(false);
    setDirty(false);
    setDocKey((k) => k + 1);
    setMsg(null);
  };

  const save = useCallback(
    async (patch = {}) => {
      const current = { ...articleRef.current, ...patch };
      setBusy(true);
      try {
        const saved = await api.save(savedSlug, current);
        setArticle((a) => ({ ...a, ...saved }));
        setSavedSlug(saved.slug);
        setSlugTouched(true);
        setDirty(false);
        setMsg({ type: "ok", text: saved.draft ? "Rascunho salvo." : "Publicado! Faça commit + push para colocar no ar." });
        refreshList();
      } catch (e) {
        setMsg({ type: "error", text: e.message });
      } finally {
        setBusy(false);
      }
    },
    [savedSlug, refreshList]
  );

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  const remove = async () => {
    if (!savedSlug || !window.confirm(`Excluir "${article.title}"? Os arquivos enviados continuam em public/uploads.`)) return;
    await api.remove(savedSlug);
    setDirty(false);
    setArticle(emptyArticle());
    setSavedSlug(null);
    setSlugTouched(false);
    setDocKey((k) => k + 1);
    setMsg({ type: "ok", text: "Artigo excluído." });
    refreshList();
  };

  const uploadCover = async () => {
    const file = await pickFile("image/*");
    if (!file) return;
    setBusy(true);
    try {
      const up = await api.upload(file);
      set({ cover: up.url });
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="flex items-center justify-between">
          <a href="/artigos" target="_blank" rel="noreferrer" className="font-semibold text-neutral-800">Artigos ↗</a>
          <button type="button" className="admin-btn" onClick={createNew}>+ Novo</button>
        </div>
        <ul className="mt-4 flex flex-col gap-1">
          {list.length === 0 && <li className="text-sm text-neutral-400">Nenhum artigo ainda.</li>}
          {list.map((a) => (
            <li key={a.slug}>
              <button
                type="button"
                onClick={() => open(a.slug)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  a.slug === savedSlug ? "bg-neutral-800 text-white" : "hover:bg-neutral-200"
                }`}
              >
                <span className="block truncate font-medium">{a.title}</span>
                <span className={`text-xs ${a.slug === savedSlug ? "text-neutral-300" : "text-neutral-400"}`}>
                  {formatDate(a.date)} {a.draft && "· rascunho"}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-neutral-400">
          Este editor só existe no <code>npm run dev</code>. Depois de salvar, publique com <code>git add public &amp;&amp; git commit &amp;&amp; git push</code>.
        </p>
      </aside>

      <section className="admin-main">
        <div className="admin-topbar">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${article.draft ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
              {article.draft ? "Rascunho" : "Publicado"}
            </span>
            {dirty && <span className="text-xs text-neutral-400">alterações não salvas</span>}
            {busy && <span className="text-xs text-neutral-400">enviando…</span>}
            {msg && <span className={`truncate text-sm ${msg.type === "error" ? "text-red-600" : "text-emerald-600"}`}>{msg.text}</span>}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {savedSlug && (
              <a className="admin-btn-ghost" href={`/artigos/${savedSlug}`} target="_blank" rel="noreferrer">Ver página</a>
            )}
            {savedSlug && <button type="button" className="admin-btn-ghost text-red-600" onClick={remove}>Excluir</button>}
            <button type="button" className="admin-btn-ghost" disabled={busy} onClick={() => save({ draft: true })}>Salvar rascunho</button>
            <button type="button" className="admin-btn" disabled={busy} onClick={() => save({ draft: false })}>
              {article.draft ? "Publicar" : "Salvar"}
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col gap-8 p-5 sm:p-8">
          <div className="flex flex-col gap-4">
            <input
              className="w-full bg-transparent text-3xl font-semibold text-neutral-800 outline-none placeholder:text-neutral-300 sm:text-4xl"
              placeholder="Título do artigo"
              value={article.title}
              onChange={(e) => set({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })}
            />
            <textarea
              className="admin-input min-h-20 resize-y"
              placeholder="Resumo curto (aparece no card e no topo do artigo)"
              value={article.summary}
              onChange={(e) => set({ summary: e.target.value })}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Endereço (slug)" hint={`/artigos/${article.slug || "…"}`}>
                <input
                  className="admin-input"
                  value={article.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set({ slug: slugify(e.target.value) });
                  }}
                />
              </Field>
              <Field label="Data">
                <input type="date" className="admin-input" value={article.date} onChange={(e) => set({ date: e.target.value })} />
              </Field>
              <Field label="Tags" hint="Separadas por vírgula">
                <input
                  className="admin-input"
                  placeholder="react, css, iniciante"
                  value={article.tags.join(", ")}
                  onChange={(e) => set({ tags: e.target.value.split(",").map((t) => t.trimStart()) })}
                  onBlur={() => set({ tags: article.tags.map((t) => t.trim()).filter(Boolean) })}
                />
              </Field>
            </div>
            <Field label="Capa (opcional)">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input className="admin-input flex-1" placeholder="URL da imagem ou envie um arquivo" value={article.cover} onChange={(e) => set({ cover: e.target.value })} />
                <button type="button" className="admin-btn-ghost" onClick={uploadCover}>Enviar imagem</button>
              </div>
              {article.cover && <img src={article.cover} alt="" className="mt-2 max-h-48 w-fit rounded-lg border border-neutral-200 object-cover" />}
            </Field>
          </div>

          <div>
            <h2 className="admin-section-title">Conteúdo</h2>
            <RichEditor
              docKey={docKey}
              initialHtml={article.content}
              onChange={(html) => set({ content: html })}
              onBusy={setBusy}
            />
          </div>

          <div>
            <h2 className="admin-section-title">Materiais para download</h2>
            <AttachmentsEditor value={article.attachments} onChange={(attachments) => set({ attachments })} onBusy={setBusy} />
          </div>

          <div>
            <h2 className="admin-section-title">Referências e estudo</h2>
            <p className="mb-3 text-sm text-neutral-500">Links que os alunos devem estudar. Eles poderão marcar cada um como estudado.</p>
            <ReferencesEditor value={article.references} onChange={(references) => set({ references })} />
          </div>
        </div>
      </section>
    </div>
  );
}
