import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Content } from '@/generated/model';
import { ContentEditor } from './ContentEditor';

const noop = () => undefined;

const createProps = {
  isCreatingNew: false,
  onCreateSave: (_title: string, _body: string) => undefined,
  onCreateCancel: noop,
};

const mockContent: Content = {
  id: 1,
  title: 'テストページ',
  body: 'これはテスト用の本文です。十分な長さがあります。',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('ContentEditor', () => {
  it('contentがnullの場合、empty stateを表示する', () => {
    render(
      <ContentEditor
        content={null}
        isLoading={false}
        isError={false}
        mode="view"
        onModeChange={noop}
        onTitleSave={noop}
        onBodySave={noop}
        isSaving={false}
        {...createProps}
      />,
    );

    expect(screen.getByText('ページがありません')).toBeInTheDocument();
  });

  it('isLoadingがtrueの場合、読み込み中を表示する', () => {
    render(
      <ContentEditor
        content={null}
        isLoading={true}
        isError={false}
        mode="view"
        onModeChange={noop}
        onTitleSave={noop}
        onBodySave={noop}
        isSaving={false}
        {...createProps}
      />,
    );

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('isErrorがtrueの場合、エラーメッセージを表示する', () => {
    render(
      <ContentEditor
        content={null}
        isLoading={false}
        isError={true}
        mode="view"
        onModeChange={noop}
        onTitleSave={noop}
        onBodySave={noop}
        isSaving={false}
        {...createProps}
      />,
    );

    expect(screen.getByText('読み込みに失敗しました')).toBeInTheDocument();
  });

  it('contentがある場合、タイトルと本文を表示する', () => {
    render(
      <ContentEditor
        content={mockContent}
        isLoading={false}
        isError={false}
        mode="view"
        onModeChange={noop}
        onTitleSave={noop}
        onBodySave={noop}
        isSaving={false}
        {...createProps}
      />,
    );

    expect(screen.getByText('テストページ')).toBeInTheDocument();
    expect(
      screen.getByText('これはテスト用の本文です。十分な長さがあります。'),
    ).toBeInTheDocument();
  });

  it('title_editモードでタイトル入力フィールドを表示する', () => {
    render(
      <ContentEditor
        content={mockContent}
        isLoading={false}
        isError={false}
        mode="title_edit"
        onModeChange={noop}
        onTitleSave={noop}
        onBodySave={noop}
        isSaving={false}
        {...createProps}
      />,
    );

    const input = screen.getByDisplayValue('テストページ');
    expect(input).toBeInTheDocument();
  });

  it('タイトル編集でSaveボタンをクリックするとonTitleSaveを呼び出す', async () => {
    const onTitleSave = vi.fn();
    const user = userEvent.setup();

    render(
      <ContentEditor
        content={mockContent}
        isLoading={false}
        isError={false}
        mode="title_edit"
        onModeChange={noop}
        onTitleSave={onTitleSave}
        onBodySave={noop}
        isSaving={false}
        {...createProps}
      />,
    );

    const input = screen.getByDisplayValue('テストページ');
    await user.clear(input);
    await user.type(input, '新しいタイトル');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onTitleSave).toHaveBeenCalledWith('新しいタイトル');
  });

  it('タイトル編集で空文字のままSaveするとエラーを表示する', async () => {
    const onTitleSave = vi.fn();
    const user = userEvent.setup();

    render(
      <ContentEditor
        content={mockContent}
        isLoading={false}
        isError={false}
        mode="title_edit"
        onModeChange={noop}
        onTitleSave={onTitleSave}
        onBodySave={noop}
        isSaving={false}
        {...createProps}
      />,
    );

    const input = screen.getByDisplayValue('テストページ');
    await user.clear(input);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('タイトルを入力してください')).toBeInTheDocument();
    expect(onTitleSave).not.toHaveBeenCalled();
  });

  it('isCreatingNewがtrueの場合、新規作成フォームを表示する', () => {
    render(
      <ContentEditor
        content={null}
        isLoading={false}
        isError={false}
        mode="view"
        onModeChange={noop}
        onTitleSave={noop}
        onBodySave={noop}
        isSaving={false}
        isCreatingNew={true}
        onCreateSave={(_t, _b) => undefined}
        onCreateCancel={noop}
      />,
    );

    expect(screen.getByPlaceholderText('タイトルを入力')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('本文を入力（10文字以上）')).toBeInTheDocument();
  });
});
