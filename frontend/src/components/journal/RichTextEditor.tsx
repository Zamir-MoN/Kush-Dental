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
  List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, Unlink
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
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
      className={`p-2 rounded-lg hover:bg-[#FAF7F2] transition-colors ${isActive ? 'bg-[#FAF3E0] text-[#8C6B14] font-bold' : 'text-zinc-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg items-center">
      <div className="flex gap-1 border-r border-gray-300 pr-2 mr-1">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>
          <UnderlineIcon size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
          <Strikethrough size={18} />
        </ToolbarButton>
      </div>

      <div className="flex gap-1 border-r border-gray-300 pr-2 mr-1 items-center">
        <select 
          onChange={(e) => {
            const level = parseInt(e.target.value);
            if (level === 0) editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: level as any }).run();
          }}
          className="p-1 rounded-lg border border-[#E2DACB] text-xs focus:ring-[#DCA51B] focus:border-[#DCA51B] outline-none bg-white h-8 text-zinc-800"
          value={editor.isActive('heading') ? editor.getAttributes('heading').level : 0}
        >
          <option value={0}>Paragraph</option>
          <option value={1}>Heading 1</option>
          <option value={2}>Heading 2</option>
          <option value={3}>Heading 3</option>
          <option value={4}>Heading 4</option>
        </select>
      </div>

      <div className="flex gap-1 border-r border-gray-300 pr-2 mr-1 items-center">
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
          title="Text Color"
        />
      </div>

      <div className="flex gap-1 border-r border-gray-300 pr-2 mr-1">
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })}>
          <AlignLeft size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })}>
          <AlignCenter size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })}>
          <AlignRight size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })}>
          <AlignJustify size={18} />
        </ToolbarButton>
      </div>

      <div className="flex gap-1 border-r border-gray-300 pr-2 mr-1">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
          <Quote size={18} />
        </ToolbarButton>
      </div>

      <div className="flex gap-1 border-r border-gray-300 pr-2 mr-1">
        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}>
          <LinkIcon size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')}>
          <Unlink size={18} />
        </ToolbarButton>
      </div>

      <div className="flex gap-1">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo size={18} />
        </ToolbarButton>
      </div>
    </div>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
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
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none max-w-none min-h-[400px] px-4 py-4',
      },
    },
  });

  // Effect to update editor content when prop changes externally (e.g. initial load)
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-[#E2DACB] rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#DCA51B]/30 focus-within:border-[#DCA51B] transition-all">
      <MenuBar editor={editor} />
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
