import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper-50 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-[14px] border border-navy-800/10 bg-white shadow-[0_20px_60px_rgba(15,31,61,0.08)]">
        <div className="border-b border-navy-800/6 px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">
            WinDoor Quote
          </p>
          <h1 className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-navy-800">
            Sign in to CMS
          </h1>
          <p className="mt-1 text-sm text-body-muted">
            Use your admin email and password.
          </p>
        </div>
        <div className="px-6 py-6 sm:px-8 sm:py-7">
          <Suspense fallback={<p className="text-sm text-body-muted">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
