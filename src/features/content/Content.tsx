import { AppLayout } from '@/components/layout/AppLayout';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ToastMessage } from '@/components/ui/Toast';
import { ContentEditor } from './components/ContentEditor';
import { ContentSidebar } from './components/ContentSidebar';
import { useContent } from './hooks/useContent';

export const Content = () => {
  const {
    contents,
    isListLoading,
    activeContentId,
    activeContent,
    isDetailLoading,
    isDetailError,
    mode,
    isCreatingNew,
    deleteTargetId,
    toast,
    isSaving,
    deletingId,
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
  } = useContent();

  return (
    <AppLayout
      sidebar={({ onNavigate }) => (
        <ContentSidebar
          mode={mode}
          onModeChange={handleModeChange}
          contents={contents}
          isLoading={isListLoading}
          activeContentId={activeContentId}
          onActiveChange={handleActiveChange}
          onNewPage={handleNewPage}
          onDelete={handleDeleteRequest}
          deletingId={deletingId}
          isCreatingNew={isCreatingNew}
          onNavigate={onNavigate}
        />
      )}
    >
      <ContentEditor
        content={activeContent}
        isLoading={isDetailLoading}
        isError={isDetailError}
        mode={mode}
        onModeChange={handleModeChange}
        onTitleSave={handleTitleSave}
        onBodySave={handleBodySave}
        isSaving={isSaving}
        isCreatingNew={isCreatingNew}
        onCreateSave={handleCreateSave}
        onCreateCancel={handleCreateCancel}
      />

      <ConfirmDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) handleDeleteCancel();
        }}
        title="このページを削除しますか？"
        description="この操作は元に戻せません。"
        onConfirm={handleDeleteConfirm}
      />

      <ToastMessage
        open={toast.open}
        onOpenChange={handleToastOpenChange}
        title={toast.title}
        description={toast.description}
      />
    </AppLayout>
  );
};
