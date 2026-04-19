import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { setToken } from "../../lib/auth";
import homoLogo from "../../img/homo_logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", {
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      setToken(data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-linen flex items-center justify-center p-6 selection:bg-sage/20 selection:text-sage relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-sage/10 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-white border border-sage/10 shadow-2xl shadow-sage/10 rounded-3xl p-8 relative z-10">
        <div className="text-center mb-8">
          <img src={homoLogo} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-4" />
          <h2 className="font-serif text-3xl text-charcoal">Doctor Area</h2>
          <p className="text-charcoal/60 mt-1">Please enter your credentials to proceed.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal/80">Email</label>
            <input 
              type="email" 
              required 
              autoComplete="email"
              className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-all" 
              value={form.email} 
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal/80">Password</label>
            <input 
              type="password" 
              required 
              autoComplete="current-password"
              className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-all" 
              value={form.password} 
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} 
            />
          </div>
          <div className="pt-2">
            <button 
              className="w-full bg-sage text-linen text-lg font-medium py-3 rounded-xl outline-none hover:bg-sage/90 shadow-lg shadow-sage/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none" 
              type="submit"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </div>
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 text-center text-sm font-medium p-3 rounded-xl">
              {error}
            </div>
          )}
        </form>

        <p className="text-center text-sm text-charcoal/40 mt-8">
          <a href="/" className="hover:text-sage transition-colors border-b border-transparent hover:border-sage">Return to Patient Website</a>
        </p>
      </div>
    </main>
  );
}
