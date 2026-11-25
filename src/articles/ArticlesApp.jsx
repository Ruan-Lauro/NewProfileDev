import { useEffect, useState } from "react";
import ArticleList from "./ArticleList.jsx";
import ArticlePage from "./ArticlePage.jsx";
import Navbar from "../components/navbar.jsx";
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
      <Navbar linkPrefix="/" />

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
