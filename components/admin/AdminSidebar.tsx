"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Factory,
  Home,
  Inbox,
  LogOut,
  Mail,
  Menu,
  Settings,
  Shield,
  ExternalLink,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/home", label: "Home", icon: Home },
  { href: "/admin/manufacturing", label: "Manufacturing", icon: Factory },
  { href: "/admin/privacy", label: "Privacy", icon: Shield },
  { href: "/admin/contact-inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/email", label: "Email setup", icon: Mail },
  { href: "/admin/admins", label: "Admins", icon: Users },
  { href: "/admin/settings", label: "Site & Nav", icon: Settings },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const sidebar = (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-navy-800/8 bg-white transition-transform duration-200 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="border-b border-navy-800/8 px-5 py-4">
        <Link
          href="/admin/home"
          className="block"
          onClick={() => setMobileOpen(false)}
        >
          <p className="text-sm font-semibold tracking-tight text-navy-800">
            WinDoor Quote
          </p>
          <p className="mt-0.5 text-xs text-body-muted">Content CMS</p>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Admin">
        <ul className="flex flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex h-9 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-[#12689b] text-white! [&_svg]:text-white!"
                      : "text-body-muted hover:bg-paper-200 hover:text-navy-800",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-1 border-t border-navy-800/8 px-3 py-3">
        <p className="truncate px-2 text-xs text-body-muted">{email}</p>
        <Link
          href="/"
          target="_blank"
          className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-body-muted hover:bg-paper-200 hover:text-navy-800"
        >
          <ExternalLink className="size-4" />
          View site
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-sm font-medium text-body-muted hover:bg-paper-200 hover:text-navy-800"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 inline-flex size-10 items-center justify-center rounded-lg border border-navy-800/10 bg-white text-navy-800 shadow-sm lg:hidden"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-navy-800/30 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
      {sidebar}
    </>
  );
}
