import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import styles from './EditorToolbar.module.css';

interface EditorToolbarProps {
  editor: Editor;
  onImageUpload: () => void;
  onAddLink: () => void;
}

export const EditorToolbar = ({ editor, onImageUpload, onAddLink }: EditorToolbarProps) => {
  // 코드블록 추가
  const addCodeBlock = useCallback(() => {
    editor.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  return (
    <div className={styles.toolbar}>
      {/* 헤딩 */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`${styles.button} ${editor.isActive('heading', { level: 1 }) ? styles.active : ''}`}
          title="제목 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${styles.button} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`}
          title="제목 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${styles.button} ${editor.isActive('heading', { level: 3 }) ? styles.active : ''}`}
          title="제목 3"
        >
          H3
        </button>
      </div>

      <div className={styles.divider} />

      {/* 텍스트 스타일 */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${styles.button} ${editor.isActive('bold') ? styles.active : ''}`}
          title="굵게 (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${styles.button} ${editor.isActive('italic') ? styles.active : ''}`}
          title="기울임 (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${styles.button} ${editor.isActive('underline') ? styles.active : ''}`}
          title="밑줄 (Ctrl+U)"
        >
          <span style={{ textDecoration: 'underline' }}>U</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${styles.button} ${editor.isActive('strike') ? styles.active : ''}`}
          title="취소선"
        >
          <span style={{ textDecoration: 'line-through' }}>S</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`${styles.button} ${editor.isActive('highlight') ? styles.active : ''}`}
          title="하이라이트"
        >
          <span className={styles.highlightIcon}>H</span>
        </button>
      </div>

      <div className={styles.divider} />

      {/* 코드 */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`${styles.button} ${editor.isActive('code') ? styles.active : ''}`}
          title="인라인 코드"
        >
          <code>&lt;/&gt;</code>
        </button>
        <button
          type="button"
          onClick={addCodeBlock}
          className={`${styles.button} ${styles.codeBlockBtn} ${editor.isActive('codeBlock') ? styles.active : ''}`}
          title="코드 블록 (Ctrl+Alt+C)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          코드
        </button>
      </div>

      <div className={styles.divider} />

      {/* 리스트 */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${styles.button} ${editor.isActive('bulletList') ? styles.active : ''}`}
          title="글머리 기호"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <circle cx="3" cy="6" r="1" fill="currentColor" />
            <circle cx="3" cy="12" r="1" fill="currentColor" />
            <circle cx="3" cy="18" r="1" fill="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${styles.button} ${editor.isActive('orderedList') ? styles.active : ''}`}
          title="번호 목록"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="10" y1="6" x2="21" y2="6" />
            <line x1="10" y1="12" x2="21" y2="12" />
            <line x1="10" y1="18" x2="21" y2="18" />
            <text x="2" y="8" fontSize="8" fill="currentColor">1</text>
            <text x="2" y="14" fontSize="8" fill="currentColor">2</text>
            <text x="2" y="20" fontSize="8" fill="currentColor">3</text>
          </svg>
        </button>
      </div>

      <div className={styles.divider} />

      {/* 인용, 구분선 */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${styles.button} ${editor.isActive('blockquote') ? styles.active : ''}`}
          title="인용"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={styles.button}
          title="구분선"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
          </svg>
        </button>
      </div>

      <div className={styles.divider} />

      {/* 링크, 이미지 */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={onAddLink}
          className={`${styles.button} ${editor.isActive('link') ? styles.active : ''}`}
          title="링크"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onImageUpload}
          className={styles.button}
          title="이미지 업로드"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
      </div>

      <div className={styles.divider} />

      {/* 되돌리기 */}
      <div className={styles.group}>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={styles.button}
          title="되돌리기 (Ctrl+Z)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={styles.button}
          title="다시 실행 (Ctrl+Y)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
          </svg>
        </button>
      </div>
    </div>
  );
};