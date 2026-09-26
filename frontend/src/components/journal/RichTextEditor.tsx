import React from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, Unlink, Sparkles
} from 'lucide-react';
import { formatMarkdownToHtml, isMarkdown } from '../../lib/markdown';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor, onAutoFormat }: { editor: Editor | null; onAutoFormat: () => void }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false,
    children 
  }: { 
    onClick: () => void, 
    isActive?: boolean, 
    disabled?: boolean,
    children: React.ReactNode 
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors cursor-pointer ${
        isActive 
          ? 'bg-[#DCA51B]/20 text-[#F5C242] font-bold border border-[#DCA51B]/40' 
          : 'text-zinc-400 hover:text-white hover:bg-white/10'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-[#22252E] bg-[#16181E] rounded-t-xl items-center">
      <div className="flex gap-1 border-r border-[#22252E] pr-2 mr-1">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
          <Strikethrough size={16} />
        </ToolbarButton>
      </div>

      <div className="flex gap-1 border-r border-[#22252E] pr-2 mr-1 items-center">
        <select 
          onChange={(e) => {
            const level = parseInt(e.target.value);
            if (level === 0) editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: level as any }).run();
          }}
          className="p-1 rounded-lg border border-[#2A2E3B] text-xs focus:ring-[#DCA51B] focus:border-[#DCA51B] outline-none bg-[#181A22] h-8 text-zinc-100 font-medium cursor-pointer"
          value={editor.isActive('heading') ? editor.getAttributes('heading').level : 0}
        >
          <option value={0}>Paragraph</option>
          <option value={1}>Heading 1</option>
          <option value={2}>Heading 2</option>
          <option value={3}>Heading 3</option>
          <option value={4}>Heading 4</option>
        </select>
      </div>

      <div className="flex gap-1 border-r border-[#22252E] pr-2 mr-1 items-center">
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#E4E4E7'}
          className="w-8 h-8 rounded cursor-pointer border border-[#2A2E3B] p-0.5 bg-[#181A22]"
          title="Text Color"
        />
      </div>

      <div className="flex gap-1 border-r border-[#22252E] pr-2 mr-1">
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })}>
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })}>
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })}>
          <AlignRight size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })}>
          <AlignJustify size={16} />
        </ToolbarButton>
      </div>

      <div className="flex gap-1 border-r border-[#22252E] pr-2 mr-1">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
          <Quote size={16} />
        </ToolbarButton>
      </div>

      <div className="flex gap-1 border-r border-[#22252E] pr-2 mr-1">
        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}>
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')}>
          <Unlink size={16} />
        </ToolbarButton>
      </div>

      <div className="flex gap-1">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo size={16} />
        </ToolbarButton>
      </div>

      <div className="ml-auto flex items-center">
        <button
          type="button"
          onClick={onAutoFormat}
          title="Auto format markdown: headings, bold text, bullet points & paragraphs"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#DCA51B]/15 text-[#F5C242] border border-[#DCA51B]/40 hover:bg-[#DCA51B]/25 transition-all shadow-sm cursor-pointer"
        >
          <Sparkles size={13} className="text-[#DCA51B]" />
          Format Text
        </button>
      </div>
    </div>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const initialHtml = React.useMemo(() => formatMarkdownToHtml(content), []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#DCA51B] underline hover:text-[#b58614]',
        },
      }),
    ],
    content: initialHtml,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none max-w-none min-h-[400px] px-6 py-5',
      },
      handlePaste: (_view, event) => {
        const text = event.clipboardData?.getData('text/plain');
        if (text && isMarkdown(text)) {
          event.preventDefault();
          const html = formatMarkdownToHtml(text);
          editor?.commands.insertContent(html);
          return true;
        }
        return false;
      },
    },
  });

  const handleAutoFormat = () => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    const currentText = editor.getText();
    const formatted = formatMarkdownToHtml(currentHtml || currentText);
    if (formatted) {
      editor.commands.setContent(formatted);
      onChange(formatted);
    }
  };

  // Effect to update editor content when prop changes externally (e.g. AI draft generated)
  React.useEffect(() => {
    if (editor && content) {
      const formatted = formatMarkdownToHtml(content);
      if (formatted !== editor.getHTML()) {
        editor.commands.setContent(formatted);
      }
    }
  }, [content, editor]);

  return (
    <div className="border border-[#E2DACB] rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#DCA51B]/30 focus-within:border-[#DCA51B] transition-all shadow-sm">
      <MenuBar editor={editor} onAutoFormat={handleAutoFormat} />
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
