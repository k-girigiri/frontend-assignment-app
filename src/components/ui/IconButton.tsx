type Props = {
  src: string;
  alt: string;
  'aria-label': string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  onClick?: () => void;
};

const sizes: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
};

export const IconButton = ({
  src,
  alt,
  'aria-label': ariaLabel,
  size = 'md',
  disabled = false,
  onClick,
}: Props) => (
  <button
    type="button"
    aria-label={ariaLabel}
    disabled={disabled}
    onClick={onClick}
    className={[
      'inline-flex items-center justify-center rounded transition-colors',
      'hover:bg-[#e6e6e6] active:bg-[#cccccc]',
      'disabled:opacity-25 disabled:cursor-not-allowed',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
      sizes[size],
    ].join(' ')}
  >
    <img src={src} alt={alt} width={24} height={24} />
  </button>
);
