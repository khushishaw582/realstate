import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = await login(email, password);
      navigate(
        userData.role === "admin" ? "/admin/dashboard" : "/agent/dashboard",
      );
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex bg-brand relative overflow-hidden flex-col justify-between p-16">
        {/* Call-trail decorative pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 500 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M 40 60 Q 150 120 90 220 T 200 380 Q 280 420 240 520 T 380 680 Q 420 720 400 780"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
          <circle cx="40" cy="60" r="4" fill="#D4AF37" />
          <circle cx="90" cy="220" r="4" fill="#D4AF37" />
          <circle cx="200" cy="380" r="5" fill="#F0D584" />
          <circle cx="240" cy="520" r="4" fill="#D4AF37" />
          <circle cx="380" cy="680" r="6" fill="#F0D584" />
        </svg>

          <div className="relative z-10">
          <div className="absolute -inset-4 bg-gold/20 blur-2xl rounded-full" />
          <img
            src="/logo.jpeg"
            alt="Shaw Realtors"
            className="h-24 w-auto relative"
            style={{ mixBlendMode: "screen" }}
          />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium mb-6">
            Trusted Lead Management Platform
          </div>

          <p className="mt-2 text-2xl font-medium text-white leading-relaxed">
            Every call matters.
            <br />
            Every lead has potential.
            <br />
            Every follow-up creates opportunity.
          </p>

          <p className="mt-6 text-base text-white/60 leading-relaxed max-w-lg">
            A modern platform built for real estate teams to manage leads, track
            conversations, and close more deals with confidence.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <h3 className="text-3xl font-bold text-gold">10K+</h3>
              <p className="text-sm text-white/50">Leads Managed</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gold">500+</h3>
              <p className="text-sm text-white/50">Properties Sold</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gold">95%</h3>
              <p className="text-sm text-white/50">Follow-Ups Done</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-white/50 text-sm">
          <Phone size={16} />
          <span>Click-to-call · Priority tracking · Follow-up reminders</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-12 py-12 bg-background">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-3 bg-accent/10 blur-xl rounded-full" />
              <img src="/logo.jpeg" alt="Shaw Realtors" className="h-16 w-auto relative" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-text-primary mb-1.5">
              Welcome back
            </h2>
            <p className="text-text-secondary text-sm">
              Sign in to pick up where you left off.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-surface border border-border rounded-xl p-7 space-y-5 shadow-sm"
          >
            {error && (
              <div className="text-sm text-hot bg-hot/5 border border-hot/20 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-sm text-text-secondary pt-1">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-accent hover:text-accent-hover font-medium"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}