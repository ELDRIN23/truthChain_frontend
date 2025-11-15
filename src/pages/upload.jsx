import React, { useEffect, useState } from "react";

export default function Layout() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [serverRaw, setServerRaw] = useState(null);
  const [hfAvailable, setHfAvailable] = useState(true);
  const [checkingHealth, setCheckingHealth] = useState(true);
  const [publishResult, setPublishResult] = useState(null);

  // THEME
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "light" ? "dark" : "light"));

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

  // Health + history
  async function checkHealth() {
    setCheckingHealth(true);
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      const data = await res.json().catch(() => ({}));
      setHfAvailable(Boolean(data.hf ?? true));
    } catch (err) {
      setHfAvailable(false);
      setError("Cannot reach backend /api/health");
    } finally {
      setCheckingHealth(false);
    }
  }

  async function fetchRecords() {
    try {
      const res = await fetch(`${API_BASE}/api/records`);
      const data = await res.json();
      if (data?.ok) setHistory(data.records || []);
    } catch {}
  }

  useEffect(() => {
    (async () => {
      await checkHealth();
      await fetchRecords();
    })();
  }, []);

  const handleFileChange = (e) =>
    setFiles(Array.from(e.target.files || []));

  // Analyze
  const analyzeImages = async () => {
    setError("");
    setServerRaw(null);
    setResults([]);
    setPublishResult(null);

    if (!files.length) return setError("Select files first");
    if (!hfAvailable) return setError("HuggingFace token missing");

    setLoading(true);
    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));

      const resp = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        body: form,
      });

      const text = await resp.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        setServerRaw({ status: resp.status, rawText: text });
        throw new Error("Invalid JSON response");
      }

      setServerRaw(json);
      if (!resp.ok || !json.ok) throw new Error(json.message || "Error");

      setResults(json.results || []);
      await fetchRecords();
      setFiles([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  async function publishHash(id) {
    setPublishResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/publish/${id}`, {
        method: "POST",
      });

      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Invalid publish JSON");
      }

      if (!res.ok || !json.ok) throw new Error(json.message);
      setPublishResult(json.payload);
      alert("Hash published!");
    } catch (err) {
      setError(err.message);
    }
  }

  const fmt = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  };

  // verdict badge
  function Verdict({ v }) {
    if (v === "FAKE IMAGE")
      return <span className="font-bold text-red-500">FAKE IMAGE</span>;
    if (v === "ORIGINAL IMAGE")
      return <span className="font-bold text-green-500">ORIGINAL</span>;
    return <span className="font-bold text-yellow-500">UNKNOWN</span>;
  }

  // THEME COLORS
  const deepPurple = "#6b21a8";
  const lightPurple = "#b453ff";

  const bgMain =
    theme === "light"
      ? "linear-gradient(180deg, #f8f0ff 0%, #fff 100%)"
      : "linear-gradient(180deg, #1a0b29 0%, #0f0518 100%)";

  const cardBg = theme === "light" ? "#ffffff" : "#1f1b24";
  const cardBorder =
    theme === "light"
      ? "rgba(107,33,168,0.15)"
      : "rgba(255,255,255,0.12)";

  const textPrimary = theme === "light" ? "#111" : "#e9e9e9";
  const textSecondary = theme === "light" ? "#555" : "#bbb";

  return (
    <div
      style={{ background: bgMain }}
      className="min-h-screen p-6 flex flex-col items-center gap-6"
    >
      {/* HEADER */}
      <div
        style={{ background: deepPurple, color: "white" }}
        className="w-full max-w-4xl p-4 rounded-xl shadow-md flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: lightPurple,
            }}
            className="flex items-center justify-center font-bold text-white"
          >
            TC
          </div>
          <div>
            <div className="font-bold text-lg">TruthChain</div>
            <div className="text-sm opacity-90">
              AI-powered content authenticity
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {checkingHealth ? (
            <span className="text-sm opacity-80">Checking...</span>
          ) : hfAvailable ? (
            <span className="text-sm">HuggingFace ✓</span>
          ) : (
            <span className="text-sm text-red-300">
              HF missing (token error)
            </span>
          )}

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="btn btn-sm rounded-lg px-3"
            style={{
              background: lightPurple,
              border: "none",
              color: "white",
            }}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </div>

      {/* UPLOAD CARD */}
      <div
        className="w-full max-w-2xl p-6 rounded-xl border shadow-sm"
        style={{ background: cardBg, borderColor: cardBorder }}
      >
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: deepPurple }}
        >
          Analyze Images / Videos
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="file"
            multiple
            className="file-input file-input-bordered w-full"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />

          <button
            onClick={analyzeImages}
            disabled={loading || !hfAvailable}
            className="btn"
            style={{
              background: deepPurple,
              color: "white",
              borderRadius: 8,
              padding: "0.5rem 1rem",
            }}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          <button
            onClick={() => {
              fetchRecords();
              checkHealth();
            }}
            className="btn btn-ghost"
            style={{
              border: `1px solid ${lightPurple}`,
              color: deepPurple,
            }}
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2 text-sm text-red-400 bg-red-950/40 rounded">
            {error}
          </div>
        )}
      </div>

      {/* RESULTS */}
      <div
        className="w-full max-w-2xl p-4 rounded-xl border"
        style={{ background: cardBg, borderColor: cardBorder }}
      >
        <h3 className="text-lg font-bold mb-2" style={{ color: deepPurple }}>
          Latest Results
        </h3>

        {results.length === 0 ? (
          <p style={{ color: textSecondary }}>
            No results yet. Upload a file.
          </p>
        ) : (
          <ul className="space-y-3">
            {results.map((r) => (
              <li
                key={r.id}
                className="p-3 rounded-lg border flex items-start justify-between gap-3"
                style={{ borderColor: cardBorder }}
              >
                <div>
                  <div style={{ color: deepPurple }} className="font-medium">
                    {r.filename}
                  </div>
                  <div style={{ color: textSecondary }}>
                    {r.aiSummary || "No summary"}
                  </div>

                  <div>
                    <strong style={{ color: textPrimary }}>Verdict:</strong>{" "}
                    <Verdict v={r.verdict} />
                  </div>

                  <div className="text-xs" style={{ color: textSecondary }}>
                    Hash: <code>{r.hash}</code>
                  </div>

                  <div className="text-xs" style={{ color: textSecondary }}>
                    {fmt(r.createdAt)}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() =>
                      setServerRaw({ lastViewed: r, raw: r.raw })
                    }
                    className="btn btn-sm"
                    style={{
                      borderColor: lightPurple,
                      color: deepPurple,
                    }}
                  >
                    View Raw
                  </button>

                  <button
                    onClick={() => publishHash(r.id)}
                    className="btn btn-sm"
                    style={{
                      background: lightPurple,
                      color: "white",
                    }}
                  >
                    Publish Hash
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* HISTORY */}
      <div
        className="w-full max-w-4xl p-4 rounded-xl border"
        style={{ background: cardBg, borderColor: cardBorder }}
      >
        <h3 className="text-lg font-bold mb-2" style={{ color: deepPurple }}>
          History
        </h3>

        {history.length === 0 ? (
          <p style={{ color: textSecondary }}>No history yet.</p>
        ) : (
          <div className="space-y-2">
            {history.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-lg border flex items-center justify-between"
                style={{ borderColor: cardBorder }}
              >
                <div>
                  <div
                    className="font-medium"
                    style={{ color: deepPurple }}
                  >
                    {r.filename}
                  </div>
                  <div style={{ color: textSecondary }}>
                    {r.aiSummary || "—"}
                  </div>

                  <div>
                    <strong>Verdict: </strong>
                    <Verdict v={r.verdict} />
                  </div>

                  <div className="text-xs" style={{ color: textSecondary }}>
                    Hash: {r.hash}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      setServerRaw({ lastViewed: r, raw: r.raw })
                    }
                    style={{ borderColor: lightPurple, color: deepPurple }}
                  >
                    View
                  </button>

                  <button
                    className="btn btn-sm btn-outline"
                    style={{ borderColor: lightPurple, color: deepPurple }}
                    onClick={async () => {
                      const newSummary = prompt(
                        "Edit summary:",
                        r.aiSummary
                      );
                      if (newSummary != null) {
                        await fetch(`${API_BASE}/api/records/${r.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            aiSummary: newSummary,
                          }),
                        });
                        fetchRecords();
                      }
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm"
                    style={{ background: "#ffefef", color: "#b91c1c" }}
                    onClick={async () => {
                      if (!confirm("Delete?")) return;
                      await fetch(`${API_BASE}/api/records/${r.id}`, {
                        method: "DELETE",
                      });
                      fetchRecords();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SERVER DEBUG */}
      <div
        className="w-full max-w-4xl p-4 rounded-xl border"
        style={{ background: cardBg, borderColor: cardBorder }}
      >
        <div className="flex justify-between items-center">
          <span className="font-bold" style={{ color: deepPurple }}>
            Server Debug
          </span>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setServerRaw(null)}
          >
            Clear
          </button>
        </div>

        <pre
          style={{
            background: theme === "light" ? "#fafafa" : "#0d0a11",
            color: textSecondary,
            padding: 10,
            borderRadius: 6,
            maxHeight: 250,
            overflow: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {serverRaw
            ? JSON.stringify(serverRaw, null, 2)
            : "No server output"}
        </pre>
      </div>

      {/* Publish Popup */}
      {publishResult && (
        <div
          className="fixed bottom-6 right-6 rounded-lg shadow-xl p-4 border"
          style={{
            background: cardBg,
            borderColor: cardBorder,
            minWidth: 300,
          }}
        >
          <div
            className="font-bold mb-2"
            style={{ color: deepPurple }}
          >
            Publish Payload
          </div>
          <pre style={{ fontSize: 12 }}>
            {JSON.stringify(publishResult, null, 2)}
          </pre>
          <div className="text-right mt-3">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setPublishResult(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
