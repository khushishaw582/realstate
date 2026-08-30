import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Building2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Headphones,
  Award,
  Star,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Facebook,
  Instagram,
  Linkedin,
  Home as HomeIcon,
  Briefcase,
  LineChart,
  RefreshCw,
  Key,
  CheckCircle,
  Send,
  Quote,
} from "lucide-react";

// Simple scroll-reveal hook — fades/slides elements in as they enter viewport
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const testimonials = [
  {
    name: "Rohan Mehta",
    role: "Property Buyer, Kolkata",
    quote:
      "Shaw Realtors made buying our first home stress-free. Every call was returned, every question answered. It felt like they actually cared about getting it right for us.",
    rating: 5,
  },
  {
    name: "Ananya Sen",
    role: "Investor, Howrah",
    quote:
      "I've worked with a lot of agents. Shaw Realtors is the only team that followed up consistently and never let a lead go cold. Their process is genuinely different.",
    rating: 5,
  },
  {
    name: "Vikram Das",
    role: "Commercial Client, Uttarpara",
    quote:
      "Fast response, honest pricing, zero pressure. We closed on our office space in under three weeks thanks to their market expertise.",
    rating: 5,
  },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Properties", href: "#properties" },
    { label: "Why Us", href: "#why-us" },
    { label: "Team", href: "#team" },
    { label: "Contact", href: "#contact" },
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // TODO: wire this up to your backend contact endpoint
  };

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="Shaw Realtors" className="h-10 w-auto rounded" />
            <span className="font-display font-semibold text-lg tracking-tight">
              Shaw Realtors
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-700 hover:text-accent px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-full transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-slate-700"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium text-slate-600 py-1"
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link
                to="/login"
                className="flex-1 text-center text-sm font-medium border border-slate-200 px-4 py-2.5 rounded-full"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center text-sm font-medium bg-accent text-white px-4 py-2.5 rounded-full"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
        {/* Diagonal triangle accent — top right corner */}
        <div
          className="absolute top-0 right-0 w-[55%] h-[45%] bg-accent/90"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
        />
        <div
          className="absolute top-0 right-0 w-[38%] h-[30%] bg-white"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
        />
        <div
          className="absolute top-0 right-0 w-[20%] h-[16%] bg-gold"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
        />

        {/* Big skyline illustration — right side, standing tall */}
        <svg
          className="absolute bottom-0 right-0 h-[75%] w-auto opacity-[0.9]"
          viewBox="0 0 900 600"
          preserveAspectRatio="xMidYMax meet"
        >
          {/* back row - lighter */}
          <rect x="40" y="220" width="80" height="380" fill="#DBEAFE" />
          <rect x="150" y="150" width="70" height="450" fill="#DBEAFE" />
          <rect x="700" y="180" width="90" height="420" fill="#DBEAFE" />
          <rect x="810" y="260" width="70" height="340" fill="#DBEAFE" />

          {/* front row - main towers, brand navy */}
          <g fill="#0A1628">
            <rect x="230" y="260" width="90" height="340" />
            <rect x="330" y="120" width="100" height="480" />
            <rect x="440" y="200" width="80" height="400" />
            <rect x="530" y="60" width="110" height="540" />
            <rect x="650" y="180" width="85" height="420" />
          </g>

          {/* windows on the two tallest towers */}
          <g fill="#D4AF37" opacity="0.55">
            {Array.from({ length: 12 }).map((_, row) =>
              Array.from({ length: 4 }).map((_, col) => (
                <rect
                  key={`t1-${row}-${col}`}
                  x={345 + col * 20}
                  y={140 + row * 32}
                  width="10"
                  height="16"
                />
              ))
            )}
            {Array.from({ length: 14 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => (
                <rect
                  key={`t2-${row}-${col}`}
                  x={545 + col * 18}
                  y={80 + row * 32}
                  width="10"
                  height="16"
                />
              ))
            )}
          </g>
        </svg>

        {/* Floating gradient blobs (Apple/Airbnb-style soft glow) */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-accent text-xs font-semibold tracking-wide uppercase px-4 py-2 rounded-full mb-6">
                <ShieldCheck size={14} />
                Trusted Real Estate Partner
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
                SHAW
                <br />
                <span className="text-accent">REALTORS</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-lg text-slate-500 italic mb-6">
                "Your Key To A New Life"
              </p>
            </Reveal>

            <Reveal delay={300}>
              <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-lg">
                Every call matters. Every lead has potential. Every follow-up
                creates opportunity — that's the standard we hold ourselves to
                for every client, every property, every time.
              </p>
            </Reveal>

            <Reveal delay={400}>
              <div className="flex flex-wrap gap-4">
            
                <a
                  href="#contact"
                  className="border border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-4 rounded-full font-medium transition-all hover:-translate-y-0.5"
                >
                  Talk to an Advisor
                </a>
              </div>
            </Reveal>
          </div>

          {/* Floating stat cards */}
          <div className="relative hidden lg:block">
          

            <Reveal delay={500} className="absolute -bottom-6 -left-10">
              <div className="bg-white shadow-xl shadow-slate-200/60 border border-slate-100 rounded-2xl px-5 py-4 flex items-center gap-3 -rotate-3 hover:rotate-0 transition-transform duration-500">
                
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS BAR (mobile + reinforced desktop) */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-3 gap-8">
          <Reveal>
            <div className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-bold text-accent">10,000+</p>
              <p className="text-sm text-slate-500 mt-1">Leads Managed</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-bold text-accent">500+</p>
              <p className="text-sm text-slate-500 mt-1">Properties Sold</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-bold text-accent">95%</p>
              <p className="text-sm text-slate-500 mt-1">Follow-Up Success</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div>
              <p className="text-accent text-sm font-semibold tracking-wide uppercase mb-3">
                About Shaw Realtors
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
                Built on trust.
                <br />
                Driven by results.
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                Shaw Realtors has helped thousands of families and investors find
                the right property — and the right price. We believe real estate
                should be transparent, personal, and stress-free, backed by a
                team that treats every lead like a relationship, not a transaction.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Transparency</p>
                    <p className="text-xs text-slate-500 mt-0.5">No hidden terms, ever</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Award size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Expertise</p>
                    <p className="text-xs text-slate-500 mt-0.5">Deep market knowledge</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 h-56 flex flex-col justify-end shadow-xl shadow-blue-200">
                <p className="text-white text-3xl font-bold font-display">12+</p>
                <p className="text-blue-100 text-sm mt-1">Years of Excellence</p>
              </div>
              <div className="bg-slate-100 rounded-3xl p-8 h-56 flex flex-col justify-end mt-8">
                <p className="text-slate-900 text-3xl font-bold font-display">50+</p>
                <p className="text-slate-500 text-sm mt-1">Expert Advisors</p>
              </div>
              <div className="bg-slate-100 rounded-3xl p-8 h-40 flex flex-col justify-end">
                <p className="text-slate-900 text-2xl font-bold font-display">15+</p>
                <p className="text-slate-500 text-sm mt-1">Cities Covered</p>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 h-40 flex flex-col justify-end -mt-8">
                <p className="text-white text-2xl font-bold font-display">4.9★</p>
                <p className="text-slate-300 text-sm mt-1">Client Rating</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-28 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-accent text-sm font-semibold tracking-wide uppercase mb-3">
              What We Offer
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
              Services built around you
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: HomeIcon, title: "Residential Properties", desc: "Apartments, villas, and homes tailored to your lifestyle and budget." },
              { icon: Briefcase, title: "Commercial Properties", desc: "Office spaces, retail units, and commercial real estate for growing businesses." },
              { icon: LineChart, title: "Investment Consulting", desc: "Data-driven guidance to help your property portfolio grow with confidence." },
              { icon: RefreshCw, title: "Resale Assistance", desc: "Get the best value when you're ready to sell, with full market support." },
              { icon: Key, title: "Rental Solutions", desc: "Find tenants or your next rental home with verified listings and fast turnaround." },
              { icon: Headphones, title: "Dedicated Support", desc: "A real person, not a call center, guiding you at every step of the journey." },
            ].map((service, i) => (
              <Reveal key={service.title} delay={i * 80}>
                <div className="group bg-white border border-slate-100 rounded-3xl p-8 h-full hover:shadow-2xl hover:shadow-slate-200/70 hover:-translate-y-1.5 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300">
                    <service.icon size={24} className="text-accent group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why-us" className="py-28 bg-brand relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-gold text-sm font-semibold tracking-wide uppercase mb-3">
              Why Choose Us
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
              The Shaw Realtors difference
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { icon: ShieldCheck, title: "Trusted Advisors", desc: "Guidance from people who put your interests first." },
              { icon: CheckCircle, title: "Verified Properties", desc: "Every listing checked for legal and title clarity." },
              { icon: Zap, title: "Fast Response", desc: "Calls and follow-ups handled without delay." },
              { icon: Headphones, title: "Dedicated Support", desc: "One team, accountable from lead to closing." },
              { icon: LineChart, title: "Market Expertise", desc: "Local pricing insight across 15+ cities." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full hover:bg-white/10 transition-all duration-300 hover:-translate-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center mb-5">
                    <item.icon size={20} className="text-gold" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 bg-slate-50/60">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-wide uppercase mb-3">
              Client Stories
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
              What our clients say
            </h2>
          </Reveal>

          <Reveal>
            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/60 rounded-3xl p-8 sm:p-12 relative">
              <Quote size={40} className="text-blue-100 mb-6" />

              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-gold text-gold" />
                ))}
              </div>

              <p className="text-lg sm:text-xl text-slate-700 leading-relaxed mb-8 min-h-[96px]">
                "{testimonials[activeTestimonial].quote}"
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{testimonials[activeTestimonial].name}</p>
                  <p className="text-sm text-slate-500">{testimonials[activeTestimonial].role}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="w-10 h-10 rounded-full border border-slate-200 hover:border-accent hover:text-accent flex items-center justify-center transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-10 h-10 rounded-full border border-slate-200 hover:border-accent hover:text-accent flex items-center justify-center transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeTestimonial ? "w-8 bg-accent" : "w-1.5 bg-slate-300"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 max-w-7xl mx-auto px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent text-sm font-semibold tracking-wide uppercase mb-3">
            Get In Touch
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Let's find your next property
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <Reveal className="lg:col-span-3">
            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/60 rounded-3xl p-8">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={26} className="text-green-600" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">Message sent</h3>
                  <p className="text-slate-500 text-sm">
                    Thanks for reaching out — an advisor will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleFormChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-none"
                      placeholder="Tell us what you're looking for..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent-hover text-white font-medium px-6 py-4 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Send Message
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Office info + map */}
          <Reveal delay={150} className="lg:col-span-2 space-y-5">
            <div className="bg-brand rounded-3xl p-8 text-white">
              <h3 className="font-display text-lg font-semibold mb-6">Office Information</h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gold mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-300">
                    Shaw Realtors HQ, Uttarpara, Hooghly, West Bengal, India
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gold flex-shrink-0" />
                  <p className="text-sm text-slate-300">+91 7980003948</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gold flex-shrink-0" />
                  <p className="text-sm text-slate-300">contact@shawrealtors.com</p>
                </div>
              </div>

              <a
                href="https://wa.me/917980003948"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-5 py-3.5 rounded-xl transition-colors"
              >
                <MessageCircle size={17} />
                Chat on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.jpeg" alt="Shaw Realtors" className="h-9 w-auto rounded" />
                <span className="font-display font-semibold text-white">Shaw Realtors</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your key to a new life. Trusted real estate guidance for buyers,
                sellers, and investors across West Bengal.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-slate-400 hover:text-gold transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
              <ul className="space-y-2.5">
                {["Residential Properties", "Commercial Properties", "Investment Consulting", "Rental Solutions"].map((s) => (
                  <li key={s}>
                    <span className="text-sm text-slate-400">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Get In Touch</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>+91 7980003948</li>
                <li>contact@shawrealtors.com</li>
                <li>Uttarpara, Hooghly, West Bengal</li>
              </ul>
              <div className="flex gap-3 mt-5">
                <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold hover:text-brand flex items-center justify-center text-white transition-colors">
                  <Facebook size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold hover:text-brand flex items-center justify-center text-white transition-colors">
                  <Instagram size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold hover:text-brand flex items-center justify-center text-white transition-colors">
                  <Linkedin size={16} />
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 pt-8">
            © {new Date().getFullYear()} Shaw Realtors. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatBlock({ value, label }) {
  return (
    <div>
      <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}