export function Form({
  children,
  className,
  onSubmit,
}: {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={`text-zinc-100 flex flex-col p-6 gap-y-3 ${className}`}
    >
      {children}
    </form>
  );
}

export function Label({
  text,
  id,
  className,
}: {
  text: string;
  id: string;
  className?: string;
}) {
  return (
    <label className={className} htmlFor={id}>
      {text}
    </label>
  );
}

export function Input({
  placeholder,
  id,
  minLength,
  className,
  type,
  inputRef,
}: {
  placeholder?: string;
  id: string;
  minLength?: number;
  className?: string;
  type?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <input
      type={type || "text"}
      id={id}
      ref={inputRef}
      placeholder={placeholder || ""}
      minLength={minLength || 1}
      className={`px-4 py-2 rounded bg-zinc-700/25 text-zinc-200 ${className}`}
    />
  );
}
