import type { ReactNode } from 'react';

type Props = {
  variant?: 'primary' | 'secondary' | 'cancel';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

const base =
  'inline-flex flex-col items-center justify-center h-10 rounded transition-colors ' +
  'disabled:opacity-25 disabled:cursor-not-allowed ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

const sizes: Record<NonNullable<Props['size']>, string> = {
  sm: 'w-10',
  md: 'min-w-[90px] px-3',
};

const variants: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark active:bg-brand-pressed',
  secondary: 'bg-white text-brand border-2 border-brand hover:bg-[#cccccc] active:bg-cancel',
  cancel: 'bg-cancel text-white hover:bg-cancel-dark active:bg-cancel-pressed',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  icon,
  type = 'button',
  disabled = false,
  onClick,
  children,
}: Props) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={`${base} ${sizes[size]} ${variants[variant]}`}
  >
    {icon}
    <span className="text-minimum font-bold leading-none">{children}</span>
  </button>
);
