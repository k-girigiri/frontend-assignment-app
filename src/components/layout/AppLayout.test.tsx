import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AppLayout } from './AppLayout';

describe('AppLayout', () => {
  it('サイドバーとメインコンテンツを描画する', () => {
    render(
      <AppLayout sidebar={<nav>サイドバー</nav>}>
        <div>メインコンテンツ</div>
      </AppLayout>,
    );
    expect(screen.getByText('サイドバー')).toBeInTheDocument();
    expect(screen.getByText('メインコンテンツ')).toBeInTheDocument();
  });

  it('モバイル用のメニューボタンを描画する', () => {
    render(
      <AppLayout sidebar={<nav>サイドバー</nav>}>
        <div>コンテンツ</div>
      </AppLayout>,
    );
    expect(screen.getByRole('button', { name: 'メニューを開く' })).toBeInTheDocument();
  });

  it('メニューボタンをクリックするとドロワーが開く', async () => {
    const user = userEvent.setup();
    render(
      <AppLayout sidebar={<nav>ドロワー内サイドバー</nav>}>
        <div>コンテンツ</div>
      </AppLayout>,
    );
    await user.click(screen.getByRole('button', { name: 'メニューを開く' }));
    expect(screen.getByRole('dialog', { name: 'メニュー' })).toBeInTheDocument();
  });

  it('ドロワーの閉じるボタンでドロワーが閉じる', async () => {
    const user = userEvent.setup();
    render(
      <AppLayout sidebar={<nav>サイドバー</nav>}>
        <div>コンテンツ</div>
      </AppLayout>,
    );
    await user.click(screen.getByRole('button', { name: 'メニューを開く' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'メニューを閉じる' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
