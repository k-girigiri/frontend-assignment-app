import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('テキストを描画する', () => {
    render(<Button>保存</Button>);
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
  });

  it('onClick を呼び出す', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>保存</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disabled のとき onClick を呼び出さない', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        保存
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('icon を渡すと img を描画する', () => {
    render(<Button icon={<img src="/icons/edit.svg" alt="編集" />}>編集</Button>);
    expect(screen.getByAltText('編集')).toBeInTheDocument();
  });

  it('secondary variant を適用できる', () => {
    render(<Button variant="secondary">新しいページ</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-white');
  });

  it('cancel variant を適用できる', () => {
    render(<Button variant="cancel">キャンセル</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-cancel');
  });
});
