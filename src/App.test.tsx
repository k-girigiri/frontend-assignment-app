import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '@/App';

vi.mock('@/generated/endpoints/content/content', () => ({
  useContentControllerGetAllContentList: () => ({
    data: undefined,
    isLoading: true,
    isError: false,
  }),
  useContentControllerGetContent: () => ({ data: undefined, isLoading: false, isError: false }),
  useContentControllerAddContent: () => ({ mutate: vi.fn(), isPending: false }),
  useContentControllerUpdateContent: () => ({ mutate: vi.fn(), isPending: false }),
  useContentControllerDeleteContent: () => ({
    mutate: vi.fn(),
    isPending: false,
    variables: undefined,
  }),
  getContentControllerGetAllContentListQueryKey: () => ['/content'],
  getContentControllerGetContentQueryKey: (id: number) => [`/content/${id}`],
}));

const createWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

describe('App', () => {
  it('サービス名を表示する', () => {
    render(<App />, { wrapper: createWrapper() });
    expect(screen.getByText('ServiceName')).toBeInTheDocument();
  });
});
