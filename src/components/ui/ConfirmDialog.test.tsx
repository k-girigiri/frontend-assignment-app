import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('open=true のとき表示される', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="このページを削除しますか？"
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('このページを削除しますか？')).toBeInTheDocument();
  });

  it('open=false のとき表示されない', () => {
    render(
      <ConfirmDialog
        open={false}
        onOpenChange={vi.fn()}
        title="このページを削除しますか？"
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('description を描画する', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="削除確認"
        description="この操作は元に戻せません。"
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByText('この操作は元に戻せません。')).toBeInTheDocument();
  });

  it('確認ボタンをクリックすると onConfirm を呼び出す', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog open={true} onOpenChange={vi.fn()} title="削除確認" onConfirm={onConfirm} />,
    );
    await user.click(screen.getByRole('button', { name: '削除する' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('キャンセルボタンをクリックすると onOpenChange(false) を呼び出す', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={onOpenChange}
        title="削除確認"
        onConfirm={vi.fn()}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('confirmLabel を上書きできる', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title="削除確認"
        confirmLabel="はい、削除します"
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'はい、削除します' })).toBeInTheDocument();
  });
});
