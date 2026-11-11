import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api, setStoredToken } from "../services/api";

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const next = searchParams.get("next") || "/dashboard";
    if (!token) {
      toast.error("Sign-in failed. Please try again.");
      navigate("/auth", { replace: true });
      return;
    }
    setStoredToken(token);
    api
      .getProfile()
      .then((user) => {
        localStorage.setItem(
          "vintage_profile",
          JSON.stringify({
            fullName: user.name,
            email: user.email,
            phone: user.phone || "",
            address: user.address || "",
          }),
        );
        window.dispatchEvent(new Event("vintage-auth-changed"));
        toast.success(`Welcome, ${user.name.split(" ")[0] || "friend"}.`);
        navigate(next.startsWith("/") ? next : "/dashboard", { replace: true });
      })
      .catch(() => {
        toast.error("Could not load your account. Please sign in again.");
        navigate("/auth", { replace: true });
      });
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 font-body-md text-body-md text-on-surface-variant">
          Signing you in…
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
