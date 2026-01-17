import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage, getFieldErrors } from '@/services/core/api.error';
import { useToast } from '@/utils/toast/useToast';
import { postApi } from '../api/post.api';
import {
  validatePostForm,
  validateContentLength,
  canAddTag,
  canAddStack,
  VALIDATION_LIMITS,
} from '../utils/postValidation';
import type { UpdatePostRequest } from '../api/post.request';
import type { PostType, PostStatus } from '../types/post.enums';

export interface PostEditForm {
  title: string;
  excerpt: string;
  postType: PostType;
  content: string;
  status: PostStatus;
  stacks: string[];
  tags: string[];
}

export interface UsePostEditReturn {
  form: PostEditForm;
  isLoading: boolean;
  isFetching: boolean;
  isDeleting: boolean;
  error: string | null;
  fieldErrors: Record<string, string> | null;
  contentLengthError: string | null;
  updateField: <K extends keyof PostEditForm>(key: K, value: PostEditForm[K]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  addStack: (stack: string) => void;
  removeStack: (stack: string) => void;
  toggleStatus: () => void;
  submit: () => Promise<void>;
  deletePost: () => Promise<void>;
}

const INITIAL_FORM: PostEditForm = {
  title: '',
  excerpt: '',
  postType: 'CORE',
  content: '',
  status: 'PUBLIC',
  stacks: [],
  tags: [],
};

export const usePostEdit = (postId: number): UsePostEditReturn => {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState<PostEditForm>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);
  const [contentLengthError, setContentLengthError] = useState<string | null>(null);

  // 기존 데이터 로드
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      setIsFetching(true);
      setError(null);

      try {
        const response = await postApi.getPost(postId);
        if (response.success) {
          const post = response.data;
          setForm({
            title: post.title,
            excerpt: post.excerpt,
            postType: post.postType,
            content: post.content,
            status: post.status,
            stacks: post.stacks,
            tags: post.tags,
          });

          // 기존 본문 길이 검사
          setContentLengthError(validateContentLength(post.content));
        }
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [postId]);

  // 필드 업데이트
  const updateField = useCallback(
    <K extends keyof PostEditForm>(key: K, value: PostEditForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));

      // 본문 실시간 길이 검사
      if (key === 'content' && typeof value === 'string') {
        setContentLengthError(validateContentLength(value));
      }

      // 해당 필드 에러 제거
      if (fieldErrors?.[key]) {
        setFieldErrors((prev) => {
          if (!prev) return null;
          const { [key]: _, ...rest } = prev;
          return Object.keys(rest).length > 0 ? rest : null;
        });
      }
    },
    [fieldErrors]
  );

  // 태그 추가
  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed) return;

      if (!canAddTag(form.tags)) {
        toast.warning(`태그는 ${VALIDATION_LIMITS.TAGS_MAX}개까지만 추가 가능합니다`);
        return;
      }

      if (form.tags.includes(trimmed)) {
        toast.warning('이미 추가된 태그입니다');
        return;
      }

      setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));

      // 태그 에러 제거
      if (fieldErrors?.tags) {
        setFieldErrors((prev) => {
          if (!prev) return null;
          const { tags: _, ...rest } = prev;
          return Object.keys(rest).length > 0 ? rest : null;
        });
      }
    },
    [form.tags, fieldErrors, toast]
  );

  // 태그 제거
  const removeTag = useCallback((tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  // 스택 추가
  const addStack = useCallback(
    (stack: string) => {
      if (!canAddStack(form.stacks)) {
        toast.warning(`스택은 ${VALIDATION_LIMITS.STACKS_MAX}개까지만 선택 가능합니다`);
        return;
      }

      if (form.stacks.includes(stack)) return;

      setForm((prev) => ({ ...prev, stacks: [...prev.stacks, stack] }));

      // 스택 에러 제거
      if (fieldErrors?.stacks) {
        setFieldErrors((prev) => {
          if (!prev) return null;
          const { stacks: _, ...rest } = prev;
          return Object.keys(rest).length > 0 ? rest : null;
        });
      }
    },
    [form.stacks, fieldErrors, toast]
  );

  // 스택 제거
  const removeStack = useCallback((stackToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      stacks: prev.stacks.filter((stack) => stack !== stackToRemove),
    }));
  }, []);

  // 공개/비공개 토글
  const toggleStatus = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      status: prev.status === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC',
    }));
  }, []);

  // 수정 제출
  const submit = useCallback(async () => {
    // 클라이언트 유효성 검사
    const validationErrors = validatePostForm(form);
    if (validationErrors) {
      setFieldErrors(validationErrors);

      // 첫 번째 에러 메시지 토스트
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setFieldErrors(null);

    try {
      const request: UpdatePostRequest = {
        title: form.title,
        excerpt: form.excerpt,
        postType: form.postType,
        content: form.content,
        status: form.status,
        stacks: form.stacks,
        tags: form.tags,
      };

      const response = await postApi.updatePost(postId, request);

      if (response.success) {
        toast.success('게시글이 수정되었습니다');
        navigate(`/post/${response.data.id}`);
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      setFieldErrors(getFieldErrors(err));
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [form, postId, navigate, toast]);

  // 삭제
  const deletePost = useCallback(async () => {
    setIsDeleting(true);

    try {
      const response = await postApi.deletePost(postId);

      if (response.success) {
        toast.success('게시글이 삭제되었습니다');
        navigate('/');
      }
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }, [postId, navigate, toast]);

  return {
    form,
    isLoading,
    isFetching,
    isDeleting,
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
    deletePost,
  };
};