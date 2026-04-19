import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";

const templates = {
  confirmed: "Dear [Name],\n\nYour appointment with Dr. Kruti Desai is confirmed for [Date] at [Time Slot].\nMode: [Mode].\n\nIf you have any prior medical reports, please keep them ready. Please be available 5 minutes early. For queries, reply to this message.\n\nWarm regards,\nHomoecare 🌿",
  reminder: "Dear [Name],\n\nA gentle reminder for your appointment tomorrow with Dr. Kruti Desai at [Time Slot].\n\nPlease confirm your availability.\n\nWarm regards,\nHomoecare 🌿",
  followup: "Dear [Name],\n\nHope you're feeling better! Please share any updates on your condition so Dr. Kruti can track your progress.\n\nWarm regards,\nHomoecare 🌿",
};

function fillTemplate(text, appointment) {
  return text
    .replaceAll("[Name]", appointment?.name || "Patient")
    .replaceAll("[Date]", appointment ? new Date(appointment.preferredDate).toLocaleDateString() : "")
    .replaceAll("[Time Slot]", appointment?.preferredTime || "")
    .replaceAll("[Mode]", appointment?.mode || "");
}

export default function AdminMessages() {
  const [appointments, setAppointments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [channel, setChannel] = useState("whatsapp");
  const [templateKey, setTemplateKey] = useState("confirmed");
  const [customBody, setCustomBody] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/appointments"),
      api.get("/api/messages/log"),
    ]).then(([apptRes, logRes]) => {
      setAppointments(apptRes.data);
      setLogs(logRes.data);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const selected = useMemo(() => appointments.find((a) => a._id === selectedId), [appointments, selectedId]);
  
  // Update customBody when patient or template changes so user can edit before send
  useEffect(() => {
    setCustomBody(fillTemplate(templates[templateKey] || "", selected));
  }, [selected, templateKey]);

  async function addLog() {
    if (!selected) return;
    try {
      await api.post(
        "/api/messages/log",
        {
          channel,
          patientName: selected.name,
          patientPhone: selected.phone,
          patientEmail: selected.email,
          template: templateKey,
          body: customBody,
        }
      );
      const { data } = await api.get("/api/messages/log");
      setLogs(data);
    } catch (e) {
      console.error(e);
    }
  }

  function openWhatsApp() {
    if (!selected) return alert("Please select a patient first.");
    window.open(`https://wa.me/91${selected.phone.replace(/\D/g, '')}?text=${encodeURIComponent(customBody)}`, "_blank");
    addLog();
  }

  function openMailto() {
    if (!selected) return alert("Please select a patient first.");
    if (!selected?.email) return alert("Selected patient does not have an email address.");
    const subject = encodeURIComponent("Homoecare Consultation Update");
    window.location.href = `mailto:${selected.email}?subject=${subject}&body=${encodeURIComponent(customBody)}`;
    addLog();
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="font-serif text-4xl text-charcoal font-semibold mb-2">Communications hub</h2>
        <p className="text-charcoal/60">Send reminders, confirmations, and track patient touchpoints.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 mb-10">
        
        {/* Message Composer */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-sage/10 shadow-sm p-6 md:p-8 transform transition-all h-fit">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-sage/10">
            <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center text-sage text-xl">📝</div>
            <h3 className="font-serif text-2xl text-charcoal font-semibold">Write Message</h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-charcoal/70">Select Patient</label>
                <select 
                  className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage outline-none transition-all"
                  value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
                >
                  <option value="">-- Choose Patient --</option>
                  {appointments.map((a) => (
                    <option key={a._id} value={a._id}>{a.name} ({a.phone})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-charcoal/70">Message Template</label>
                <select 
                  className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage outline-none transition-all"
                  value={templateKey} onChange={(e) => setTemplateKey(e.target.value)}
                >
                  <option value="confirmed">Appointment Confirmed</option>
                  <option value="reminder">Appointment Reminder</option>
                  <option value="followup">Follow-up / Well-check</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-charcoal/70">Message Content (Editable)</label>
              <div className="relative">
                <textarea 
                  rows={8} 
                  className="w-full bg-background px-4 py-4 rounded-xl border border-sage/20 focus:border-sage outline-none transition-all resize-none shadow-inner"
                  value={customBody} onChange={(e) => setCustomBody(e.target.value)} 
                />
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button 
                className="flex-1 bg-[#25D366] text-white hover:bg-[#1DA851] py-3.5 px-6 rounded-xl font-medium transition-all shadow-md shadow-[#25D366]/20 flex items-center justify-center gap-2"
                onClick={openWhatsApp}
              >
                <span>💬</span> Open WhatsApp
              </button>
              <button 
                className="flex-1 bg-charcoal text-white hover:bg-charcoal/90 py-3.5 px-6 rounded-xl font-medium transition-all shadow-md flex items-center justify-center gap-2"
                onClick={openMailto}
              >
                <span>✉️</span> Send via Email
              </button>
              <button 
                className="w-full bg-white border border-sage/20 text-charcoal/70 hover:bg-sage/5 py-3 px-6 rounded-xl font-medium transition-all"
                onClick={addLog}
              >
                Just Save Log (No Send)
              </button>
            </div>
          </div>
        </div>

        {/* Message Log */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-sage/10 shadow-sm overflow-hidden flex flex-col h-full max-h-[800px]">
          <div className="p-6 border-b border-sage/10 flex items-center justify-between bg-white z-10 sticky top-0">
            <h3 className="font-serif text-xl text-charcoal font-semibold">Message History</h3>
            <span className="text-xs font-medium text-charcoal/50 bg-background px-2.5 py-1 rounded-full">{logs.length} logs</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="p-8 text-center text-charcoal/50 animate-pulse">Loading history...</div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center text-charcoal/50 space-y-2 mt-10">
                <div className="text-4xl opacity-30">📜</div>
                <p>No messages recorded yet.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {logs.map((log) => (
                  <li key={log._id} className="p-4 rounded-2xl hover:bg-sage/5 transition-colors border border-transparent hover:border-sage/10">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-charcoal">{log.patientName}</div>
                      <div className="text-[10px] text-charcoal/50 whitespace-nowrap bg-background px-2 py-0.5 rounded-full border border-sage/10">
                        {new Date(log.sentAt || log.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs mb-3 flex gap-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-md font-medium capitalize ${log.channel === 'whatsapp' ? 'bg-[#25D366]/10 text-[#1DA851]' : 'bg-blue-50 text-blue-600'}`}>{log.channel}</span>
                      <span className="inline-flex px-2 py-0.5 rounded-md font-medium bg-sage/10 text-sage">{log.template}</span>
                    </div>
                    <p className="text-sm text-charcoal/70 line-clamp-2 italic bg-background p-3 rounded-xl border border-sage/5">"{log.body}"</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
