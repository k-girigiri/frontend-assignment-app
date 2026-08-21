import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  getContentControllerGetAllContentListQueryKey,
  getContentControllerGetContentQueryKey,
  useContentControllerAddContent,
  useContentControllerDeleteContent,
  useContentControllerGetAllContentList,
  useContentControllerGetContent,
  useContentControllerUpdateContent,
} from '@/generated/endpoints/content/content';
import type { ContentMode } from '../types';

type ToastState = { open: boolean; title: string; description?: string };

export const useContent = () => {
  const queryClient = useQueryClient();
  const listQueryKey = getContentControllerGetAllContentListQueryKey();

  const listQuery = useContentControllerGetAllContentList();
  const contents = listQuery.data ?? [];

  const [activeContentId, setActiveContentId] = useState<number | null>(null);
  const [mode, setMode] = useState<ContentMode>('view');
  // 新規作成は既存Contentの編集状態（mode）とは別に管理する
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastState>({ open: false, title: '' });

  // 未選択時は一覧の先頭を選び、空一覧では選択なし（null）のままにする
  useEffect(() => {
    if (activeContentId === null && listQuery.data && listQuery.data.length > 0) {
      setActiveContentId(listQuery.data[0].id);
    }
  }, [listQuery.data, activeContentId]);

  useEffect(() => {
    if (listQuery.isError) {
      setToast({
        open: true,
        title: '一覧の読み込みに失敗しました',
        description: 'ページを再読み込みしてください',
      });
    }
  }, [listQuery.isError]);

  // 型上 id は number 必須のため 0 を渡し、enabled で未選択時の実リクエストを防ぐ
  const detailQuery = useContentControllerGetContent(activeContentId ?? 0, {
    query: { enabled: activeContentId !== null },
  });

  // id が一致する場合のみ使い、切り替え中に前のContentが表示されることを防ぐ
  const activeContent = detailQuery.data?.id === activeContentId ? detailQuery.data : null;

  const addMutation = useContentControllerAddContent({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: listQueryKey });
        setActiveContentId(data.id);
        setIsCreatingNew(false);
        setMode('view');
        setToast({ open: true, title: 'ページを作成しました' });
      },
      onError: () =>
        setToast({
          open: true,
          title: '作成に失敗しました',
          description: 'もう一度お試しください',
        }),
    },
  });

  const updateMutation = useContentControllerUpdateContent({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: listQueryKey });
        queryClient.invalidateQueries({
          queryKey: getContentControllerGetContentQueryKey(data.id),
        });
        setMode('view');
        setToast({ open: true, title: '保存しました' });
      },
      onError: () =>
        setToast({
          open: true,
          title: '更新に失敗しました',
          description: 'もう一度お試しください',
        }),
    },
  });

  const deleteMutation = useContentControllerDeleteContent({
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: listQueryKey });
        const deletedId = variables.id;
        if (deletedId === activeContentId) {
          // 削除後は一覧先頭を選択し、0件なら空状態表示のため null にする
          const remaining = contents.filter((c) => c.id !== deletedId);
          setActiveContentId(remaining.length > 0 ? remaining[0].id : null);
        }
        setToast({ open: true, title: '削除しました' });
      },
      onError: () =>
        setToast({
          open: true,
          title: '削除に失敗しました',
          description: 'もう一度お試しください',
        }),
    },
  });

  const handleActiveChange = (id: number) => {
    if (isCreatingNew) return;
    if (mode === 'title_edit' || mode === 'body_edit') setMode('view');
    setActiveContentId(id);
  };

  const handleModeChange = (next: ContentMode) => setMode(next);

  const handleNewPage = () => {
    setIsCreatingNew(true);
    setMode('view');
  };

  const handleCreateSave = (title: string, body: string) => {
    addMutation.mutate({ data: { title, body } });
  };

  const handleCreateCancel = () => setIsCreatingNew(false);

  // 更新は常に title/body 両方を送り、未編集側の欠落・null 化を避ける
  const handleTitleSave = (title: string) => {
    if (activeContentId !== null && activeContent) {
      updateMutation.mutate({
        id: activeContentId,
        data: { title, body: activeContent.body ?? '' },
      });
    }
  };

  const handleBodySave = (body: string) => {
    if (activeContentId !== null && activeContent) {
      updateMutation.mutate({
        id: activeContentId,
        data: { title: activeContent.title ?? '', body },
      });
    }
  };

  const handleDeleteRequest = (id: number) => setDeleteTargetId(id);

  const handleDeleteConfirm = () => {
    if (deleteTargetId !== null) {
      deleteMutation.mutate({ id: deleteTargetId });
      setDeleteTargetId(null);
    }
  };

  const handleDeleteCancel = () => setDeleteTargetId(null);

  const handleToastOpenChange = (open: boolean) => setToast((t) => ({ ...t, open }));

  return {
    contents,
    isListLoading: listQuery.isLoading,
    activeContentId,
    activeContent,
    isDetailLoading: activeContentId !== null && activeContent === null && !detailQuery.isError,
    isDetailError: detailQuery.isError,
    mode,
    isCreatingNew,
    deleteTargetId,
    toast,
    isSaving: addMutation.isPending || updateMutation.isPending,
    deletingId: deleteMutation.isPending ? (deleteMutation.variables?.id ?? null) : null,
    handleActiveChange,
    handleModeChange,
    handleNewPage,
    handleCreateSave,
    handleCreateCancel,
    handleTitleSave,
    handleBodySave,
    handleDeleteRequest,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleToastOpenChange,
  };
};
