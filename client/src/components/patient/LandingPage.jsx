import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import api from "../../lib/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import homNav from "../../img/hom_nav.png";
import homoLogo from "../../img/homo_logo.png";
import docPic from "../../img/doc_pic.jpeg";

gsap.registerPlugin(ScrollTrigger);

const conditions = [
  "Skin & Hair", "Eczema", "Psoriasis", "Acne", "Hair Fall", "Dandruff", 
  "Allergies", "Sinusitis", "Rhinitis", "Digestive Health", "IBS", "Acidity", 
  "Gastritis", "Women's Health", "PCOD/PCOS", "Menstrual Irregularities", 
  "Leucorrhoea", "Child Health", "Recurrent Infections", "Growth Issues", 
  "Bedwetting", "Chronic Pain", "Arthritis", "Back Pain", "Migraine", 
  "Headache", "Thyroid Disorders", "Stress & Anxiety", "Sleep Disorders", 
  "Obesity", "Diabetes Support"
];

const CaseCard = ({ quote, title, profile, duration, outcome }) => (
  <div className="case-card flex flex-col justify-between bg-white p-8 md:p-10 rounded-[2.5rem] border border-sage/15 transition-shadow duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(107,127,94,0.12)] group relative overflow-hidden h-full will-change-transform">
    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-sage/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform duration-700 ease-out group-hover:scale-[1.3] pointer-events-none"></div>
    <span className="text-[8rem] font-serif text-sage/5 absolute -top-4 right-4 font-black leading-none pointer-events-none select-none">"</span>
    
    <div className="relative z-10 mb-8 mt-2">
      <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-semibold mb-2">{title}</h3>
      <p className="font-sans text-xs uppercase tracking-widest text-sage mb-6 font-bold">{profile}</p>
      <div className="w-12 h-px bg-sage/30 mb-6"></div>
      <p className="text-lg md:text-xl font-serif italic text-charcoal/80 leading-relaxed break-words">"{quote}"</p>
    </div>
    
    <div className="space-y-4 font-sans text-sm text-charcoal/80 bg-background/50 p-6 rounded-3xl border border-sage/10 relative z-10 mt-auto">
      <div className="flex gap-4 items-start">
        <span className="text-sage text-xl leading-none mt-0.5">⏱</span> 
        <p className="leading-relaxed break-words"><strong className="text-charcoal font-semibold">Duration:</strong> {duration}</p>
      </div>
      <div className="flex gap-4 items-start">
        <span className="text-sage text-xl leading-none mt-0.5">✨</span> 
        <p className="leading-relaxed break-words"><strong className="text-charcoal font-semibold">Outcome:</strong> {outcome}</p>
      </div>
    </div>
  </div>
);

export default function LandingPage() {
  const [booking, setBooking] = useState({
    name: "", age: "", gender: "Female", phone: "", email: "", mode: "video", preferredDate: "", preferredTime: "morning", complaint: "", source: ""
  });
  const [statusText, setStatusText] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainRef = useRef(null);

  // Initialize smooth scroll & global animations
  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Hero
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-headline span", { y: 80, opacity: 0, stagger: 0.05, duration: 0.9, ease: "power4.out" })
        .from(".hero-visuals", { x: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
        .from(".hero-sub", { y: 24, opacity: 0, duration: 0.7 }, "-=0.8")
        .from(".hero-cta", { y: 16, opacity: 0, scale: 0.95, stagger: 0.1, duration: 0.5 }, "-=0.5")
        .from(".hero-badge", { y: -20, opacity: 0, duration: 0.5 }, "-=1.2");

      // About section scroll trigger
      gsap.from(".about-photo-wrap", { x: -60, opacity: 0, duration: 1.1, scrollTrigger: { trigger: ".about-photo-wrap", start: "top 80%" } });
      gsap.from(".about-content > *", { y: 40, opacity: 0, stagger: 0.15, duration: 0.8, scrollTrigger: { trigger: ".about-content", start: "top 85%" } });

      // Cases Specialization Scroll Trigger (3D Organic Cascade)
      gsap.fromTo(".condition-item", 
        { y: 80, opacity: 0, scale: 0.9, rotationX: 45 },
        { y: 0, opacity: 1, scale: 1, rotationX: 0, stagger: 0.08, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: "#cases", start: "top 70%" }
        }
      );
      // Testimonials Scroll Trigger
      gsap.fromTo(".case-card",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".testimonials-grid", start: "top 80%" }
        }
      );

    }, mainRef);

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  const waPreview = useMemo(() => {
    if (!booking.name || !booking.phone) return "";
    return `https://wa.me/9081660475?text=${encodeURIComponent(`New appointment request from ${booking.name}, ${booking.phone}.`)}`;
  }, [booking]);

  async function submitBooking(e) {
    e.preventDefault();
    
    // Quick Cyber-Proofing: Basic Sanitization & Validation
    if (!/^\d{10}$/.test(booking.phone)) {
      setStatusText("Please enter a valid 10-digit phone number.");
      return;
    }

    setStatusText("Submitting...");
    try {
      await api.post("/api/appointments", {
        ...booking,
        name: booking.name.trim().substring(0, 50),
        complaint: booking.complaint.trim().substring(0, 1000)
      });
      setStatusText("✓ Appointment requested successfully!");
      if (waPreview) window.open(waPreview, "_blank");
    } catch (error) {
      setStatusText(error.response?.data?.message || "Failed to book appointment.");
    }
  }

  return (
    <div ref={mainRef} className="bg-background text-foreground font-sans selection:bg-sage/30 selection:text-sage min-h-screen overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-sage/10 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <img src={homoLogo} alt="Homoecare Logo" className="h-9 md:h-12 w-auto object-contain" />
            <div className="flex flex-col sm:flex-row sm:items-baseline">
              <strong className="font-serif text-lg md:text-xl tracking-wide text-charcoal leading-none">Homoecare</strong>
              <span className="font-sans text-[10px] md:text-sm font-normal text-taupe sm:ml-1.5 leading-none mt-1 sm:mt-0">by Dr. Kruti Desai</span>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-charcoal/80">
            <a href="#about" className="hover:text-sage transition-colors">About</a>
            <a href="#how-i-work" className="hover:text-sage transition-colors">How I Work</a>
            <a href="#cases" className="hover:text-sage transition-colors">Cases</a>
            <a href="#contact" className="hover:text-sage transition-colors">Contact</a>
            <a href="#booking" className="bg-sage text-linen px-5 py-2.5 rounded-full hover:bg-sage/90 hover:-translate-y-0.5 transition-all shadow-md shadow-sage/20">Book Appointment</a>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden flex flex-col items-center justify-center gap-[6px] w-[2.75rem] h-[2.75rem] rounded-full border border-charcoal/10 bg-white/50 active:scale-95 transition-transform z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`block w-5 h-[1.5px] bg-charcoal transition-all duration-300 ease-out origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`}></span>
            <span className={`block w-5 h-[1.5px] bg-charcoal transition-all duration-200 ease-out ${isMobileMenuOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}></span>
            <span className={`block w-5 h-[1.5px] bg-charcoal transition-all duration-300 ease-out origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7.5px]' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden absolute top-20 left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-sage/15 shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-[450px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col px-8 py-8 gap-6 font-serif text-xl tracking-wide text-charcoal text-center">
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-sage active:scale-95 transition-all">About</a>
            <a href="#how-i-work" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-sage active:scale-95 transition-all">How I Work</a>
            <a href="#cases" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-sage active:scale-95 transition-all">Cases</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-sage active:scale-95 transition-all">Contact</a>
            <div className="w-12 h-px bg-sage/20 mx-auto my-2"></div>
            <a href="#booking" onClick={() => setIsMobileMenuOpen(false)} className="font-sans text-sm font-semibold tracking-wider uppercase bg-sage text-linen px-8 py-4 rounded-full shadow-[0_8px_20px_rgb(107,127,94,0.3)] mx-auto w-full max-w-[280px] active:scale-95 transition-transform">Book Consultation</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden bg-gradient-to-b from-linen/30 to-background" id="hero">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sage/5 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sage/5 blur-[80px] translate-y-1/2 -translate-x-1/4 rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10 mt-8 mb-16">
          <div className="order-2 lg:order-1 max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            
            <div className="hero-badge inline-flex items-center gap-2 bg-sage/10 text-sage px-4 py-2 rounded-full mb-6 font-medium text-sm border border-sage/20">
              <span className="w-2 h-2 bg-sage rounded-full animate-pulse"></span>
              Advanced Classical Homoeopathy
            </div>
            
            <h1 className="hero-headline font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] text-charcoal mb-8">
              <span className="block">Healing That Works</span>
              <span className="block text-sage italic pr-2 mt-2">With Your Body,</span>
              <span className="block mt-2">Not Against It.</span>
            </h1>
            
            <p className="hero-sub text-lg md:text-xl text-charcoal/60 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-sans px-4 sm:px-0">
              Personalized homoeopathic care for chronic and acute conditions. Rooted in classical principles, guided by true healing.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 px-4 sm:px-0">
              <a href="#booking" className="hero-cta bg-sage text-linen px-8 py-4 rounded-full font-medium hover:bg-sage/90 transition-all shadow-[0_8px_20px_rgb(107,127,94,0.3)] hover:shadow-[0_12px_25px_rgb(107,127,94,0.4)] hover:-translate-y-1">Book a Consultation</a>
              <a href="#about" className="hero-cta bg-white text-charcoal px-8 py-4 rounded-full font-medium border border-sage/20 hover:border-sage hover:text-sage transition-all shadow-sm hover:shadow-md">Learn About Homoeopathy</a>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative hero-visuals">
            <div className="relative w-full max-w-sm mx-auto lg:max-w-none lg:w-[90%] lg:ml-auto lg:mr-0 aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-white/50 flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-sage/5 mix-blend-multiply z-10 transition-opacity duration-700 hover:opacity-0 pointer-events-none"></div>
              <img src={homNav} alt="Homoecare Logo" className="w-full h-full object-contain scale-100 hover:scale-105 transition-transform duration-[1.5s] ease-out drop-shadow-lg" />
            </div>
            <div className="absolute -bottom-8 -left-6 lg:-left-12 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-[0_10px_30px_rgb(0,0,0,0.08)] border border-white max-w-[240px] hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-sage/10 rounded-2xl flex items-center justify-center text-2xl">🌱</div>
                <div>
                  <p className="font-serif font-bold text-charcoal text-lg">100% Natural</p>
                  <p className="text-sm text-charcoal/60 mt-0.5">Gentle & free from side-effects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-24 bg-white/40" id="about">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="about-photo-wrap relative max-w-md mx-auto md:max-w-none">
            <div className="absolute inset-0 bg-sage/20 rounded-t-full rounded-b-2xl translate-x-4 translate-y-4"></div>
            <img src={docPic} alt="Dr. Kruti Desai" className="relative z-10 w-full h-auto object-cover rounded-t-full rounded-b-2xl shadow-xl transition-all duration-700" />
          </div>
          
          <div className="about-content space-y-6">
            <p className="text-sage font-medium tracking-wider text-sm uppercase">✦ About the Doctor</p>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal">Dr. Kruti Desai</h2>
            <p className="text-xl text-taupe font-serif italic">Consultant Homoeopathic Physician</p>
            <div className="w-16 h-px bg-sage/30"></div>
            <p className="text-charcoal/80 leading-relaxed text-lg">
              "I believe every patient deserves individual attention. Homoeopathy isn't one-size-fits-all - your symptoms, your history, and your story shape every prescription I write. My approach combines classical case-taking with modern understanding of chronic disease patterns."
            </p>
            
            <div className="bg-linen/60 border border-sage/15 p-6 rounded-2xl mt-8">
              <div className="border-l-2 border-sage/40 pl-5 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 bg-sage rounded-full"></div>
                  <h4 className="font-serif text-xl text-charcoal font-medium">B.H.M.S (Hons)</h4>
                  <p className="text-sm text-charcoal/60 mt-1">National Institute of Homeopathy, Kolkata</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 bg-sage rounded-full"></div>
                  <h4 className="font-serif text-xl text-charcoal font-medium">Pursuing M.D. (Hom)</h4>
                  <p className="text-sm text-charcoal/60 mt-1">The Calcutta Homoeopathic Medical College &amp; Hospital</p>
                </div>
              </div>
            </div>
            
            <div className="pt-6 flex flex-col sm:flex-row gap-6">
              <a href="tel:+919081660475" className="flex items-center gap-2 text-charcoal/80 hover:text-sage font-medium"><span className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">📞</span> +91 9081660475</a>
              <a href="mailto:drkrutidesai752@gmail.com" className="flex items-center gap-2 text-charcoal/80 hover:text-sage font-medium"><span className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">✉️</span> drkrutidesai752@gmail.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* How I Work Section */}
      <section className="py-24" id="how-i-work">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sage font-medium tracking-wider text-sm uppercase mb-4">✦ How I Work</p>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">Consultation Details</h2>
            <p className="text-charcoal/70 text-lg">Every consultation begins with a detailed case-taking session. Classical homoeopathic principles guide remedy selection. Follow-ups track your progress and refine treatment.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🌐", title: "Modes", body: "Video Call · WhatsApp" },
              { icon: "🕐", title: "Timings", body: "Mon–Sat: 10 AM – 1 PM & 5 PM – 8 PM" },
              { icon: "₹", title: "Fee", body: "First Visit: ₹500 · Follow-up: ₹300" },
              { icon: "🗣️", title: "Languages", body: "Gujarati · Hindi · English" }
            ].map((card, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-sage/10 hover:border-sage/30 hover:-translate-y-1 hover:shadow-xl shadow-sm transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-sage/10 text-xl flex items-center justify-center mb-6">{card.icon}</div>
                <h3 className="font-serif text-xl font-bold text-charcoal mb-3">{card.title}</h3>
                <p className="text-charcoal/70">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases / Conditions */}
      <section className="py-32 bg-background overflow-hidden relative" id="cases">
        <div className="absolute top-0 left-0 w-full h-full bg-sage/5 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(107,127,94,0.15),rgba(255,255,255,0))] pointer-events-none z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-sage font-semibold tracking-widest text-sm uppercase mb-4 flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-sage/40"></span>
              Specialization
              <span className="w-8 h-px bg-sage/40"></span>
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal">Conditions I've Managed</h2>
          </div>
          
          <div className="conditions-grid flex flex-wrap justify-center items-center gap-x-4 gap-y-5 max-w-5xl mx-auto mb-32 px-2 perspective-1000">
            {conditions.map((item, i) => {
              // Creating a stunning asymmetric aesthetic by alternating 3 distinct luxury styles
              const isStyle1 = i % 3 === 0;
              const isStyle2 = i % 3 === 1;
              
              const baseStyle = "condition-item relative border shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors transition-shadow duration-500 cursor-default group overflow-hidden flex-shrink-0 will-change-transform";
              const specificStyle = isStyle1 
                ? "bg-white border-sage/20 text-charcoal rounded-full px-5 sm:px-8 py-3 sm:py-4 hover:shadow-[0_15px_40px_rgba(107,127,94,0.12)] hover:border-sage"
                : isStyle2
                ? "bg-sage/10 border-sage/30 text-sage rounded-[2rem] px-6 sm:px-10 py-4 sm:py-5 hover:bg-sage hover:text-white hover:shadow-[0_20px_40px_rgba(107,127,94,0.3)]"
                : "bg-background border-charcoal/10 text-charcoal/70 rounded-[1.2rem] px-4 sm:px-6 py-2 sm:py-3 hover:border-charcoal/30 hover:bg-white hover:text-charcoal";
              
              return (
                <div key={item} className={`${baseStyle} ${specificStyle}`}>
                  <span className="font-serif text-base sm:text-xl md:text-2xl relative z-10 tracking-wide font-medium whitespace-nowrap">{item}</span>
                  {/* Premium Glass Sheen Effect on Hover */}
                  <div className="absolute top-0 -left-[150%] w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[45deg] group-hover:left-[200%] transition-all duration-[1.2s] ease-in-out z-0 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mb-16">
            <p className="text-sage font-semibold tracking-widest text-sm uppercase mb-4 flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-sage/40"></span>
              Patient Testimonials
              <span className="w-8 h-px bg-sage/40"></span>
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal">Enduring Relief</h2>
          </div>

          <div className="testimonials-grid grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 pb-12 w-full max-w-7xl mx-auto">
            <CaseCard 
              quote="After years of relying on strong steroid creams, Dr. Kruti's treatment was a breath of fresh air. My skin has never looked better."
              title="Chronic Severe Eczema" profile="Female, 28 yrs" duration="3 months of constitutional treatment" outcome="Significant reduction in flare-ups. No recurrence in 6 months." 
            />
            <CaseCard 
              quote="I was tired of synthetic hormones mapping my life. The homoeopathic intervention stabilized my cycle naturally without any heavy side effects."
              title="PCOS & Hormonal Imbalance" profile="Female, 32 yrs" duration="6 months of precise homoeopathic intervention" outcome="Regulated cycles naturally, clear reduction in hormonal acne and mood swings." 
            />
            <CaseCard 
              quote="My son used to fall sick every changing season. Since starting his treatment, his immunity has skyrocketed. It's truly a miracle for us."
              title="Severe Childhood Allergies" profile="Male, 7 yrs" duration="4 months of gentle treatment" outcome="Immunity built up remarkably, frequent colds and sneezing completely resolved." 
            />
          </div>
          
          <div className="text-center mt-12">
            <p className="text-xs text-charcoal/40 uppercase tracking-widest font-medium">* Shared with patient's consent. Identifying details have been anonymized.</p>
          </div>
        </div>
      </section>

      {/* Booking / Contact */}
      <section className="py-24 relative" id="contact">
        <div className="container mx-auto px-6">
          <div className="bg-linen rounded-[2.5rem] p-8 md:p-14 border border-sage/20 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sage/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="grid lg:grid-cols-12 gap-12 relative z-10">
              <div className="lg:col-span-5" id="booking">
                <p className="text-sage font-medium tracking-wider text-sm uppercase mb-4">✦ Take the First Step</p>
                <h2 className="font-serif text-4xl text-charcoal mb-6">Book an Appointment</h2>
                <p className="text-charcoal/70 mb-10">Fill out this form and Dr. Kruti will confirm your appointment via WhatsApp within 24 hours.</p>
                
                <div className="space-y-6 text-charcoal/80">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl mt-1 text-sage">📞</span>
                    <div>
                      <h4 className="font-bold font-serif text-xl">Phone / WhatsApp</h4>
                      <p>+91 9081660475</p>
                      <a href="https://wa.me/919081660475" target="_blank" rel="noreferrer" className="text-sage text-sm font-medium hover:underline inline-block mt-1">Message Directly →</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl mt-1 text-sage">✉️</span>
                    <div>
                      <h4 className="font-bold font-serif text-xl">Email</h4>
                      <p>drkrutidesai752@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-7 bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-sage/10 shadow-lg">
                <form onSubmit={submitBooking} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-charcoal/80">Full Name *</label>
                    <input required className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-all placeholder:text-charcoal/30" placeholder="Jane Doe" value={booking.name} onChange={e => setBooking(p => ({...p, name: e.target.value}))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-charcoal/80">Age *</label>
                      <input required type="number" className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-all" value={booking.age} onChange={e => setBooking(p => ({...p, age: e.target.value}))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-charcoal/80">Gender *</label>
                      <select required className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-all" value={booking.gender} onChange={e => setBooking(p => ({...p, gender: e.target.value}))}>
                        <option>Female</option><option>Male</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-charcoal/80">Phone Number *</label>
                    <input 
                      required 
                      type="tel" 
                      pattern="[0-9]{10}"
                      maxLength="10"
                      className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-all placeholder:text-charcoal/30" 
                      placeholder="XXXXXXXXXX" 
                      value={booking.phone} 
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').substring(0, 10);
                        setBooking(p => ({...p, phone: val}));
                      }} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-charcoal/80">Email</label>
                    <input type="email" className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-all placeholder:text-charcoal/30" placeholder="jane@example.com" value={booking.email} onChange={e => setBooking(p => ({...p, email: e.target.value}))} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-charcoal/80">Mode *</label>
                    <select required className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-all" value={booking.mode} onChange={e => setBooking(p => ({...p, mode: e.target.value}))}>
                      <option value="video">Video Call</option>
                      <option value="whatsapp">WhatsApp Consult</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-charcoal/80">Preferred Date *</label>
                      <input required type="date" className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-all" min={new Date().toISOString().split("T")[0]} value={booking.preferredDate} onChange={e => setBooking(p => ({...p, preferredDate: e.target.value}))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-charcoal/80">Time Slot *</label>
                      <select required className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-all" value={booking.preferredTime} onChange={e => setBooking(p => ({...p, preferredTime: e.target.value}))}>
                        <option value="morning">Morning (10 AM - 1 PM)</option>
                        <option value="evening">Evening (5 PM - 8 PM)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-charcoal/80">Chief Complaint *</label>
                    <textarea required rows="3" className="w-full bg-background px-4 py-3 rounded-xl border border-sage/20 focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-all resize-none placeholder:text-charcoal/30" placeholder="Briefly describe your main symptoms..." value={booking.complaint} onChange={e => setBooking(p => ({...p, complaint: e.target.value}))} />
                  </div>
                  
                  <div className="md:col-span-2 pt-4">
                    <button type="submit" className="w-full bg-sage text-linen text-lg font-medium py-4 rounded-xl hover:bg-sage/90 shadow-xl shadow-sage/30 hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2">
                      Submit Appointment Request
                    </button>
                    {statusText && (
                      <div className={`mt-4 p-4 rounded-xl text-sm font-medium text-center ${statusText.includes("success") ? "bg-sage/10 text-sage" : "bg-red-50 text-red-600"}`}>
                        {statusText}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-linen/70 py-16 border-t-[12px] border-sage">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center text-white font-serif italic pb-1">H</div>
              <strong className="font-serif text-2xl tracking-wide text-linen">Homoecare</strong>
            </div>
            <p className="max-w-xs leading-relaxed text-sm">Healing rooted in nature. Guided by science.<br/>Consultant Homoeopathic Physician.</p>
          </div>
          <div>
            <h4 className="font-serif text-xl text-linen mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#about" className="hover:text-sage transition-colors">About</a></li>
              <li><a href="#how-i-work" className="hover:text-sage transition-colors">How I Work</a></li>
              <li><a href="#cases" className="hover:text-sage transition-colors">Cases</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-xl text-linen mb-6">Patient Notice</h4>
            <p className="text-sm leading-relaxed">Homoeopathic treatments are complementary. Always consult your primary physician in emergencies.</p>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-linen/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} Homoecare by Dr. Kruti Desai. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/admin/login" className="hover:text-sage transition-colors border-b border-transparent hover:border-sage">Doctor Login</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
