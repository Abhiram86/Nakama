export default function Button({
  text,
  type,
  variant,
  className,
  inputRef,
  onClick,
}: {
  text: string;
  type?: "button" | "submit" | "reset";
  variant: string;
  className?: string;
  inputRef?: React.Ref<HTMLButtonElement>;
  onClick?: () => void;
}) {
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      ref={inputRef}
      className={`px-4 py-2 rounded font-semibold text-lg ${
        variant === "primary"
          ? "bg-emerald-500 text-zinc-800 hover:bg-emerald-600 active:scale-95 transition-all"
          : "bg-zinc-700/25 hover:bg-zinc-700 text-zinc-200 active:scale-95 transition-all"
      } ${className}`}
    >
      {text}
    </button>
  );
}
