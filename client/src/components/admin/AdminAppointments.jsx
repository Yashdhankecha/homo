import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";

function toCSV(rows) {
  const headers = ["Name", "Phone", "Mode", "Date", "Time", "Complaint", "Status", "Booked On"];
  const data = rows.map((a) => [
    a.name,
    a.phone,
    a.mode,
    new Date(a.preferredDate).toLocaleDateString(),
    a.preferredTime,
    (a.complaint || "").replaceAll('"', '""'),
    a.status,
    new Date(a.createdAt).toLocaleString(),
  ]);

  return [headers, ...data].map((row) => row.map((v) => `"${String(v ?? "")}"`).join(",")).join("\n");
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadAppointments() {
    setLoading(true);
    try {
      const { data } = await api.get("/api/appointments");
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const statusOk = statusFilter === "all" || a.status === statusFilter;
      const q = search.trim().toLowerCase();
      const searchOk = !q || a.name.toLowerCase().includes(q) || a.phone.toLowerCase().includes(q);

      const dateValue = new Date(a.preferredDate);
      const fromOk = !fromDate || dateValue >= new Date(fromDate + "T00:00:00");
      const toOk = !toDate || dateValue <= new Date(toDate + "T23:59:59");

      return statusOk && searchOk && fromOk && toOk;
    });
  }, [appointments, statusFilter, search, fromDate, toDate]);

  async function updateStatus(id, status) {
    if (!window.confirm(`Marks this appointment as ${status}?`)) return;
    try {
      await api.patch(`/api/appointments/${id}/status`, { status });
      loadAppointments();
    } catch (e) {
      alert("Failed to update status");
    }
  }

  function exportCSV() {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "homoecare-appointments.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const statusStyles = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
    rejected: "bg-rose-100 text-rose-700"
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-4xl text-charcoal font-semibold mb-2">Appointments Directory</h2>
          <p className="text-charcoal/60">Manage bookings, follow-ups, and patient consultation requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-sage/10 shadow-sm p-6 mb-8 transform transition-all">
        <div className="flex flex-wrap gap-2 mb-8">
          {["all", "pending", "confirmed", "completed", "cancelled", "rejected"].map((s) => (
            <button 
              key={s} 
              className={`px-5 py-2.5 rounded-full capitalize text-sm font-medium transition-all ${statusFilter === s ? "bg-sage text-white shadow-md shadow-sage/20" : "bg-sage/5 text-charcoal/70 hover:bg-sage/10 hover:text-sage"}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2 space-y-2">
            <label className="text-sm font-medium text-charcoal/70">Search Records</label>
            <input 
              placeholder="Name or phone..."
              className="w-full bg-background px-4 py-2.5 rounded-xl border border-sage/20 focus:border-sage outline-none transition-all"
              value={search} onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal/70">From Date</label>
            <input 
              type="date" 
              className="w-full bg-background px-4 py-2.5 rounded-xl border border-sage/20 focus:border-sage outline-none transition-all"
              value={fromDate} onChange={(e) => setFromDate(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal/70">To Date</label>
            <input 
              type="date" 
              className="w-full bg-background px-4 py-2.5 rounded-xl border border-sage/20 focus:border-sage outline-none transition-all"
              value={toDate} onChange={(e) => setToDate(e.target.value)} 
            />
          </div>
          <div>
            <button 
              className="w-full bg-charcoal text-white hover:bg-charcoal/90 px-4 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-charcoal/10" 
              onClick={exportCSV}
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-sage/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex h-[400px] items-center justify-center text-charcoal/50 animate-pulse">
              <p>Loading appointments...</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-background/50 border-b border-sage/10 text-charcoal/60 font-medium">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">ID</th>
                  <th className="px-6 py-4">Patient Info</th>
                  <th className="px-6 py-4">Request Specs</th>
                  <th className="px-6 py-4">Complaint</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/5 text-charcoal/80">
                {filtered.map((a, idx) => (
                  <tr key={a._id} className="hover:bg-sage/5 transition-colors group">
                    <td className="px-6 py-4 font-mono text-charcoal/40 text-xs">#{String(idx + 1).padStart(3, '0')}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-charcoal">{a.name}</div>
                      <div className="text-xs text-charcoal/60 mt-1">{a.age} yrs • {a.gender}</div>
                      <div className="text-xs text-charcoal/60 mt-0.5">{a.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-sage">{new Date(a.preferredDate).toLocaleDateString()}</div>
                      <div className="text-xs text-charcoal/60 mt-1 capitalize">{a.preferredTime} • {a.mode}</div>
                      <div className="text-[10px] text-charcoal/40 mt-1">Booked: {new Date(a.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal min-w-[200px] max-w-xs align-top">
                      <p className="line-clamp-3 text-sm" title={a.complaint}>{a.complaint || "—"}</p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[a.status] || "bg-gray-100 text-gray-700"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-wrap gap-2 justify-center max-w-[180px] ml-auto">
                        {a.status === "pending" && (
                          <button className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" onClick={() => updateStatus(a._id, "confirmed")}>Confirm</button>
                        )}
                        {a.status === "confirmed" && (
                          <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" onClick={() => updateStatus(a._id, "completed")}>Complete</button>
                        )}
                        {["pending", "confirmed"].includes(a.status) && (
                          <button className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" onClick={() => updateStatus(a._id, "rejected")}>Reject</button>
                        )}
                        {["pending", "confirmed"].includes(a.status) && (
                          <button className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" onClick={() => updateStatus(a._id, "cancelled")}>Cancel</button>
                        )}
                        <a 
                          className="bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1" 
                          target="_blank" rel="noreferrer" 
                          href={`https://wa.me/${a.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Dear ${a.name}, your appointment request with Homoecare by Dr. Kruti Desai has been ${a.status}.`)}`}
                        >
                          WhatsApp
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-charcoal/50">
                      <div className="text-4xl mb-3 opacity-30">🔍</div>
                      <p className="font-medium text-lg">No appointments found</p>
                      <p className="text-sm mt-1">Try adjusting your filters or date range.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
