"use client";

import { useState, useRef, useEffect } from "react";
import { verifyPassword } from "./actions";

interface Props {
  onSuccess: () => void;
}

export default function PasswordGate({ onSuccess }: Props) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pwd = inputRef.current?.value ?? "";
    if (!pwd || loading) return;
    setLoading(true);
    setError(false);
    const ok = await verifyPassword(pwd);
    setLoading(false);
    if (ok) {
      onSuccess();
    } else {
      setError(true);
      if (inputRef.current) inputRef.current.value = "";
      inputRef.current?.focus();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <p
        className="text-center"
        style={{ fontFamily: "var(--font-fenix-var)", fontSize: "20px", color: "#5F6A50" }}
      >
        This section is protected by NDA
      </p>
      <p
        className="text-center mt-[8px]"
        style={{ fontFamily: "var(--font-fenix-var)", fontSize: "16px", color: "#5F6A50" }}
      >
        please enter the password below:
      </p>
      <input
        ref={inputRef}
        type="password"
        className="mt-[16px] w-[200px] h-[48px] text-center rounded-lg border disabled:opacity-50 outline-none"
        style={{
          backgroundColor: "#F0EEE5",
          borderColor: "#E5E3DA",
          color: "#5F6A50",
          letterSpacing: "8px",
        }}
        disabled={loading}
        autoComplete="current-password"
      />
      {error && (
        <p className="mt-[8px] font-geist font-light text-[14px] text-text-muted">
          wrong password
        </p>
      )}
    </form>
  );
}
