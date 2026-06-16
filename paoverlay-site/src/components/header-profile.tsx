"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./auth-provider";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, LogOut } from "lucide-react";

export function HeaderProfile() {
  const { user, loading, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/20 bg-white/5">
        <Loader2 className="h-4 w-4 animate-spin text-white" />
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={login}
        className="rounded-md bg-[#00ffa3] px-4 py-2 text-[13px] font-bold text-black transition hover:bg-[#00e592] hover:shadow-[0_0_15px_rgba(0,255,163,0.4)]"
      >
        Get started
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center overflow-hidden rounded-full border-2 border-transparent transition-all hover:border-[#137d57]/50"
      >
        <img
          src={user.picture}
          alt={user.name}
          className="h-9 w-9 rounded-full object-cover"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-64 rounded-xl border border-white/10 bg-[#0c1015] shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/10 p-4">
              <img
                src={user.picture}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{user.name}</span>
                <span className="text-xs text-[#7e8fa3] truncate max-w-[150px]">{user.email}</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#7e8fa3] uppercase tracking-wider">
                Subscription
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 border border-white/5">
                <span className="text-sm font-medium text-white">Free Plan</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white uppercase">
                  Not Subscribed
                </span>
              </div>
              <a href="#pricing" onClick={() => setIsOpen(false)} className="mt-2 block w-full rounded-md bg-[#137d57] px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-[#0f6345]">
                Upgrade to Pro
              </a>
            </div>

            <div className="border-t border-white/10 p-2">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#e05555] transition hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
