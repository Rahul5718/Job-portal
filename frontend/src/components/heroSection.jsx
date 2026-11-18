
import React from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Search,
  Users,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

export default function HeroSection({ onRegister, onLogin }) {
  return (
    <section
      id="home"
      className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-10 lg:py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

        {/* Hero content */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            <BriefcaseBusiness size={16} />
            Welcome to OpportunityHub
          </span>

          <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Discover opportunities.
            <span className="block text-indigo-600">
              Build your career.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-500">
            Explore internships and job opportunities, build your professional
            profile, and manage your applications from one simple platform.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={onRegister}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Get Started
              <ArrowRight size={17} />
            </button>

            <button
              onClick={onLogin}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </button>
          </div>

          {/* Highlights */}
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-emerald-600" />
              Easy application tracking
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-emerald-600" />
              Student friendly
            </span>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative">
          <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85"
              alt="Professionals working together"
              className="h-[350px] w-full rounded-2xl object-cover sm:h-[430px]"
            />
          </div>

          <div className="absolute -bottom-5 left-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:left-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <GraduationCap size={23} />
              </div>
              <div>
                <p className="font-bold text-slate-900">Student opportunities</p>
                <p className="text-xs text-slate-500">
                  Start your career journey
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-2 top-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:-right-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Users size={22} />
              </div>
              <div>
                <p className="font-bold text-slate-900">Career growth</p>
                <p className="text-xs text-slate-500">
                  Explore and apply
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
