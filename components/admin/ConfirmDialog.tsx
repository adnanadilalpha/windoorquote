"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
};

type ConfirmState = ConfirmOptions & {
  resolve: (value: boolean) => void;
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return ctx.confirm;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ ...options, resolve });
    });
  }, []);

  function close(result: boolean) {
    state?.resolve(result);
    setState(null);
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state ? (
        <ConfirmDialog
          title={state.title}
          description={state.description}
          confirmLabel={state.confirmLabel}
          cancelLabel={state.cancelLabel}
          tone={state.tone}
          onConfirm={() => close(true)}
          onCancel={() => close(false)}
        />
      ) : null}
    </ConfirmContext.Provider>
  );
}

function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
}: ConfirmOptions & {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const titleId = useId();
  const descId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-navy-800/40"
        aria-label="Close dialog"
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-navy-800/10 bg-white shadow-[0_24px_60px_rgba(15,28,42,0.18)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-navy-800/6 px-5 py-4">
          <h2 id={titleId} className="text-base font-semibold text-navy-800">
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-body-muted hover:bg-paper-200 hover:text-navy-800"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {description ? (
          <p id={descId} className="px-5 py-4 text-sm leading-relaxed text-body-muted">
            {description}
          </p>
        ) : (
          <div className="h-2" />
        )}

        <div className="flex flex-wrap justify-end gap-2 border-t border-navy-800/6 bg-paper-50 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-navy-800/12 bg-white px-4 py-2 text-sm font-medium text-navy-800 hover:bg-paper-50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold text-white",
              tone === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#12689b] hover:bg-[#0c527a]",
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
