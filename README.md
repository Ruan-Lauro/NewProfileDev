# Portfólio — Ruan Lauro

React + Vite. Além do portfólio (`/`), tem uma área de **artigos e estudos** em `/artigos`.

## Publicar um artigo

1. `npm run dev` e abra **http://localhost:5173/admin** (o editor só existe em modo dev e só aceita acesso do próprio PC).
2. Escreva no editor: títulos, listas, código, links, imagens, vídeos (arquivo ou YouTube) e arquivos para download.
3. Preencha **Materiais para download** e **Referências e estudo** (os alunos podem marcar cada link como estudado).
4. Clique em **Publicar** (ou **Salvar rascunho**; rascunhos não aparecem na listagem). `Ctrl+S` também salva.
5. Suba para o ar:

   ```bash
   git add public/content public/uploads
   git commit -m "artigo: <título>"
   git push
   ```

## Como funciona

- Cada artigo vira `public/content/articles/<slug>.json`; a listagem lê só `public/content/index.json` (metadados), então a página fica leve.
- Arquivos enviados vão para `public/uploads/<ano-mês>/`. Para vídeos grandes, prefira YouTube: o GitHub recusa arquivos acima de 100 MB.
- `/artigos` é um chunk separado (~11 KB): não baixa o three.js/gsap da home. O código do editor (`src/admin`, `plugins/articlesAdmin.js`) não entra no build de produção.
- Rotas `/artigos/*` precisam de fallback para `index.html` no host: já configurado em `vercel.json` (Vercel) e `public/_redirects` (Netlify).
