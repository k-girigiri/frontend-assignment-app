import { Toast as RadixToast } from 'radix-ui';

type ToastMessageProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
};

export const ToastProvider = RadixToast.Provider;

export const Toaster = () => (
  <RadixToast.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)] outline-none" />
);

export const ToastMessage = ({ open, onOpenChange, title, description }: ToastMessageProps) => (
  <RadixToast.Root
    open={open}
    onOpenChange={onOpenChange}
    className="flex items-start gap-3 bg-white rounded shadow-lg border-l-4 border-brand p-4"
  >
    <div className="flex-1">
      <RadixToast.Title className="text-sm font-bold text-text">{title}</RadixToast.Title>
      {description && (
        <RadixToast.Description className="mt-0.5 text-xs text-text-light">
          {description}
        </RadixToast.Description>
      )}
    </div>
    <RadixToast.Close
      aria-label="閉じる"
      className="mt-0.5 text-lg leading-none text-cancel transition-colors hover:text-cancel-pressed"
    >
      ×
    </RadixToast.Close>
  </RadixToast.Root>
);
