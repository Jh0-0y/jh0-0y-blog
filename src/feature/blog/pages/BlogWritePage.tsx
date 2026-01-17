import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePostCreate } from '../hooks/usePostCreate';
import { useStacks } from '../hooks/useStacks';
import { STACK_GROUP_LABELS, STACK_GROUP_ORDER } from '../../../services/stack/stack.enums';
import { VALIDATION_LIMITS } from '../utils/postValidation';
import type { PostType } from '../types/post.enums';
import { MarkdownEditor } from '../components';
import { StackManageModal } from '../components/stackModal/StackManageModal';
import styles from './BlogWritePage.module.css';

const POST_TYPES: { value: PostType; label: string }[] = [
  { value: 'CORE', label: 'Core' },
  { value: 'ARCHITECTURE', label: 'Architecture' },
  { value: 'TROUBLESHOOTING', label: 'Troubleshooting' },
  { value: 'ESSAY', label: 'Essay' },
];

export const BlogWritePage = () => {
  const {
    form,
    isLoading,
    error,
    fieldErrors,
    contentLengthError,
    updateField,
    addTag,
    removeTag,
    addStack,
    removeStack,
    toggleStatus,
    submit,
  } = usePostCreate();

  const { groupedStacks, isLoading: isStacksLoading, refetch: refetchStacks } = useStacks();
  const [tagInput, setTagInput] = useState('');
  const [showStackModal, setShowStackModal] = useState(false);

  // 스택 토글
  const handleStackToggle = (stackName: string) => {
    if (form.stacks.includes(stackName)) {
      removeStack(stackName);
    } else {
      addStack(stackName);
    }
  };

  // 태그 추가
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    setTagInput('');
    if (trimmed) {
      addTag(trimmed);
    }
  };

  // 태그 입력 키 핸들러
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = tagInput.trim();
      setTagInput('');
      if (trimmed) {
        addTag(trimmed);
      }
    }
  };

  // 저장
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <header className={styles.header}>
        <Link to="/" className={styles.backLink}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>취소</span>
        </Link>
        <h1 className={styles.pageTitle}>새 글 작성</h1>
        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={toggleStatus}
            className={`${styles.statusToggle} ${form.status === 'PUBLIC' ? styles.public : ''}`}
          >
            {form.status === 'PUBLIC' ? (
              <>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                공개
              </>
            ) : (
              <>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                비공개
              </>
            )}
          </button>
        </div>
      </header>

      {/* 에러 메시지 */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* 폼 */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 포스트 타입 */}
        <div className={styles.field}>
          <label className={styles.label}>타입</label>
          <div className={styles.typeButtons}>
            {POST_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => updateField('postType', type.value)}
                className={`${styles.typeButton} ${form.postType === type.value ? styles.active : ''}`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label}>제목</label>
            <span className={styles.charCount}>
              {form.title.length}/{VALIDATION_LIMITS.TITLE_MAX}
            </span>
          </div>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="제목을 입력하세요"
            className={`${styles.titleInput} ${fieldErrors?.title ? styles.inputError : ''}`}
            maxLength={VALIDATION_LIMITS.TITLE_MAX}
          />
          {fieldErrors?.title && <span className={styles.fieldError}>{fieldErrors.title}</span>}
        </div>

        {/* 요약 */}
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label}>요약</label>
            <span className={styles.charCount}>
              {form.excerpt.length}/{VALIDATION_LIMITS.EXCERPT_MAX}
            </span>
          </div>
          <textarea
            value={form.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            placeholder="글을 간단히 요약해주세요 (목록에 표시됩니다)"
            className={`${styles.excerptInput} ${fieldErrors?.excerpt ? styles.inputError : ''}`}
            rows={2}
            maxLength={VALIDATION_LIMITS.EXCERPT_MAX}
          />
          {fieldErrors?.excerpt && <span className={styles.fieldError}>{fieldErrors.excerpt}</span>}
        </div>

        {/* 스택 선택 */}
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label}>
              스택 ({form.stacks.length}/{VALIDATION_LIMITS.STACKS_MAX})
            </label>
            <button
              type="button"
              onClick={() => setShowStackModal(true)}
              className={styles.manageButton}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              관리
            </button>
          </div>
          {fieldErrors?.stacks && <span className={styles.fieldError}>{fieldErrors.stacks}</span>}
          {isStacksLoading ? (
            <div className={styles.stacksLoading}>스택 로딩중...</div>
          ) : groupedStacks ? (
            <div className={styles.stackGroups}>
              {STACK_GROUP_ORDER.map((group) => {
                const stacks = groupedStacks[group];
                if (!stacks || stacks.length === 0) return null;

                return (
                  <div key={group} className={styles.stackGroup}>
                    <span className={styles.stackGroupLabel}>{STACK_GROUP_LABELS[group]}</span>
                    <div className={styles.stackButtons}>
                      {stacks.map((stack) => (
                        <button
                          key={stack.id}
                          type="button"
                          onClick={() => handleStackToggle(stack.name)}
                          className={`${styles.stackButton} ${form.stacks.includes(stack.name) ? styles.active : ''}`}
                        >
                          {stack.name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
          {form.stacks.length > 0 && (
            <div className={styles.selectedStacks}>
              {form.stacks.map((stack) => (
                <span key={stack} className={styles.selectedStack}>
                  {stack}
                  <button type="button" onClick={() => removeStack(stack)} className={styles.stackRemove}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 태그 */}
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label}>태그 ({form.tags.length}/{VALIDATION_LIMITS.TAGS_MAX})</label>
          </div>
          {fieldErrors?.tags && <span className={styles.fieldError}>{fieldErrors.tags}</span>}
          <div className={styles.tagInputWrapper}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="태그 입력 후 Enter"
              className={styles.tagInput}
            />
            <button type="button" onClick={handleAddTag} className={styles.tagAddButton}>
              추가
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className={styles.tagList}>
              {form.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className={styles.tagRemove}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 본문 에디터 */}
        <div className={styles.editorSection}>
          <div className={styles.labelRow}>
            <label className={styles.label}>본문</label>
            <span className={`${styles.charCount} ${contentLengthError ? styles.charCountError : ''}`}>
              {form.content.length}/{VALIDATION_LIMITS.CONTENT_MAX}
            </span>
          </div>
          {contentLengthError && (
            <span className={styles.fieldError}>{contentLengthError}</span>
          )}
          {fieldErrors?.content && !contentLengthError && (
            <span className={styles.fieldError}>{fieldErrors.content}</span>
          )}
          <MarkdownEditor
            value={form.content}
            onChange={(value) => updateField('content', value)}
            placeholder="내용을 작성하세요... (마크다운을 지원합니다)"
          />
        </div>

        {/* 하단 액션 */}
        <div className={styles.actions}>
          <Link to="/" className={styles.cancelButton}>
            취소
          </Link>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || !!contentLengthError}
          >
            {isLoading ? '저장 중...' : '발행하기'}
          </button>
        </div>
      </form>

      {/* 스택 관리 모달 */}
      <StackManageModal
        isOpen={showStackModal}
        onClose={() => setShowStackModal(false)}
        groupedStacks={groupedStacks}
        onStacksChange={refetchStacks}
      />
    </div>
  );
};