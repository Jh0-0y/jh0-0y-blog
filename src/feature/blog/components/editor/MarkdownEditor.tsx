import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { useCallback, useEffect, useRef } from 'react';
import { CodeBlockCustom } from './CodeBlockCustom';
import { ImageCustom } from './ImageCustom';
import { EditorToolbar } from './EditorToolbar';
import { fileApi } from '../../api/file.api';
import styles from './MarkdownEditor.module.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor = ({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
}: MarkdownEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // 커스텀 코드블록 사용
        heading: {
          levels: [1, 2, 3],
        },
      }),
      CodeBlockCustom,
      ImageCustom,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: styles.link,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // HTML로 저장 (마크다운 변환은 백엔드나 표시 시점에)
      onChange(editor.getHTML());
    },
  });

  // 외부에서 value가 변경되면 에디터 업데이트
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // 이미지 업로드 (버튼 클릭 시)
  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      try {
        const response = await imageApi.upload(file);
        if (response.success) {
          editor
            .chain()
            .focus()
            .setImage({
              src: response.data.url,
              alt: response.data.originalName,
            })
            .run();
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      }

      // 파일 입력 초기화
      e.target.value = '';
    },
    [editor]
  );

  // 링크 추가
  const handleAddLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL을 입력하세요:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.editor}>
      {/* 툴바 */}
      <EditorToolbar
        editor={editor}
        onImageUpload={handleImageUpload}
        onAddLink={handleAddLink}
      />

      {/* 에디터 본문 */}
      <EditorContent editor={editor} className={styles.content} />

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
    </div>
  );
};