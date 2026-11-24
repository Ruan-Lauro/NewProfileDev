import { useEditor, EditorContent, useEditorState, Node, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Placeholder } from "@tiptap/extensions";
import { api, pickFile, LARGE_FILE } from "./api.js";

/** Vídeo enviado (mp4/webm) como bloco <video controls>. */
const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [{ tag: "video[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes({ controls: "true", preload: "metadata", playsinline: "true" }, HTMLAttributes)];
  },
  addCommands() {
    return {
      setVideo:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});

const confirmLarge = (file) =>
  file.size <= LARGE_FILE ||
  window.confirm(
    `"${file.name}" tem ${(file.size / 1024 / 1024).toFixed(0)} MB e vai para o repositório git.\n` +
      "Para vídeos grandes prefira YouTube. Enviar mesmo assim?"
  );

async function uploadFile(accept, onBusy) {
  const file = await pickFile(accept);
  if (!file || !confirmLarge(file)) return null;
  onBusy?.(true);
  try {
    return await api.upload(file);
  } catch (e) {
    window.alert(e.message);
    return null;
  } finally {
    onBusy?.(false);
  }
}

function Btn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`min-w-8 h-8 rounded-md px-2 text-sm transition ${
        active ? "bg-neutral-800 text-white" : "text-neutral-700 hover:bg-neutral-200"
      } disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="mx-1 h-5 w-px bg-neutral-300" aria-hidden="true" />;

function Toolbar({ editor, onBusy }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      p: e.isActive("paragraph"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      link: e.isActive("link"),
      ul: e.isActive("bulletList"),
      ol: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });
  const chain = () => editor.chain().focus();

  const setLink = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("URL do link (deixe vazio para remover):", prev);
    if (url === null) return;
    if (!url.trim()) return chain().extendMarkRange("link").unsetLink().run();
    const href = /^(https?:|mailto:|\/|#)/.test(url) ? url.trim() : `https://${url.trim()}`;
    if (editor.state.selection.empty && !s.link) {
      return chain().insertContent({ type: "text", text: href, marks: [{ type: "link", attrs: { href } }] }).run();
    }
    chain().extendMarkRange("link").setLink({ href }).run();
  };

  const addImage = async () => {
    const choice = window.prompt("Cole a URL da imagem ou deixe vazio para enviar um arquivo do computador:", "");
    if (choice === null) return;
    if (choice.trim()) return chain().setImage({ src: choice.trim() }).run();
    const up = await uploadFile("image/*", onBusy);
    if (up) chain().setImage({ src: up.url, alt: up.name.replace(/\.[^.]+$/, "") }).run();
  };

  const addVideo = async () => {
    const up = await uploadFile("video/mp4,video/webm", onBusy);
    if (up) chain().setVideo({ src: up.url }).run();
  };

  const addYoutube = () => {
    const url = window.prompt("URL do vídeo do YouTube:");
    if (url?.trim()) chain().setYoutubeVideo({ src: url.trim() }).run();
  };

  const addFile = async () => {
    const up = await uploadFile("", onBusy);
    if (!up) return;
    chain()
      .insertContent([
        { type: "text", text: `📎 ${up.name}`, marks: [{ type: "link", attrs: { href: up.url } }] },
        { type: "text", text: " " },
      ])
      .run();
  };

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-neutral-200 bg-neutral-50 p-1.5">
      <Btn title="Parágrafo" active={s.p} onClick={() => chain().setParagraph().run()}>¶</Btn>
      <Btn title="Título" active={s.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>H2</Btn>
      <Btn title="Subtítulo" active={s.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>H3</Btn>
      <Sep />
      <Btn title="Negrito (Ctrl+B)" active={s.bold} onClick={() => chain().toggleBold().run()}><b>B</b></Btn>
      <Btn title="Itálico (Ctrl+I)" active={s.italic} onClick={() => chain().toggleItalic().run()}><i>I</i></Btn>
      <Btn title="Sublinhado (Ctrl+U)" active={s.underline} onClick={() => chain().toggleUnderline().run()}><u>U</u></Btn>
      <Btn title="Riscado" active={s.strike} onClick={() => chain().toggleStrike().run()}><s>S</s></Btn>
      <Btn title="Código inline" active={s.code} onClick={() => chain().toggleCode().run()}>{"</>"}</Btn>
      <Btn title="Link" active={s.link} onClick={setLink}>🔗</Btn>
      <Sep />
      <Btn title="Lista" active={s.ul} onClick={() => chain().toggleBulletList().run()}>• Lista</Btn>
      <Btn title="Lista numerada" active={s.ol} onClick={() => chain().toggleOrderedList().run()}>1. Lista</Btn>
      <Btn title="Citação" active={s.quote} onClick={() => chain().toggleBlockquote().run()}>❝</Btn>
      <Btn title="Bloco de código" active={s.codeBlock} onClick={() => chain().toggleCodeBlock().run()}>{"{ }"}</Btn>
      <Btn title="Linha divisória" onClick={() => chain().setHorizontalRule().run()}>―</Btn>
      <Sep />
      <Btn title="Imagem" onClick={addImage}>🖼 Imagem</Btn>
      <Btn title="Vídeo (arquivo)" onClick={addVideo}>🎬 Vídeo</Btn>
      <Btn title="YouTube" onClick={addYoutube}>▶ YouTube</Btn>
      <Btn title="Arquivo para download" onClick={addFile}>📎 Arquivo</Btn>
      <Sep />
      <Btn title="Desfazer" disabled={!s.canUndo} onClick={() => chain().undo().run()}>↶</Btn>
      <Btn title="Refazer" disabled={!s.canRedo} onClick={() => chain().redo().run()}>↷</Btn>
    </div>
  );
}

export default function RichEditor({ docKey, initialHtml, onChange, onBusy }) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3] },
          link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
        }),
        Image.configure({ HTMLAttributes: { loading: "lazy" } }),
        Youtube.configure({ nocookie: true, modestBranding: true, width: 640, height: 360 }),
        Video,
        Placeholder.configure({ placeholder: "Escreva a explicação aqui…" }),
      ],
      content: initialHtml || "",
      onUpdate: ({ editor: e }) => onChange(e.isEmpty ? "" : e.getHTML()),
      editorProps: { attributes: { class: "article-content admin-editor" } },
    },
    [docKey]
  );

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <Toolbar editor={editor} onBusy={onBusy} />
      <EditorContent editor={editor} />
    </div>
  );
}
