import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import type { Content } from '@/generated/model';
import {
  type BodyEditValues,
  bodyEditSchema,
  type ContentFormValues,
  contentFormSchema,
  type TitleEditValues,
  titleEditSchema,
} from '../schemas/content';
import type { ContentMode } from '../types';

type EditActionsProps = {
  onCancel: () => void;
  isSaving: boolean;
};

const EditActions = ({ onCancel, isSaving }: EditActionsProps) => (
  <div className="flex gap-[10px]">
    <Button
      variant="cancel"
      size="sm"
      icon={<img src="/icons/cancel.svg" alt="" width={24} height={24} aria-hidden />}
      type="button"
      onClick={onCancel}
      disabled={isSaving}
    >
      Cancel
    </Button>
    <Button
      size="sm"
      icon={<img src="/icons/save.svg" alt="" width={24} height={24} aria-hidden />}
      type="submit"
      disabled={isSaving}
    >
      Save
    </Button>
  </div>
);

type TitleSectionProps = {
  content: Content;
  mode: ContentMode;
  onModeChange: (mode: ContentMode) => void;
  onSave: (title: string) => void;
  isSaving: boolean;
};

const TitleSection = ({ content, mode, onModeChange, onSave, isSaving }: TitleSectionProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TitleEditValues>({
    resolver: zodResolver(titleEditSchema),
    defaultValues: { title: content.title ?? '' },
  });

  if (mode !== 'title_edit') {
    return (
      <div className="flex flex-col items-start gap-5 md:flex-row">
        <div className="flex h-10 min-w-0 w-full flex-1 items-center md:w-auto">
          <span className="truncate text-2xl font-bold text-text">{content.title}</span>
        </div>
        <Button
          icon={<img src="/icons/edit.svg" alt="" width={24} height={24} aria-hidden />}
          onClick={() => onModeChange('title_edit')}
        >
          Edit
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(({ title }) => onSave(title))}>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col items-start gap-5 md:flex-row">
          <div className="flex h-10 min-w-0 w-full flex-1 items-center rounded-lg border border-brand bg-white px-[30px] md:w-auto">
            <input
              {...register('title')}
              // biome-ignore lint/a11y/noAutofocus: インライン編集では入力欄に自動フォーカスする
              autoFocus
              className="w-full bg-transparent text-2xl font-bold text-text focus:outline-none"
            />
          </div>
          <EditActions onCancel={() => onModeChange('view')} isSaving={isSaving} />
        </div>
        {errors.title && (
          <span className="pl-[30px] text-xs text-red-600" role="alert">
            {errors.title.message}
          </span>
        )}
      </div>
    </form>
  );
};

type BodySectionProps = {
  content: Content;
  mode: ContentMode;
  onModeChange: (mode: ContentMode) => void;
  onSave: (body: string) => void;
  isSaving: boolean;
};

const BodySection = ({ content, mode, onModeChange, onSave, isSaving }: BodySectionProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BodyEditValues>({
    resolver: zodResolver(bodyEditSchema),
    defaultValues: { body: content.body ?? '' },
  });

  if (mode !== 'body_edit') {
    return (
      <div className="flex flex-1 flex-col items-start gap-5 md:flex-row">
        <div className="min-h-[400px] w-full min-w-0 flex-1 rounded-lg bg-white p-[30px] md:w-auto">
          <p className="whitespace-pre-wrap text-base leading-8 text-text">{content.body}</p>
        </div>
        <Button
          icon={<img src="/icons/edit.svg" alt="" width={24} height={24} aria-hidden />}
          onClick={() => onModeChange('body_edit')}
        >
          Edit
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(({ body }) => onSave(body))}
      className="flex min-h-0 flex-1 flex-col items-start gap-5 md:flex-row"
    >
      <div className="flex min-h-0 w-full min-w-0 flex-1 self-stretch flex-col gap-1 md:w-auto">
        <textarea
          {...register('body')}
          // biome-ignore lint/a11y/noAutofocus: インライン編集では入力欄に自動フォーカスする
          autoFocus
          className="min-h-0 flex-1 resize-none overflow-y-auto rounded-lg bg-white p-[30px] text-base leading-8 text-text focus:outline-2 focus:outline-brand"
        />
        {errors.body && (
          <span className="text-xs text-red-600" role="alert">
            {errors.body.message}
          </span>
        )}
      </div>
      <EditActions onCancel={() => onModeChange('view')} isSaving={isSaving} />
    </form>
  );
};

type CreateSectionProps = {
  onSave: (title: string, body: string) => void;
  onCancel: () => void;
  isSaving: boolean;
};

const CreateSection = ({ onSave, onCancel, isSaving }: CreateSectionProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(({ title, body }) => onSave(title, body))}
      className="flex min-h-0 flex-1 flex-col gap-5"
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-col items-start gap-5 md:flex-row">
          <div className="flex h-10 min-w-0 w-full flex-1 items-center rounded-lg border border-brand bg-white px-[30px] md:w-auto">
            <input
              {...register('title')}
              placeholder="タイトルを入力"
              // biome-ignore lint/a11y/noAutofocus: 新規作成時はタイトル入力欄に自動フォーカスする
              autoFocus
              className="w-full bg-transparent text-2xl font-bold text-text placeholder:text-cancel focus:outline-none"
            />
          </div>
          <EditActions onCancel={onCancel} isSaving={isSaving} />
        </div>
        {errors.title && (
          <span className="pl-[30px] text-xs text-red-600" role="alert">
            {errors.title.message}
          </span>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1">
        <textarea
          {...register('body')}
          placeholder="本文を入力（10文字以上）"
          className="min-h-0 flex-1 resize-none overflow-y-auto rounded-lg bg-white p-[30px] text-base leading-8 text-text placeholder:text-cancel focus:outline-2 focus:outline-brand"
        />
        {errors.body && (
          <span className="text-xs text-red-600" role="alert">
            {errors.body.message}
          </span>
        )}
      </div>
    </form>
  );
};

const ContentFooter = () => (
  <div className="flex items-center justify-between pb-[21px]">
    <p className="text-xs text-text-light">Copyright © 2021 Sample</p>
    <p className="text-xs text-text-light">運営会社</p>
  </div>
);

type Props = {
  content: Content | null;
  isLoading: boolean;
  isError: boolean;
  mode: ContentMode;
  onModeChange: (mode: ContentMode) => void;
  onTitleSave: (title: string) => void;
  onBodySave: (body: string) => void;
  isSaving: boolean;
  isCreatingNew: boolean;
  onCreateSave: (title: string, body: string) => void;
  onCreateCancel: () => void;
};

export const ContentEditor = ({
  content,
  isLoading,
  isError,
  mode,
  onModeChange,
  onTitleSave,
  onBodySave,
  isSaving,
  isCreatingNew,
  onCreateSave,
  onCreateCancel,
}: Props) => {
  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center p-[30px]">
        <p className="text-sm text-text-light">読み込み中...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-full items-center justify-center p-[30px]">
        <p className="text-sm text-text-light">読み込みに失敗しました</p>
      </div>
    );
  }

  if (isCreatingNew) {
    return (
      <div className="flex h-full flex-col gap-5 p-[30px]">
        <CreateSection onSave={onCreateSave} onCancel={onCreateCancel} isSaving={isSaving} />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-full flex-col px-[30px] pt-[30px]">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <p className="text-base text-text">ページがありません</p>
          <p className="text-sm text-text-light">
            サイドバーの「Edit」→「New page」から新しいページを作成してください
          </p>
        </div>
        <ContentFooter />
      </div>
    );
  }

  const isBodyEdit = mode === 'body_edit';
  const containerClass = isBodyEdit
    ? 'flex h-full flex-col gap-5 p-[30px]'
    : 'flex min-h-full flex-col gap-5 px-[30px] pt-[30px]';

  return (
    <div className={containerClass}>
      {/* mode切替でkeyを変え、RHFのdefaultValuesをAPI値で再初期化する */}
      <TitleSection
        key={`title-${mode === 'title_edit' ? 'edit' : 'view'}-${content.id}`}
        content={content}
        mode={mode}
        onModeChange={onModeChange}
        onSave={onTitleSave}
        isSaving={isSaving}
      />

      <BodySection
        key={`body-${mode === 'body_edit' ? 'edit' : 'view'}-${content.id}`}
        content={content}
        mode={mode}
        onModeChange={onModeChange}
        onSave={onBodySave}
        isSaving={isSaving}
      />

      {/* body編集中はtextareaの表示領域を確保するためフッターを出さない */}
      {!isBodyEdit && <ContentFooter />}
    </div>
  );
};
