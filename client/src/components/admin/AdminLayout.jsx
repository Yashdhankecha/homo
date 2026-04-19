import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { clearToken } from "../../lib/auth";
import homoLogo from "../../img/homo_logo.png";
import { useState, useEffect } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/appointments", label: "Appointments", icon: "📅" },
    { to: "/admin/messages", label: "Messages", icon: "💬" },
    { to: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-charcoal">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-sage/10 shadow-xl shadow-sage/5 transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col`}>
        <div className="p-8 border-b border-sage/10">
          <div className="flex items-center gap-3 mb-2">
            <img src={homoLogo} alt="Logo" className="w-10 h-10 object-contain" />
            <h3 className="font-serif text-2xl text-charcoal font-semibold">Homoecare</h3>
          </div>
          <p className="text-sm font-medium text-sage tracking-wider uppercase ml-13">Admin Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-sage text-white shadow-md shadow-sage/20 font-semibold"
                    : "text-charcoal/70 hover:bg-sage/10 hover:text-sage"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sage/10">
          <button
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-medium text-charcoal/70 hover:bg-red-50 hover:text-red-600 transition-all"
            onClick={() => {
              clearToken();
              navigate("/admin/login");
            }}
          >
            <span className="text-lg">🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-sage/10 z-30">
          <div className="flex items-center gap-2">
            <img src={homoLogo} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-serif text-lg font-semibold text-charcoal">Homoecare</span>
          </div>
          <button 
            className="p-2 bg-sage/10 text-sage rounded-md"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sage/5 rounded-full blur-3xl pointer-events-none -mt-40 -mr-40"></div>
          <div className="mx-auto max-w-6xl relative z-10 block">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
