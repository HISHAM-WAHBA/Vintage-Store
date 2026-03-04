import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, LogIn, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate Authentication API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        isLogin
          ? "Welcome back to Vintage."
          : "Your account has been successfully created.",
      );
      setFormData({ name: "", email: "", password: "" });
      // Redirect to home or account dashboard
      navigate("/");
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="bg-vintage-cream min-h-screen flex items-center justify-center p-4 pt-24 pb-20 relative overflow-hidden">
      <motion.div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-vintage-gold/5 to-transparent blur-3xl mix-blend-multiply pointer-events-none" />
      <motion.div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-vintage-brown/5 to-transparent blur-3xl mix-blend-multiply pointer-events-none" />

      <motion.div
        className="w-full max-w-lg bg-white p-10 md:p-14 shadow-2xl rounded-sm border-t-4 border-vintage-gold relative z-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-10">
          <motion.div
            variants={fadeInUp}
            className="flex justify-center mb-6 text-vintage-brown"
          >
            {isLogin ? (
              <LogIn size={40} strokeWidth={1} />
            ) : (
              <UserPlus size={40} strokeWidth={1} />
            )}
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-serif text-3xl md:text-4xl text-vintage-brown mb-3"
          >
            {isLogin ? "Curatorial Access" : "Become a Collector"}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="font-sans text-vintage-light-brown text-sm"
          >
            {isLogin
              ? "Enter your credentials to access your collection."
              : "Register your details to acquire rare artifacts."}
          </motion.p>
        </div>

        <motion.form
          variants={fadeInUp}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {!isLogin && (
            <div className="relative group">
              <input
                type="text"
                id="name"
                name="name"
                required={!isLogin}
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-vintage-gold/30 pl-10 py-4 text-vintage-brown font-serif text-lg focus:outline-none focus:border-vintage-gold transition-colors duration-300 peer placeholder-transparent"
                placeholder="Full Name"
              />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-vintage-light-brown group-focus-within:text-vintage-gold transition-colors">
                <User size={20} strokeWidth={1.5} />
              </div>
              <label
                htmlFor="name"
                className="absolute left-10 -top-3.5 text-xs font-sans tracking-[0.2em] uppercase text-vintage-light-brown transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-vintage-light-brown/60 peer-placeholder-shown:top-4 peer-placeholder-shown:font-serif peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-sans peer-focus:tracking-[0.2em] peer-focus:uppercase peer-focus:text-vintage-brown"
              >
                Full Name
              </label>
            </div>
          )}

          <div className="relative group">
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent border-b-2 border-vintage-gold/30 pl-10 py-4 text-vintage-brown font-serif text-lg focus:outline-none focus:border-vintage-gold transition-colors duration-300 peer placeholder-transparent"
              placeholder="Email Address"
            />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-vintage-light-brown group-focus-within:text-vintage-gold transition-colors">
              <Mail size={20} strokeWidth={1.5} />
            </div>
            <label
              htmlFor="email"
              className="absolute left-10 -top-3.5 text-xs font-sans tracking-[0.2em] uppercase text-vintage-light-brown transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-vintage-light-brown/60 peer-placeholder-shown:top-4 peer-placeholder-shown:font-serif peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-sans peer-focus:tracking-[0.2em] peer-focus:uppercase peer-focus:text-vintage-brown"
            >
              Email Address
            </label>
          </div>

          <div className="relative group">
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent border-b-2 border-vintage-gold/30 pl-10 py-4 text-vintage-brown font-serif text-lg focus:outline-none focus:border-vintage-gold transition-colors duration-300 peer placeholder-transparent"
              placeholder="Password"
            />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-vintage-light-brown group-focus-within:text-vintage-gold transition-colors">
              <Lock size={20} strokeWidth={1.5} />
            </div>
            <label
              htmlFor="password"
              className="absolute left-10 -top-3.5 text-xs font-sans tracking-[0.2em] uppercase text-vintage-light-brown transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-vintage-light-brown/60 peer-placeholder-shown:top-4 peer-placeholder-shown:font-serif peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-xs peer-focus:font-sans peer-focus:tracking-[0.2em] peer-focus:uppercase peer-focus:text-vintage-brown"
            >
              Password
            </label>
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <Link
                to="#"
                className="text-xs font-sans tracking-widest text-vintage-brown hover:text-vintage-gold border-b border-transparent hover:border-vintage-gold transition-colors uppercase"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex justify-center items-center gap-4 bg-vintage-brown text-vintage-cream border-2 border-vintage-brown w-full py-4 font-sans font-medium text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 rounded-sm mt-4"
          >
            <span className="absolute inset-0 bg-vintage-gold translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></span>
            <span className="relative z-10 group-hover:text-vintage-brown transition-colors duration-500 flex items-center justify-center gap-3 w-full">
              {isSubmitting
                ? "Authenticating..."
                : isLogin
                  ? "Authenticate"
                  : "Register Collection"}
            </span>
          </button>
        </motion.form>

        <motion.div
          variants={fadeInUp}
          className="mt-8 text-center border-t border-vintage-gold/10 pt-8"
        >
          <p className="font-sans text-sm text-vintage-light-brown">
            {isLogin
              ? "Do not possess an account? "
              : "Already an esteemed member? "}
            <button
              onClick={toggleMode}
              className="text-vintage-brown font-bold hover:text-vintage-gold uppercase tracking-widest ml-1 transition-colors underline decoration-vintage-gold/30 hover:decoration-vintage-gold underline-offset-4"
            >
              {isLogin ? "Register" : "Sign In"}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
