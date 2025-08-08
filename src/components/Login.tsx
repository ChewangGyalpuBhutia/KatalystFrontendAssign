import React from "react";

const COLORS = {
  background: "#f5f6fa",
  card: "#ffffff",
  border: "#e6e6e6",
  primary: "#ff4b4b",
  secondary: "#262730",
  accent: "#f63366",
  text: "#262730",
  textLight: "#6c757d",
  blue: "#2471f3",
};

type Props = { onLogin: (user: string, password: string) => void };

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError(null);
    onLogin(email, password);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        boxSizing: "border-box",
        background: COLORS.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          boxShadow: "0 2px 16px rgba(44, 62, 80, 0.07)",
          padding: "40px 32px",
          minWidth: 320,
          maxWidth: 360,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            color: COLORS.primary,
            fontWeight: 800,
            fontSize: 28,
            marginBottom: 24,
            letterSpacing: "-1px",
          }}
        >
          🔒 Login
        </h2>
        <input
          type="email"
          placeholder="chewang369@gmail.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            fontSize: 16,
            color: COLORS.text,
            background: COLORS.background,
            outline: "none",
            transition: "border 0.2s",
          }}
          autoFocus
        />
        <input
          type="password"
          placeholder="chewang369@gmail.com"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            fontSize: 16,
            color: COLORS.text,
            background: COLORS.background,
            outline: "none",
            transition: "border 0.2s",
          }}
        />
        {error && (
          <div style={{ color: COLORS.accent, marginBottom: 12, fontWeight: 500 }}>
            {error}
          </div>
        )}
        <button
          style={{
            width: "100%",
            padding: "12px",
            background: COLORS.primary,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            cursor: !email || !password ? "not-allowed" : "pointer",
            boxShadow: "0 1px 4px rgba(246, 51, 102, 0.08)",
            transition: "background 0.2s",
          }}
          onClick={handleLogin}
          disabled={!email || !password}
        >
          Login
        </button>
      </div>
    </div>
  );
}