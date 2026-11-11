import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Icon from "../components/Icon";
import { api, setStoredToken } from "../services/api";

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-surface-container-low py-3 pl-11 pr-4 font-body-md text-on-surface placeholder:text-on-surface-variant/50 transition-colors focus:border-tertiary focus:outline-none focus:ring-1 focus:ring-tertiary";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const toggleMode = () => {
    setIsLogin((current) => !current);
    setFormData({ name: "", email: "", password: "" });
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

      toast.success(
        isLogin
          ? `Welcome back, ${result.user.name.split(" ")[0]}.`
          : "Your account has been created.",
      );
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
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
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed-variant">
              <Icon name={isLogin ? "lock" : "person_add"} size={28} />
            </div>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              {isLogin ? "Welcome back" : "Join Vintage"}
            </h1>
            <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
              {isLogin
                ? "Sign in to track orders and check out faster."
                : "Create an account to start your collection."}
            </p>
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

          <p className="mt-6 text-center font-body-md text-body-md text-on-surface-variant">
            {isLogin ? "New to Vintage?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-semibold text-primary transition-colors hover:underline"
            >
              {isLogin ? "Create an account" : "Sign in"}
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
