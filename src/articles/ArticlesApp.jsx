import { useEffect, useState } from "react";
import ArticleList from "./ArticleList.jsx";
import ArticlePage from "./ArticlePage.jsx";
import { onLinkClick } from "./utils.js";
import "./articles.css";

const usePath = () => {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  return path;
};

export default function ArticlesApp() {
  const path = usePath().replace(/\/+$/, "");
  const slug = path.startsWith("/artigos/") ? decodeURIComponent(path.slice(9)) : "";

  return (
    <div className="articles-shell">
      <header className="articles-header">
        <div className="articles-container flex items-center justify-between py-5">
          <a href="/" className="text-neutral-600 font-bold text-xl hover:text-black/80 transition-colors">
            Ruan Lauro
          </a>
          <nav className="flex items-center gap-6 text-neutral-600">
            <a href="/" className="hover:text-black/80 transition-colors">Portfólio</a>
            <a
              href="/artigos"
              onClick={onLinkClick("/artigos")}
              className={`hover:text-black/80 transition-colors ${slug ? "" : "text-black/80 font-medium"}`}
            >
              Artigos
            </a>
          </nav>
        </div>
      </header>

      <main className="articles-container pb-24">
        {slug ? <ArticlePage key={slug} slug={slug} /> : <ArticleList />}
      </main>

      <div className="articles-footer" role="contentinfo">
        <div className="articles-container flex flex-col gap-2 py-8 text-sm text-neutral-400 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Ruan Lauro</p>
          <a href="/#contact" className="hover:text-neutral-900 transition-colors">Entre em contato</a>
        </div>
      </div>
    </div>
  );
}
