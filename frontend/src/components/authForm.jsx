
import React, { useState } from "react";
import {
  ArrowRight,
  LogIn,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

export default function AuthForm({
  mode,
  onSubmit,
  onBack,
  onSwitchMode,
  error,
  success,
  loading
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Form data
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "candidate",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password) {
      return;
    }

    if (mode === "register") {

      if (!form.name.trim()) {
        return;
      }

      if (form.password.length < 6) {
        return;
      }

      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
    }

    // Send form data to WelcomePage
    onSubmit(form);
  };

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50";

  const labelStyle =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-50 px-5 py-12">

      <div className="grid items-center max-w-6xl gap-10 mx-auto lg:grid-cols-2">

        {/* Supporting content */}
        <div className="hidden lg:block">

          <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-white border rounded-full shadow-sm border-slate-200">
            <ShieldCheck size={18} />
            Your career journey starts here
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight mt-7 text-slate-900 xl:text-5xl">
            Connect your ambition with
            <span className="text-indigo-600"> opportunity.</span>
          </h1>

          <p className="max-w-lg mt-5 text-base leading-7 text-slate-500">
            Access your profile, discover new roles, and manage your
            applications from one professional portal.
          </p>

          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=85"
            alt="Team collaborating"
            className="object-cover w-full mt-8 border shadow-sm h-72 rounded-2xl border-slate-200"
          />

        </div>

        {/* Authentication form */}
        <div className="w-full max-w-md mx-auto bg-white border shadow-sm rounded-2xl border-slate-200 p-7 sm:p-9">

          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold transition-colors mb-7 text-slate-500 hover:text-indigo-600"
          >
            ← Back to home
          </button>

          {/* Form Icon */}
          <div className="flex items-center justify-center mb-6 text-indigo-600 h-14 w-14 rounded-xl bg-indigo-50">
            {mode === "login" ? (
              <LogIn size={25} />
            ) : (
              <UserPlus size={25} />
            )}
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {mode === "login"
              ? "Sign in to continue to OpportunityHub."
              : "Join OpportunityHub and discover opportunities."}
          </p>

          {/* Error Message */}
          {error && (
            <p
              role="alert"
              className="p-3 mt-5 text-sm font-medium border rounded-xl border-rose-100 bg-rose-50 text-rose-700"
            >
              {error}
            </p>
          )}

          {/* Success Message */}
          {success && (
            <p
              role="status"
              className="p-3 mt-5 text-sm font-medium border rounded-xl border-emerald-100 bg-emerald-50 text-emerald-700"
            >
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 mt-7">

            {/* Name field */}
            {mode === "register" && (
              <label className="block">
                <span className={labelStyle}>
                  Full Name
                </span>

                <input
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputStyle}
                />
              </label>
            )}

            {/* Candidate role */}
            {mode === "register" && (
              <label className="block">
                <span className={labelStyle}>
                  Account Type
                </span>

                <select
                  name="accountType"
                  value={form.accountType}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="candidate">
                    Candidate / Student
                  </option>
                </select>
              </label>
            )}

            {/* Email field */}
            <label className="block">
              <span className={labelStyle}>
                Email Address
              </span>

              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputStyle}
              />
            </label>

            {/* Password field */}
            <label className="block">
              <span className={labelStyle}>
                Password
              </span>

              <div className="relative">
                <input
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${inputStyle} pr-16`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-sm font-semibold text-indigo-600 -translate-y-1/2 right-4 top-1/2 hover:text-indigo-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {/* Confirm Password */}
            {mode === "register" && (
              <label className="block">
                <span className={labelStyle}>
                  Confirm Password
                </span>

                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={inputStyle}
                />
              </label>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Login to your account"
                  : "Create account"}

              {!loading && <ArrowRight size={17} />}
            </button>

          </form>

          {/* Switch login/register */}
          <p className="mt-6 text-sm text-center text-slate-500">
            {mode === "login"
              ? "New to OpportunityHub?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={onSwitchMode}
              className="ml-2 font-semibold text-indigo-600 hover:text-indigo-700"
            >
              {mode === "login" ? "Register" : "Login"}
            </button>
          </p>

        </div>
      </div>
    </section>
  );
}
