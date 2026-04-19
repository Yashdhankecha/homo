import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminSettings() {
  const [form, setForm] = useState({
    clinicName: "Homoecare by Dr. Kruti Desai",
    doctorName: "Dr. Kruti Desai",
    phone: "+91 9081660475",
    email: "drkrutidesai752@gmail.com",
    notificationsWhatsapp: true,
    notificationsEmail: true,
  });
  const [saved, setSaved] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/api/settings")
      .then(({ data }) => {
        if (data && Object.keys(data).length > 0) {
          setForm((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  async function onSave(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/api/settings", form);
      setSaved("Settings saved successfully.");
      setTimeout(() => setSaved(""), 3000);
    } catch (e) {
      setSaved("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="mb-10">
        <h2 className="font-serif text-4xl text-charcoal font-semibold mb-2">Clinic Settings</h2>
        <p className="text-charcoal/60">Manage your profile, public clinic details, and notification preferences.</p>
      </div>

      <form 
        onSubmit={onSave}
        className="bg-white rounded-3xl border border-sage/10 shadow-sm overflow-hidden"
      >
        <div className="p-6 md:p-10 space-y-10">
          
          {/* General Information */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sage/10">
              <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center text-sage text-xl">🏥</div>
              <h3 className="font-serif text-2xl text-charcoal font-semibold">General Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-charcoal/70">Clinic Name</label>
                <input 
                  className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage outline-none transition-all shadow-inner"
                  value={form.clinicName} onChange={(e) => setForm((p) => ({ ...p, clinicName: e.target.value }))} 
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-charcoal/70">Doctor Name</label>
                <input 
                  className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage outline-none transition-all shadow-inner"
                  value={form.doctorName} onChange={(e) => setForm((p) => ({ ...p, doctorName: e.target.value }))} 
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-charcoal/70">Public Phone Number</label>
                <input 
                  type="tel"
                  maxLength="15"
                  className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage outline-none transition-all shadow-inner"
                  value={form.phone} 
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d+]/g, '');
                    setForm((p) => ({ ...p, phone: val }));
                  }} 
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-charcoal/70">Public Email Address</label>
                <input 
                  className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage outline-none transition-all shadow-inner"
                  value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} 
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sage/10">
              <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center text-sage text-xl">🔔</div>
              <h3 className="font-serif text-2xl text-charcoal font-semibold">Notification Preferences</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-4 p-4 rounded-2xl border border-sage/10 hover:bg-sage/5 transition-colors cursor-pointer group">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-sage border-sage/20 rounded cursor-pointer"
                    checked={form.notificationsWhatsapp}
                    onChange={(e) => setForm((p) => ({ ...p, notificationsWhatsapp: e.target.checked }))}
                  />
                </div>
                <div>
                  <div className="font-medium text-charcoal flex items-center gap-2">
                    Enable WhatsApp notifications
                    <span className="bg-[#25D366]/10 text-[#1DA851] text-[10px] px-2 py-0.5 rounded-md uppercase font-bold tracking-wider">Recommended</span>
                  </div>
                  <div className="text-sm text-charcoal/50 mt-0.5">Receive immediate ping when a patient books.</div>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 rounded-2xl border border-sage/10 hover:bg-sage/5 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-sage border-sage/20 rounded cursor-pointer"
                    checked={form.notificationsEmail}
                    onChange={(e) => setForm((p) => ({ ...p, notificationsEmail: e.target.checked }))}
                  />
                </div>
                <div>
                  <div className="font-medium text-charcoal">Enable Email notifications</div>
                  <div className="text-sm text-charcoal/50 mt-0.5">Receive daily summary digests to your email.</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 border-t border-sage/10 bg-background/50 flex items-center justify-between">
          <div className="text-sm font-medium">
            {saved && (
              <span className={saved.includes("Failed") ? "text-red-500" : "text-sage"}>
                {saved.includes("Failed") ? "❌" : "✓"} {saved}
              </span>
            )}
          </div>
          <button 
            className="bg-sage text-white hover:bg-sage/90 py-3.5 px-8 rounded-xl font-medium transition-all shadow-md shadow-sage/20 disabled:opacity-70 flex items-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </section>
  );
}
