import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Icon from "../components/Icon";
import { api, setStoredToken, getStoredToken } from "../services/api";

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-surface-container-low py-3 pl-11 pr-4 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-colors focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [providers, setProviders] = useState({ google: false, facebook: false });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  useEffect(() => {
    if (getStoredToken()) {
      navigate(next.startsWith("/") ? next : "/dashboard", { replace: true });
      return;
    }
    const error = searchParams.get("error");
    if (error) {
      toast.error(error, { id: "auth-oauth-error" });
    }
  }, [searchParams, navigate, next]);

  useEffect(() => {
    api
      .getAuthProviders()
      .then((data) => data && setProviders({ google: !!data.google, facebook: !!data.facebook }))
      .catch(() => {});
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const toggleMode = () => {
    setIsLogin((current) => !current);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleSocial = (provider) => {
    if (!providers[provider]) {
      toast.error(
        provider === "google"
          ? "Google login is not configured yet. Please sign in with email."
          : "Facebook login is not configured yet. Please sign in with email.",
        { id: `auth-provider-${provider}` },
      );
      return;
    }
    window.location.href = `/api/auth/${provider}?next=${encodeURIComponent(next)}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = isLogin
        ? await api.login(formData.email, formData.password)
        : await api.register(formData.name, formData.email, formData.password);

      setStoredToken(result.token);
      localStorage.setItem(
        "vintage_profile",
        JSON.stringify({
          fullName: result.user.name,
          email: result.user.email,
          phone: result.user.phone || "",
          address: result.user.address || "",
        }),
      );
      window.dispatchEvent(new Event("vintage-auth-changed"));

      toast.success(
        isLogin
          ? `Welcome back, ${result.user.name.split(" ")[0]}.`
          : "Your account has been created.",
        { id: "auth-success" },
      );
      navigate(next.startsWith("/") ? next : "/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.message, { id: "auth-error" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-margin-mobile py-stack-lg">
      {/* Background accents */}
      <div className="pointer-events-none absolute -left-24 top-0 -z-10 h-96 w-96 rounded-full bg-primary-fixed opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-secondary-fixed opacity-15 blur-3xl" />

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-8 soft-shadow md:p-10">
          {/* Heading */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed-variant">
              <Icon name={isLogin ? "lock" : "person_add"} size={28} />
            </div>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
              {isLogin
                ? "Sign in with your email and password, or continue with a social account."
                : "Register to save your details, track orders, and sync your wishlist."}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="mb-6 grid grid-cols-2 rounded-full bg-surface-container p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`rounded-full px-4 py-2 font-label-md text-label-md transition-colors ${
                isLogin
                  ? "bg-surface text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`rounded-full px-4 py-2 font-label-md text-label-md transition-colors ${
                !isLogin
                  ? "bg-surface text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="font-label-md text-label-md text-on-surface"
                >
                  Full name
                </label>
                <div className="relative">
                  <Icon
                    name="person"
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    placeholder="Amelia Crafts"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-label-md text-label-md text-on-surface"
              >
                Email address
              </label>
              <div className="relative">
                <Icon
                  name="mail"
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-label-md text-label-md text-on-surface"
              >
                Password
              </label>
              <div className="relative">
                <Icon
                  name="lock"
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  <Icon name={showPassword ? "visibility_off" : "visibility"} size={18} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-label-md text-label-md text-on-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
            >
              <Icon name={isSubmitting ? "progress_activity" : isLogin ? "login" : "person_add"} size={18} />
              {isSubmitting
                ? "Just a moment…"
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-outline-variant/40" />
            <span className="font-label-sm text-label-sm uppercase tracking-[0.15em] text-on-surface-variant">
              or continue with
            </span>
            <div className="h-px flex-1 bg-outline-variant/40" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleSocial("google")}
              className={`flex items-center justify-center gap-2 rounded-full border px-4 py-3 font-label-md text-label-md transition-colors ${
                providers.google
                  ? "border-outline-variant bg-surface text-on-surface hover:bg-surface-container"
                  : "border-outline-variant/50 bg-surface-container-low text-on-surface-variant/70"
              }`}
              title={providers.google ? "Continue with Google" : "Google login not configured"}
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocial("facebook")}
              className={`flex items-center justify-center gap-2 rounded-full border px-4 py-3 font-label-md text-label-md transition-colors ${
                providers.facebook
                  ? "border-outline-variant bg-surface text-on-surface hover:bg-surface-container"
                  : "border-outline-variant/50 bg-surface-container-low text-on-surface-variant/70"
              }`}
              title={providers.facebook ? "Continue with Facebook" : "Facebook login not configured"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="#1877F2">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>
          <p className="mt-3 text-center font-label-sm text-label-sm text-on-surface-variant">
            {providers.google || providers.facebook
              ? "You can sign in with a configured social account, or use your email and password."
              : "Social sign-in is ready in the app and will work once Google/Facebook credentials are added in Backend/.env."}
          </p>

          <p className="mt-6 text-center font-body-md text-body-md text-on-surface-variant">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-semibold text-primary transition-colors hover:underline"
            >
              {isLogin ? "Register" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center font-body-md text-sm text-on-surface-variant">
          <Link to="/shop" className="text-primary transition-colors hover:underline">
            ← Continue browsing the shop
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
