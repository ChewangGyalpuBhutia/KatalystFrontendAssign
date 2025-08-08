import React, { useState } from "react";

// Streamlit-inspired colors
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

async function getGeminiSummary(text: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
      }),
    }
  );
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";
}

export default function Meetings() {
  const [userId] = useState<string>("chewang369@gmail.com");
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<{ [id: string]: string }>({});
  const [summarizing, setSummarizing] = useState<string | null>(null);

  const fetchMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://my-express-app-azure.vercel.app/meetings/${userId}`);
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.items)) {
        const now = new Date();
        const upcomingMeetings = data.data.items
          .filter((m: any) => new Date(m.start?.dateTime || m.start?.date) >= now)
          .sort((a: any, b: any) =>
            new Date(a.start?.dateTime || a.start?.date).getTime() -
            new Date(b.start?.dateTime || b.start?.date).getTime()
          );
        const pastMeetings = data.data.items
          .filter((m: any) => new Date(m.start?.dateTime || m.start?.date) < now)
          .sort((a: any, b: any) =>
            new Date(b.start?.dateTime || b.start?.date).getTime() -
            new Date(a.start?.dateTime || a.start?.date).getTime()
          );
        setUpcoming(upcomingMeetings);
        setPast(pastMeetings);
      } else {
        setUpcoming([]);
        setPast([]);
        setError("No meetings found.");
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch meetings.");
      setUpcoming([]);
      setPast([]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchMeetings();
    // eslint-disable-next-line
  }, []);

  const handleSummarize = async (id: string, desc: string) => {
    setSummarizing(id);
    const summary = await getGeminiSummary(desc);
    setSummaries((prev) => ({ ...prev, [id]: summary }));
    setSummarizing(null);
  };

  const renderMeeting = (m: any) => (
    <div
      key={m.id}
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        boxShadow: "0 2px 8px rgba(44, 62, 80, 0.04)",
        marginBottom: 24,
        padding: 24,
        transition: "box-shadow 0.2s",
        maxWidth: 600,
        width: "100%",
      }}
      className="meeting-card"
    >
      <div style={{ fontWeight: 700, fontSize: 20, color: COLORS.secondary }}>
        {m.summary}
      </div>
      <div style={{ color: COLORS.textLight, margin: "8px 0" }}>
        <span>
          {m.start?.dateTime
            ? new Date(m.start.dateTime).toLocaleString()
            : ""}
        </span>
        {" — "}
        <span>
          {m.end?.dateTime
            ? new Date(m.end.dateTime).toLocaleString()
            : ""}
        </span>
      </div>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontWeight: 500, color: COLORS.text }}>Attendees:</span>{" "}
        <span style={{ color: COLORS.textLight }}>
          {m.attendees?.map((a: any) => a.email).join(", ")}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        {m.hangoutLink && (
          <a
            href={m.hangoutLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: COLORS.blue,
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            Google Meet Link
          </a>
        )}
        {m.location && m.location.startsWith("http") && (
          <a
            href={m.location}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: COLORS.blue,
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            Meeting Link
          </a>
        )}
        {m.conferenceData?.entryPoints?.[0]?.uri && (
          <a
            href={m.conferenceData.entryPoints[0].uri}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: COLORS.blue,
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            Conference Link
          </a>
        )}
      </div>
      {m.description && (
        <>
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              fontSize: 15,
              color: COLORS.text,
              wordBreak: "break-word",
            }}
          >
            {m.description}

            {summaries[m.id] && (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  background: "#fff0f6",
                  borderRadius: 6,
                  color: COLORS.accent,
                  fontWeight: 500,
                  fontSize: 15,
                }}
              >
                <span style={{ fontWeight: 700 }}>Summary:</span> {summaries[m.id]}
              </div>
            )}
          </div>
          <button
            style={{
              marginLeft: 12,
              padding: "4px 12px",
              background: COLORS.primary,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              cursor: summarizing === m.id ? "not-allowed" : "pointer",
              fontSize: 14,
              transition: "background 0.2s",
            }}
            onClick={() => handleSummarize(m.id, m.description)}
            disabled={summarizing === m.id}
          >
            {summarizing === m.id ? "Summarizing..." : "Summarize"}
          </button>
        </>
      )}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        boxSizing: "border-box",
        background: COLORS.background,
        padding: "32px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontWeight: 800,
            fontSize: 32,
            color: COLORS.primary,
            marginBottom: 24,
            letterSpacing: "-1px",
            textAlign: "center",
          }}
        >
          📅 Upcoming Meetings
        </h2>
        {loading && (
          <div style={{ color: COLORS.textLight, marginBottom: 16, textAlign: "center" }}>
            Loading...
          </div>
        )}
        {error && (
          <div style={{ color: COLORS.accent, marginBottom: 16, textAlign: "center" }}>{error}</div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 40,
            alignItems: "center",
          }}
        >
          {upcoming.length === 0 && !loading && !error && (
            <div
              style={{
                color: COLORS.textLight,
                background: "#fff",
                borderRadius: 8,
                padding: 16,
                textAlign: "center",
              }}
            >
              No upcoming meetings.
            </div>
          )}
          {upcoming.map(renderMeeting)}
        </div>
        <h2
          style={{
            fontWeight: 800,
            fontSize: 32,
            color: COLORS.secondary,
            marginBottom: 24,
            letterSpacing: "-1px",
            textAlign: "center",
          }}
        >
          🕓 Past Meetings
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "center",
          }}
        >
          {past.length === 0 && !loading && !error && (
            <div
              style={{
                color: COLORS.textLight,
                background: "#fff",
                borderRadius: 8,
                padding: 16,
                textAlign: "center",
              }}
            >
              No past meetings.
            </div>
          )}
          {past.map(renderMeeting)}
        </div>
      </div>
    </div>
  );
}