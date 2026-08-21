import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import type { Content } from '@/generated/model';
import type { ContentMode } from '../types';

type Props = {
  mode: ContentMode;
  onModeChange: (mode: ContentMode) => void;
  contents: Content[];
  isLoading: boolean;
  activeContentId: number | null;
  onActiveChange: (id: number) => void;
  onNewPage: () => void;
  onDelete: (id: number) => void;
  deletingId: number | null;
  isCreatingNew: boolean;
  onNavigate?: () => void;
};

export const ContentSidebar = ({
  mode,
  onModeChange,
  contents,
  isLoading,
  activeContentId,
  onActiveChange,
  onNewPage,
  onDelete,
  deletingId,
  isCreatingNew,
  onNavigate,
}: Props) => (
  <div className="flex h-full flex-col">
    <div className="flex h-[82px] items-center gap-1 px-10">
      <img src="/icons/logo.svg" alt="" width={32} height={32} />
      <span className="text-2xl font-bold text-[#1a1a1a]">ServiceName</span>
    </div>

    <nav className="flex-1 overflow-auto pl-10">
      {isLoading && <p className="px-[10px] py-3 text-sm text-text-light">読み込み中...</p>}
      {!isLoading && contents.length === 0 && (
        <p className="px-[10px] py-3 text-sm text-text-light">ページがありません</p>
      )}
      {contents.map((content) => (
        <div
          key={content.id}
          className={`flex h-11 items-center justify-between rounded px-[10px] ${
            content.id === activeContentId
              ? 'bg-surface font-bold text-brand-active'
              : 'text-text hover:bg-surface/60'
          }`}
        >
          <button
            type="button"
            className={`min-w-0 h-full flex-1 truncate text-left text-base${isCreatingNew ? ' cursor-not-allowed opacity-50' : ''}`}
            onClick={() => {
              onActiveChange(content.id);
              onNavigate?.();
            }}
            disabled={isCreatingNew}
          >
            {content.title ?? '（タイトルなし）'}
          </button>

          {mode === 'menu_edit' && (
            <IconButton
              src="/icons/delete.svg"
              alt=""
              aria-label={`${content.title ?? 'ページ'}を削除`}
              size="sm"
              disabled={deletingId === content.id}
              onClick={() => onDelete(content.id)}
            />
          )}
        </div>
      ))}
    </nav>

    <div className="flex h-[60px] items-center bg-separator pl-10 pr-[10px]">
      {mode === 'menu_edit' ? (
        <div className="flex w-full items-center justify-between">
          <Button
            variant="secondary"
            icon={<img src="/icons/add.svg" alt="" width={24} height={24} aria-hidden />}
            onClick={onNewPage}
            disabled={isCreatingNew}
          >
            New page
          </Button>

          <Button
            icon={<img src="/icons/done.svg" alt="" width={24} height={24} aria-hidden />}
            onClick={() => onModeChange('view')}
          >
            Done
          </Button>
        </div>
      ) : (
        <div className="flex w-full justify-end">
          <Button
            icon={<img src="/icons/edit.svg" alt="" width={24} height={24} aria-hidden />}
            onClick={() => onModeChange('menu_edit')}
            disabled={isCreatingNew}
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  </div>
);
