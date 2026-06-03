"use client";

interface PasswordGateProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  error?: boolean;
}

function PasswordInput({
  value,
  onChange,
  onSubmit,
}: Pick<PasswordGateProps, "value" | "onChange" | "onSubmit">) {
  return (
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSubmit()}
      className="mt-4 w-full md:w-[200px] text-center rounded-lg border px-4 py-3 focus:ring-0 focus:outline-none"
      style={{
        maxWidth: "280px",
        backgroundColor: "#F0EEE5",
        borderColor: "#A6AA74",
        color: "#5F6A50",
        outline: "none",
      }}
      autoFocus
      aria-label="NDA password"
    />
  );
}

function PasswordDisplay({ value, onChange, onSubmit, onCancel, error }: PasswordGateProps) {
  return (
    <div className="flex flex-col items-center w-full md:w-auto">
      <h2
        className="text-center"
        style={{ fontFamily: "var(--font-fenix-var)", fontSize: "clamp(24px, 4vw, 32px)", color: "#5F6A50" }}
      >
        This section is protected by NDA
      </h2>
      <p
        className="text-center mt-2"
        style={{ fontFamily: "var(--font-fenix-var)", fontSize: "clamp(20px, 3vw, 24px)", color: "#5F6A50" }}
      >
        please enter the password below:
      </p>

      <PasswordInput value={value} onChange={onChange} onSubmit={onSubmit} />

      {error && (
        <p className="mt-2 font-geist font-light text-[14px] text-text-muted">
          wrong password
        </p>
      )}

      <button
        onClick={onCancel}
        className="mt-4 underline cursor-pointer bg-transparent border-0"
        style={{ fontFamily: "var(--font-fenix-var)", fontSize: "clamp(20px, 3vw, 24px)", color: "#5F6A50" }}
      >
        cancel
      </button>
    </div>
  );
}

export default function PasswordGate(props: PasswordGateProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6 md:px-0"
      style={{
        backgroundColor: "rgba(243, 242, 230, 0.25)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <PasswordDisplay {...props} />
    </div>
  );
}
