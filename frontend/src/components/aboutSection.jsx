
import React from "react";
import {
  Search,
  BriefcaseBusiness,
  Users,
  Building2,
  ArrowRight,
} from "lucide-react";

export default function AboutSection({ onRegister }) {
  return (
    <section
      id="about"
      className="scroll-mt-24 bg-slate-50 px-5 py-16 lg:py-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

        {/* About content */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            About OpportunityHub
          </span>

          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            A Smarter Way to Manage Your Career Journey.
          </h2>

          <p className="mt-5 text-base font-normal leading-7 text-slate-500">
            OpportunityHub brings opportunity discovery and application
            tracking together. Candidates can maintain their profiles and
            explore roles, while administrators can manage listings and
            review applications.
          </p>

          <button
            onClick={onRegister}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700"
          >
            Join OpportunityHub
            <ArrowRight size={17} />
          </button>
        </div>

        {/* Features */}
        <div className="grid gap-5 sm:grid-cols-2">

          <FeatureCard
            icon={Search}
            title="Discover Roles"
            description="Explore opportunities by job title, skill, and domain."
            color="text-indigo-600 bg-indigo-50"
          />

          <FeatureCard
            icon={BriefcaseBusiness}
            title="Track Applications"
            description="Keep your application history organized."
            color="text-violet-600 bg-violet-50"
          />

          <FeatureCard
            icon={Users}
            title="Candidate Profiles"
            description="Maintain your education, skills, and resume details."
            color="text-emerald-600 bg-emerald-50"
          />

          <FeatureCard
            icon={Building2}
            title="Admin Tools"
            description="Manage opportunities and review applications."
            color="text-amber-600 bg-amber-50"
          />

        </div>
      </div>
    </section>
  );
}

// Reusable feature card
function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

      <div className={`inline-flex rounded-xl p-3 ${color}`}>
        <Icon size={23} />
      </div>

      <h3 className="mt-4 text-base font-bold tracking-tight text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm font-normal leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}
