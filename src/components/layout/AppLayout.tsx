import { Dialog } from 'radix-ui';
import { type ReactNode, useState } from 'react';
import { Toaster, ToastProvider } from '@/components/ui/Toast';

type SidebarSlot = {
  onNavigate?: () => void;
};

type Props = {
  sidebar: ReactNode | ((slot: SidebarSlot) => ReactNode);
  children: ReactNode;
};

export const AppLayout = ({ sidebar, children }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const renderSidebar = (slot: SidebarSlot) =>
    typeof sidebar === 'function' ? sidebar(slot) : sidebar;

  return (
    <ToastProvider>
      <div className="flex h-screen bg-white">
        <aside className="hidden md:flex w-70 shrink-0 flex-col border-r border-separator">
          {renderSidebar({})}
        </aside>

        <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40 md:hidden" />
            <Dialog.Content className="fixed inset-y-0 left-0 w-70 flex flex-col bg-white shadow-xl z-50 md:hidden focus:outline-none">
              <Dialog.Title className="sr-only">メニュー</Dialog.Title>
              <div className="flex justify-end p-2">
                <Dialog.Close
                  aria-label="メニューを閉じる"
                  className="p-1 rounded text-cancel hover:text-[#808080] transition-colors focus-visible:outline-2 focus-visible:outline-brand"
                >
                  <img src="/icons/cancel.svg" alt="" width={24} height={24} aria-hidden />
                </Dialog.Close>
              </div>
              {renderSidebar({ onNavigate: () => setDrawerOpen(false) })}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="fixed top-0 left-0 right-0 h-12 bg-white border-b border-separator flex items-center px-4 z-30 md:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="メニューを開く"
            className="flex flex-col gap-1.5 p-1 rounded focus-visible:outline-2 focus-visible:outline-brand"
          >
            <span className="w-5 h-0.5 bg-text rounded-full" />
            <span className="w-5 h-0.5 bg-text rounded-full" />
            <span className="w-5 h-0.5 bg-text rounded-full" />
          </button>
        </div>

        <main className="flex min-w-0 flex-1 flex-col pt-12 md:pt-[30px] md:px-10">
          <div className="min-h-0 flex-1 overflow-auto bg-surface md:rounded-[16px]">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </ToastProvider>
  );
};
