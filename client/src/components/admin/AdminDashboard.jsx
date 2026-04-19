import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../lib/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const token = getToken();
  const [stats, setStats] = useState({
    appointmentsThisMonth: 0,
    pendingConfirmations: 0,
    todaysAppointments: 0,
    totalPatients: 0,
  });
  const [todayList, setTodayList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(`${API_BASE}/api/appointments/stats`, { headers }).catch(e => ({ data: stats })),
      axios.get(`${API_BASE}/api/appointments/today`, { headers }).catch(e => ({ data: [] })),
    ]).then(([statsRes, todayRes]) => {
      setStats(statsRes.data);
      setTodayList(todayRes.data);
    }).finally(() => {
      setLoading(false);
    });
  }, [token]);

  // Handle greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-4xl text-charcoal font-semibold mb-2">{greeting}, Dr. Kruti 👋</h2>
          <p className="text-charcoal/60">Here is your clinic overview for today.</p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-full border border-sage/20 shadow-sm text-sm font-medium text-sage flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sage animate-pulse"></span>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Appointments This Month", value: stats.appointmentsThisMonth, icon: "📅", color: "bg-sage/10 text-sage" },
          { label: "Pending Confirmations", value: stats.pendingConfirmations, icon: "⏳", color: "bg-amber-100 text-amber-700" },
          { label: "Today's Appointments", value: stats.todaysAppointments, icon: "📋", color: "bg-blue-100 text-blue-700" },
          { label: "Total Patients", value: stats.totalPatients, icon: "👥", color: "bg-purple-100 text-purple-700" }
        ].map((stat, i) => (
          <article key={i} className="bg-white p-6 rounded-3xl border border-sage/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <h3 className="font-serif text-3xl font-bold text-charcoal mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-charcoal/60">{stat.label}</p>
          </article>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-sage/10 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-sage/10 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-2xl text-charcoal font-semibold mb-1">Today's Schedule</h3>
            <p className="text-sm text-charcoal/60">Appointments confirmed for today.</p>
          </div>
          <div className="p-2 bg-sage/5 rounded-xl border border-sage/10 text-sage text-xl">
            📋
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-charcoal/60 animate-pulse">Loading schedule...</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-background/50 border-b border-sage/10 text-charcoal/60 font-medium">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">Time</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Mode</th>
                  <th className="px-6 py-4">Complaint</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/5 text-charcoal/80">
                {todayList.map((item) => (
                  <tr key={item._id} className="hover:bg-sage/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-sage">{item.preferredTime}</td>
                    <td className="px-6 py-4 font-semibold text-charcoal">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-md bg-sage/10 text-sage text-xs font-semibold capitalize">
                        {item.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4 truncate max-w-[200px]" title={item.complaint}>{item.complaint}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        item.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                        item.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {item.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
                {todayList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-charcoal/50">
                      <div className="text-4xl mb-3 opacity-30">☕</div>
                      <p className="font-medium">No appointments scheduled for today.</p>
                      <p className="text-xs mt-1">Enjoy the peaceful day or catch up on paperwork!</p>
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
