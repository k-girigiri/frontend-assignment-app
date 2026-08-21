import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toaster, ToastMessage, ToastProvider } from './Toast';

const renderToast = (props: Parameters<typeof ToastMessage>[0]) =>
  render(
    <ToastProvider>
      <ToastMessage {...props} />
      <Toaster />
    </ToastProvider>,
  );

describe('ToastMessage', () => {
  it('open=true のときタイトルを描画する', () => {
    renderToast({ open: true, onOpenChange: vi.fn(), title: '保存しました' });
    expect(screen.getByText('保存しました')).toBeInTheDocument();
  });

  it('open=false のとき描画されない', () => {
    renderToast({ open: false, onOpenChange: vi.fn(), title: '保存しました' });
    expect(screen.queryByText('保存しました')).not.toBeInTheDocument();
  });

  it('description を描画する', () => {
    renderToast({
      open: true,
      onOpenChange: vi.fn(),
      title: 'タイトル',
      description: '詳細メッセージ',
    });
    expect(screen.getByText('詳細メッセージ')).toBeInTheDocument();
  });

  it('閉じるボタンで onOpenChange(false) を呼び出す', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderToast({ open: true, onOpenChange, title: '保存しました' });
    await user.click(screen.getByRole('button', { name: '閉じる' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
