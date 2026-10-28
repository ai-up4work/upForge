"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Mail, RefreshCw, Trash2 } from "lucide-react";
import { useConfirm, useToast } from "./ui";

type Lead = {
  _id: string;
  name: string;
  email: string;
  company?: string;
  needs?: string[];
  budget?: string;
  timeline?: string;
  message?: string;
  source?: string;
  status: "new" | "contacted" | "won" | "closed";
  createdAt?: string;
};

const STATUSES: Lead["status"][] = ["new", "contacted", "won", "closed"];
const label = { new: "New", contacted: "Contacted", won: "Won", closed: "Closed" };
const when = (iso?: string) =>
  iso ? new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Colombo" }) : "";

export default function Inquiries({ dbReady }: { dbReady: boolean }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Lead["status"]>("all");
  const [open, setOpen] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await (await fetch("/api/leads", { cache: "no-store" })).json();
      if (!r.success) throw new Error(r.error);
      setLeads(r.data);
    } catch {
      toast.error("Couldn't load enquiries.");
    } finally {
      setLoading(false);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (dbReady) load(); else setLoading(false); }, [dbReady]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    STATUSES.forEach((s) => (c[s] = leads.filter((l) => l.status === s).length));
    return c;
  }, [leads]);
  const shown = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const setStatus = async (l: Lead, status: Lead["status"]) => {
    const prev = l.status;
    setLeads((x) => x.map((y) => (y._id === l._id ? { ...y, status } : y)));
    try {
      const r = await (await fetch(`/api/leads/${l._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })).json();
      if (!r.success) throw new Error(r.error);
    } catch {
      setLeads((x) => x.map((y) => (y._id === l._id ? { ...y, status: prev } : y)));
      toast.error("Couldn't update status");
    }
  };

  const remove = async (l: Lead) => {
    if (!(await confirm({ title: `Delete the enquiry from ${l.name}?`, body: "This can't be undone.", confirmLabel: "Delete", danger: true }))) return;
    try {
      const r = await (await fetch(`/api/leads/${l._id}`, { method: "DELETE" })).json();
      if (!r.success) throw new Error(r.error);
      setLeads((x) => x.filter((y) => y._id !== l._id));
      toast.success("Enquiry deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Email copied");
    } catch {
      toast.error("Couldn't copy");
    }
  };

  if (!dbReady) {
    return <div className="a-empty"><h3>Connect the database to receive enquiries</h3><p>Add MONGODB_URI and every message from the contact page will appear here.</p></div>;
  }

  return (
    <div>
      <div className="a-toolbar">
        <div className="a-seg" role="tablist" aria-label="Filter enquiries">
          {(["all", ...STATUSES] as const).map((s) => (
            <button key={s} role="tab" aria-selected={filter === s} onClick={() => setFilter(s)}>
              {s === "all" ? "All" : label[s]} <span>{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>
        <button className="a-btn ghost sm" onClick={load}><RefreshCw size={13} /> Refresh</button>
      </div>

      <div className="a-list">
        {loading ? (
          Array.from({ length: 3 }, (_, i) => <div className="a-row-item skeleton" key={i} />)
        ) : shown.length === 0 ? (
          <div className="a-empty"><h3>{filter === "all" ? "No enquiries yet" : `Nothing marked ${label[filter as Lead["status"]].toLowerCase()}`}</h3><p>Messages sent from the contact page land here.</p></div>
        ) : (
          shown.map((l) => (
            <div className={`a-lead${open === l._id ? " open" : ""}${l.status === "new" ? " is-new" : ""}`} key={l._id}>
              <button className="a-lead-main" onClick={() => setOpen(open === l._id ? null : l._id)} aria-expanded={open === l._id}>
                <span className="a-lead-dot" aria-hidden="true" />
                <span className="a-row-text">
                  <strong>{l.name}{l.company ? <em> · {l.company}</em> : null}</strong>
                  <span>{[l.needs?.join(", "), l.budget, l.timeline].filter(Boolean).join(" · ") || "General enquiry"}</span>
                </span>
                <span className="a-cell-date">{when(l.createdAt)}</span>
              </button>
              <select className={`a-status-select s-${l.status}`} value={l.status} onChange={(e) => setStatus(l, e.target.value as Lead["status"])} aria-label={`Status for ${l.name}`}>
                {STATUSES.map((s) => <option key={s} value={s}>{label[s]}</option>)}
              </select>
              {open === l._id && (
                <div className="a-lead-body">
                  <div className="a-lead-contact">
                    <span>{l.email}</span>
                    <button className="a-btn ghost sm" onClick={() => copy(l.email)}><Copy size={13} /> Copy</button>
                    <a className="a-btn primary sm" href={`mailto:${l.email}?subject=${encodeURIComponent("Your project with Upforge")}`}><Mail size={13} /> Reply</a>
                    <button className="a-btn ghost sm" onClick={() => remove(l)} aria-label="Delete enquiry"><Trash2 size={13} /></button>
                  </div>
                  {l.message ? <p className="a-lead-msg">{l.message}</p> : <p className="a-hint">No message.</p>}
                  {l.source && <p className="a-hint">Sent from {l.source}</p>}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
