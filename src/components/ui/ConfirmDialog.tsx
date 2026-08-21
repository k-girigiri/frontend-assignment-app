import { Dialog } from 'radix-ui';
import { Button } from './Button';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
};

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = '削除する',
  onConfirm,
}: Props) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
      <Dialog.Content
        role="alertdialog"
        className="fixed left-1/2 top-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none"
      >
        <Dialog.Title className="mb-2 text-base font-bold text-text">{title}</Dialog.Title>
        {description && (
          <Dialog.Description className="mb-4 text-xs text-text-light">
            {description}
          </Dialog.Description>
        )}
        <div className="mt-4 flex justify-end gap-[10px]">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
