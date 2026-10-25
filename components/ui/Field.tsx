import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-lg border border-line bg-cream/60 px-4 py-3 text-charcoal placeholder:text-stone/60 " +
  "transition-colors duration-200 hover:border-moss focus:border-forest focus:bg-cream focus:outline-none " +
  "aria-[invalid=true]:border-terracotta";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

/** Labelled text input with accessible error message. */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const msgId = `${inputId}-msg`;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-charcoal">
        {label}
        {props.required && <span className="text-terracotta"> *</span>}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? msgId : undefined}
        className={control}
        {...props}
      />
      {(error || hint) && (
        <p id={msgId} className={cn("mt-1.5 text-sm", error ? "text-terracotta" : "text-stone")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
});

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, className, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const msgId = `${inputId}-msg`;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-charcoal">
        {label}
        {props.required && <span className="text-terracotta"> *</span>}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? msgId : undefined}
        className={cn(control, "min-h-36 resize-y")}
        {...props}
      />
      {error && (
        <p id={msgId} className="mt-1.5 text-sm text-terracotta">
          {error}
        </p>
      )}
    </div>
  );
});
