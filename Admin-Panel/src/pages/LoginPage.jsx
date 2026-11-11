import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back.");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-tertiary">
            Vintage Studio
          </p>
          <h1 className="mt-3 font-headline-lg text-headline-lg text-on-surface">
            Admin Access
          </h1>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
            Restricted area. Sign in with your store credentials.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-[0_10px_30px_rgba(45,41,38,0.08)]"
        >
          <label className="block font-label-md text-label-md text-on-surface-variant">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vintage.test"
              className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </label>

          <label className="mt-5 block font-label-md text-label-md text-on-surface-variant">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md text-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-7 w-full rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="mt-5 text-center font-body-md text-body-md text-on-surface-variant">
            Not an admin?{" "}
            <a
              href="http://localhost:5173"
              className="font-label-md text-primary hover:underline"
            >
              Go to the store
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
