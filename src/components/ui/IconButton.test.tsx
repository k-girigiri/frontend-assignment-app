import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('aria-label を持つボタンを描画する', () => {
    render(<IconButton src="/icons/edit.svg" alt="" aria-label="編集" />);
    expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument();
  });

  it('onClick を呼び出す', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<IconButton src="/icons/edit.svg" alt="" aria-label="編集" onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disabled のとき onClick を呼び出さない', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <IconButton src="/icons/edit.svg" alt="" aria-label="編集" disabled onClick={onClick} />,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
