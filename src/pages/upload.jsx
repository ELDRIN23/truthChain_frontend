import React, { useEffect, useState } from "react";

/**
 * Layout.jsx
 * - Uses deep purple #6b21a8 and light purple #b453ff
 * - Calls GET /api/health to check HF token presence and disables analyze when missing
 * - Works with the CRUD endpoints from your backend
 */

export default function Layout() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]); // last analyze results
  const [history, setHistory] = useState([]); // persisted records from backend
  const [error, setError] = useState("");
  const [viewRaw, setViewRaw] = useState(null);
  const [hfAvailable, setHfAvailable] = useState(true); // assume true until health check
  const [checkingHealth, setCheckingHealth] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

  // ---------- Health check ----------
  async function checkHealth() {
    setCheckingHealth(true);
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      const data = await res.json().catch(() => ({}));
      // backend should return { ok: true, hf: true/false, env: '...' }
      if (res.ok && typeof data.hf !== "undefined") {
        setHfAvailable(Boolean(data.hf));
      } else {
        // if backend doesn't report hf, conservatively treat as available but warn
        setHfAvailable(true);
      }
    } catch (err) {
      console.warn("Health check failed:", err);
      // If health check fails entirely, set hfAvailable false to prevent calls
      setHfAvailable(false);
      setError("Cannot reach backend /api/health");
    } finally {
      setCheckingHealth(false);
    }
  }

  // ---------- Helpers: CRUD calls ----------
  async function fetchRecords() {
    try {
      const res = await fetch(`${API_BASE}/api/records`);
      if (!res.ok) throw new Error("Failed to fetch records");
      const data = await res.json();
      if (data.ok) setHistory(data.records || []);
    } catch (err) {
      console.warn("fetchRecords:", err);
      setError(err.message || "Could not load history");
    }
  }

  async function removeRecord(id) {
    if (!confirm("Delete this record?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/records/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      setHistory(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("removeRecord:", err);
      setError(err.message || "Delete failed");
    }
  }

  async function patchRecord(id, patch) {
    try {
      const res = await fetch(`${API_BASE}/api/records/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setHistory(prev => prev.map(r => (r.id === id ? data.record : r)));
      return true;
    } catch (err) {
      console.error("patchRecord:", err);
      setError(err.message || "Update failed");
      return false;
    }
  }

  // ---------- Lifecycle ----------
  useEffect(() => {
    (async () => {
      await checkHealth();
      await fetchRecords();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- File handling ----------
  const handleFileChange = (e) => setFiles(Array.from(e.target.files || []));

  const analyzeImages = async () => {
    if (!files.length) return alert("Select files first");

    if (!hfAvailable) {
      return alert("Hugging Face token missing on server. Check backend env.");
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));

      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Backend Error");
      }

      // show immediate results
      setResults(data.results || []);

      // refresh persisted history
      await fetchRecords();

      // clear selection
      setFiles([]);
    } catch (err) {
      console.error("analyzeImages:", err);
      setError(err.message || "Analyze failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI actions ----------
  const handleEdit = async (rec) => {
    const newSummary = prompt("Edit summary:", rec.aiSummary || "");
    if (newSummary === null) return;
    const ok = await patchRecord(rec.id, { aiSummary: newSummary });
    if (ok) {
      setResults(prev => prev.map(r => (r.filename === rec.filename ? { ...r, aiSummary: newSummary } : r)));
    }
  };

  const handleViewRaw = (rec) => setViewRaw(rec);
  const closeRaw = () => setViewRaw(null);
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleString(); } catch { return iso; } };

  // Theme colors
  const deepPurple = "#6b21a8";
  const lightPurple = "#b453ff";
  const cardStyle = { borderColor: "rgba(107,33,168,0.12)" };

  return (
    <div style={{ background: "linear-gradient(180deg, #f8f0ff 0%, #fff 100%)" }} className="min-h-screen p-6 flex flex-col items-center gap-6">
      {/* top banner */}
      <div style={{ background: deepPurple, color: "white" }} className="w-full max-w-4xl p-4 rounded-xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 10, background: lightPurple }} className="flex items-center justify-center font-bold text-white">
            TC
          </div>
          <div>
            <div className="font-bold text-lg">TruthChain</div>
            <div className="text-sm opacity-90">AI-powered content authenticity</div>
          </div>
        </div>

        <div className="text-right">
          {checkingHealth ? (
            <div className="text-sm opacity-90">Checking server...</div>
          ) : hfAvailable ? (
            <div className="text-sm">HuggingFace ready ✓</div>
          ) : (
            <div className="text-sm font-medium">HF token missing — analyze disabled</div>
          )}
        </div>
      </div>

      {/* main card */}
      <div className="w-full max-w-2xl p-6 rounded-xl border bg-white shadow-sm" style={cardStyle}>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: deepPurple }}>Analyze Images</h2>

        {/* HF missing warning */}
        {!hfAvailable && !checkingHealth && (
          <div className="mb-3 p-3 rounded-md" style={{ background: "#fff0f6", border: `1px solid ${lightPurple}`, color: deepPurple }}>
            <strong>Server missing HF token.</strong>
            <div className="text-sm mt-1">Set <code>HF_API_TOKEN</code> in your backend .env or in Vercel environment variables. See instructions below.</div>
            <div className="text-xs mt-2">You can still view history and manage records.</div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />

          <button
            onClick={analyzeImages}
            disabled={loading || !hfAvailable}
            className="btn"
            style={{
              background: hfAvailable ? deepPurple : "#aaa",
              color: "white",
              borderRadius: 8,
              padding: "0.5rem 1rem",
              minWidth: 120,
            }}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          <button
            onClick={() => { fetchRecords(); checkHealth(); }}
            className="btn btn-ghost"
            style={{ border: `1px solid ${lightPurple}`, color: deepPurple, background: "transparent", padding: "0.45rem 0.9rem" }}
            title="Refresh history & health"
          >
            Refresh
          </button>
        </div>

        {error && <p className="mt-3 text-red-600">{error}</p>}
      </div>

      {/* Latest Results */}
      <div className="w-full max-w-2xl p-4 rounded-xl border bg-white" style={cardStyle}>
        <h3 className="text-lg font-bold mb-2" style={{ color: deepPurple }}>Latest Results</h3>
        {results.length === 0 ? (
          <p className="text-sm text-gray-500">No recent results. Run an analysis to see them here.</p>
        ) : (
          <ul className="space-y-3">
            {results.map((r, i) => (
              <li key={i} className="p-3 rounded-lg border flex items-start justify-between">
                <div>
                  <div className="font-medium" style={{ color: deepPurple }}>{r.filename}</div>
                  <div className="text-sm text-gray-600">{r.aiSummary || "No summary"}</div>
                  <div className="text-xs text-gray-400 mt-1">{fmtDate(r.createdAt)}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleViewRaw(r)} className="btn btn-sm" style={{ borderColor: lightPurple, color: deepPurple }}>Raw</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* History / CRUD */}
      <div className="w-full max-w-4xl p-4 rounded-xl border bg-white" style={cardStyle}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold" style={{ color: deepPurple }}>History</h3>
          <div className="text-sm text-gray-500">{history.length} records</div>
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-gray-500">No history yet.</p>
        ) : (
          <div className="space-y-2">
            {history.map((r) => (
              <div key={r.id} className="p-3 rounded-lg border flex items-center justify-between">
                <div>
                  <div className="font-medium" style={{ color: deepPurple }}>{r.filename}</div>
                  <div className="text-sm text-gray-600">{r.aiSummary || "—"}</div>
                  <div className="text-xs text-gray-400 mt-1">{fmtDate(r.createdAt)}</div>
                </div>

                <div className="flex gap-2">
                  <button className="btn btn-sm" onClick={() => handleViewRaw(r)} style={{ borderColor: lightPurple, color: deepPurple }}>View</button>
                  <button className="btn btn-sm btn-outline" onClick={() => handleEdit(r)} style={{ borderColor: lightPurple, color: deepPurple }}>Edit</button>
                  <button className="btn btn-sm" onClick={() => removeRecord(r.id)} style={{ background: "#ffefef", color: "#b91c1c", borderRadius: 8 }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Raw JSON modal */}
      {viewRaw && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl bg-white rounded-lg p-4 shadow-lg overflow-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold" style={{ color: deepPurple }}>Raw Record — {viewRaw.filename}</h4>
              <div className="flex gap-2">
                <button className="btn btn-sm" onClick={() => navigator.clipboard.writeText(JSON.stringify(viewRaw, null, 2))}>Copy JSON</button>
                <button className="btn btn-sm btn-ghost" onClick={closeRaw}>Close</button>
              </div>
            </div>

            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
              {JSON.stringify(viewRaw, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
