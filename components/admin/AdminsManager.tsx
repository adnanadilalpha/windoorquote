"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Trash2,
  UserPlus,
} from "lucide-react";
import {
  createAdmin,
  removeAdmin,
  resetAdminPassword,
  type AdminRow,
} from "@/lib/actions/admins";
import { useConfirm } from "@/components/admin/ConfirmDialog";

type Props = {
  admins: AdminRow[];
  currentUserId: string;
};

function PasswordInput({
  name,
  value,
  onChange,
  placeholder = "At least 8 characters",
  required,
  minLength = 8,
  id,
}: {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  id?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const controlled = value !== undefined;
  const currentValue = controlled ? value : undefined;

  async function copyPassword() {
    const text =
      currentValue ??
      (name
        ? String(
            (document.getElementById(id ?? name) as HTMLInputElement | null)
              ?.value ?? "",
          )
        : "");
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be blocked; ignore.
    }
  }

  return (
    <div className="flex gap-1.5">
      <div className="relative min-w-0 flex-1">
        <input
          id={id ?? name}
          name={name}
          type={visible ? "text" : "password"}
          value={currentValue}
          onChange={
            onChange ? (e) => onChange(e.target.value) : undefined
          }
          required={required}
          minLength={minLength}
          autoComplete="new-password"
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border border-navy-800/12 bg-white py-2 pr-11 pl-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-body-muted hover:bg-paper-200 hover:text-navy-800"
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      <button
        type="button"
        onClick={() => void copyPassword()}
        className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-navy-800/12 px-3 text-xs font-medium text-navy-800 hover:bg-paper-50"
        title="Copy password"
      >
        {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export default function AdminsManager({ admins, currentUserId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passwordFor, setPasswordFor] = useState<string | null>(null);
  const [createPassword, setCreatePassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const confirm = useConfirm();

  function clearAlerts() {
    setMessage(null);
    setError(null);
  }

  function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const password = createPassword || String(data.get("password") ?? "");

    clearAlerts();
    startTransition(async () => {
      const result = await createAdmin({ email, password });
      if (result.error) {
        setError(result.error);
        return;
      }
      form.reset();
      setCreatePassword("");
      setMessage("Admin created. They can sign in at /admin/login.");
      router.refresh();
    });
  }

  function onChangePassword(userId: string) {
    clearAlerts();
    startTransition(async () => {
      const result = await resetAdminPassword({
        userId,
        password: newPassword,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setPasswordFor(null);
      setNewPassword("");
      setMessage("Password updated.");
      router.refresh();
    });
  }

  async function onRemove(userId: string, email: string) {
    const ok = await confirm({
      title: "Remove admin?",
      description: `Remove admin access for ${email}? They will no longer be able to sign in.`,
      confirmLabel: "Remove",
      tone: "danger",
    });
    if (!ok) return;
    clearAlerts();
    startTransition(async () => {
      const result = await removeAdmin(userId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage("Admin removed.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      {message ? (
        <div className="rounded-[10px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="admin-card">
        <h2>Add admin</h2>
        <p className="mb-3 text-sm text-body-muted">
          Creates an email/password login with immediate access. No email
          verification.
        </p>
        <form className="space-y-4" onSubmit={onCreate}>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-navy-800/80">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="off"
              placeholder="name@company.com"
              className="h-11 rounded-lg border border-navy-800/12 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-navy-800/80">Password</span>
            <PasswordInput
              name="password"
              id="create-admin-password"
              value={createPassword}
              onChange={setCreatePassword}
              required
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
          >
            <UserPlus className="size-4" />
            {pending ? "Saving…" : "Create admin"}
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-navy-800/8 bg-white">
        <div className="border-b border-navy-800/6 px-5 py-4">
          <h2 className="text-sm font-semibold text-navy-800">
            Admins ({admins.length})
          </h2>
          <p className="mt-1 text-xs text-body-muted">
            Existing passwords cannot be recovered — use Change password to set
            a new one.
          </p>
        </div>
        <ul className="divide-y divide-navy-800/6">
          {!admins.length ? (
            <li className="px-5 py-6 text-sm text-body-muted">No admins yet.</li>
          ) : (
            admins.map((admin) => {
              const isYou = admin.user_id === currentUserId;
              const editing = passwordFor === admin.user_id;
              return (
                <li key={admin.user_id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-navy-800">
                        {admin.email}
                        {isYou ? (
                          <span className="admin-badge ml-2">You</span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-xs text-body-muted">
                        Added {new Date(admin.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          clearAlerts();
                          setPasswordFor(editing ? null : admin.user_id);
                          setNewPassword("");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-navy-800/12 px-3 py-1.5 text-xs font-medium text-navy-800 hover:bg-paper-50 disabled:opacity-60"
                      >
                        <KeyRound className="size-3.5" />
                        {editing ? "Cancel" : "Change password"}
                      </button>
                      {!isYou ? (
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => onRemove(admin.user_id, admin.email)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-navy-800/12 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          <Trash2 className="size-3.5" />
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {editing ? (
                    <div className="mt-3 space-y-3 rounded-lg border border-navy-800/8 bg-paper-50 p-3">
                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs text-navy-800/80">
                          New password
                        </span>
                        <PasswordInput
                          id={`change-password-${admin.user_id}`}
                          value={newPassword}
                          onChange={setNewPassword}
                          required
                        />
                      </label>
                      <button
                        type="button"
                        disabled={pending || newPassword.length < 8}
                        onClick={() => onChangePassword(admin.user_id)}
                        className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
                      >
                        {pending ? "Saving…" : "Save new password"}
                      </button>
                    </div>
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
