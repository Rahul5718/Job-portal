
import { useEffect,useMemo, useState } from "react";
import API from "../services/api";
import {
  Menu,
  LayoutDashboard,
  Search,
  BriefcaseBusiness,
  FileText,
  UserRound,
  ChevronRight,
  MapPin,
  CalendarDays,
  GraduationCap,
  ArrowUpRight,
  X,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  college: "",
  university: "",
  degree: "",
  graduationYear: "",
  tenthMarks: "",
  twelfthMarks: "",
  graduationMarks: "",
  preferredJob: "",
  preferredLocation: "",
  resumeLink: "",
};  

// Reusable input field.
function Field({ label, name, value, onChange, type = "text", ...props }) {
  return (
    <label className="block min-w-0">
      <span className="block mb-2 text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        {...props}
        className="w-full min-w-0 px-4 py-3 text-sm transition bg-white border outline-none rounded-xl border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
      />
    </label>
  );
}

// Reusable summary card.
function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="p-3 text-indigo-600 rounded-xl bg-indigo-50">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

// Reusable opportunity card.
function OpportunityCard({ item, onView, onApply, applied }) {
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-12 h-12 text-indigo-700 shrink-0 rounded-xl bg-indigo-50">
          <BriefcaseBusiness size={23} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold break-words text-slate-900">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{item.company}</p>
        </div>
        <span className="px-3 py-1 text-xs font-medium rounded-full shrink-0 bg-emerald-50 text-emerald-700">
          {item.type}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 line-clamp-3 text-slate-600">
        {item.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
  {(Array.isArray(item.skills)
    ? item.skills
    : (item.skills || "").split(",").map((skill) => skill.trim())
  ).map((skill) => (
    <span
      key={skill}
      className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600"
    >
      {skill}
    </span>
  ))}
</div>

      <div className="flex flex-wrap pt-4 mt-5 text-xs border-t gap-x-4 gap-y-2 border-slate-100 text-slate-500">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} />
          {item.location}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays size={14} />
          Deadline: {item.deadline}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button
          onClick={() => onView(item)}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View details
        </button>
        <button
          onClick={() => onApply(item)}
          disabled={applied}
          className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-emerald-600"
        >
          {applied ? "Applied" : "Apply now"}
        </button>
      </div>
    </article>
  );
}

export default function UserDashboard({ user }) {
  // Sidebar starts expanded. The same button hides and restores it.
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("All Domains");
  const [selected, setSelected] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
 
   // Get the unique MongoDB ID of the logged-in candidate.
const userId = user?._id || user?.id || user?.userId;

// Create a separate storage key for each candidate.
const profileKey = userId
  ? `opportunityhub-profile-${userId}`
  : null;

// Start with an empty profile.
const [profile, setProfile] = useState(emptyProfile);

// Load only the logged-in candidate's profile.
useEffect(() => {
  const loadProfile = async () => {
    try {
      const response = await API.get("/profile/me");

      if (response.data.profile) {
        setProfile({
          ...emptyProfile,
          ...response.data.profile,
        });
      } else {
        // First-time student: fill account details
        setProfile({
          ...emptyProfile,
          name: user?.name || "",
          email: user?.email || "",
        });
      }
    } catch (error) {
      console.error("Profile loading error:", error);

      setApplicationMessage(
        error.response?.data?.message ||
        "Could not load your profile."
      );
    }
  };

  loadProfile();
}, [user?._id, user?.id, user?.userId, user?.name, user?.email]);

  const domains = [
    "All Domains",
    ...new Set(
      opportunities.map((item) => item.domain).filter(Boolean)),
  ];
   const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return opportunities.filter((item) => {
      const skills = Array.isArray(item.skills)
        ? item.skills
        : (item.skills || "")
            .split(",")
            .map((skill) => skill.trim());

      const searchableText = [
        item.title,
        item.company,
        item.domain,
        item.location,
        ...skills,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesDomain =
        domain === "All Domains" || item.domain === domain;

      return matchesSearch && matchesDomain;
    });
  }, [opportunities, search, domain]);

  useEffect(() => {
  const loadCandidateData = async () => {
    try {
      const [opportunityResponse, applicationResponse] =
        await Promise.all([
          API.get("/opportunities"),
          API.get("/applications/my-applications"),
        ]);

      setOpportunities(
        opportunityResponse.data.opportunities || []
      );

      setApplications(
        applicationResponse.data.applications || []
      );
    } catch (error) {
      console.error("Loading error:", error);

      setApplicationMessage(
        error.response?.data?.message ||
        "Could not load opportunities and applications."
      );
    }
  };

  loadCandidateData();
}, []);

// Save or update student profile in MongoDB
const saveProfile = async (event) => {
  event.preventDefault();

  try {
    await API.put("/profile/me", profile);

    setApplicationMessage(
      "Your profile has been saved successfully."
    );
  } catch (error) {
    console.error("Profile save error:", error);

    setApplicationMessage(
      error.response?.data?.message ||
      "Could not save your profile."
    );
  }
};

const applyToOpportunity = async (item) => {
  // Prevent duplicate applications by the same user.
  const alreadyApplied = applications.some(
    (application) =>
      application.opportunityId === item.id
  );

  if (alreadyApplied) {
    setApplicationMessage(
      "You have already applied for this opportunity."
    );
    return;
  }

  // Ensure the user has saved the required profile information.
  if (
    !profile.name.trim() ||
    !profile.email.trim() ||
    !profile.resumeLink.trim()
  ) {
    setApplicationMessage(
      "Please complete your profile and add your resume before applying."
    );
    setActivePage("My Profile");
    return;
  }

  try {
    const response = await API.post("/applications/apply", {
      opportunityId: item.id,
      applicant: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      college: profile.college,
      university: profile.university,
      degree: profile.degree,
      graduationYear: profile.graduationYear,
      tenthMarks: profile.tenthMarks,
      twelfthMarks: profile.twelfthMarks,
      graduationMarks: profile.graduationMarks,
      resumeLink: profile.resumeLink,
      },
    });

    setApplications((previous) => [...previous, response.data.application]);
    setSelected(null);
    setApplicationMessage(`Your application for ${item.title} was submitted successfully.`);
    setActivePage("My Applications");
    setTimeout(() => {
      setApplicationMessage("");
    }, 3000);
  } catch (error) {
    setApplicationMessage(
      error.response?.data?.message || "Could not submit your application."
    );
  }
};


  const navigation = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Opportunities", icon: BriefcaseBusiness },
    { label: "My Applications", icon: FileText },
    { label: "My Profile", icon: UserRound },
  ];

  const changePage = (page) => {
    setActivePage(page);
    setSelected(null);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800">
      {/* Application header — menu button remains available when sidebar is hidden. */}
      <header className="sticky top-0 z-30 flex h-[72px] w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        <div className="flex items-center min-w-0 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={sidebarOpen}
            className="flex items-center justify-center w-10 h-10 transition border shrink-0 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            <Menu size={21} />
          </button>

          <div className="min-w-0">
            <p className="text-lg font-bold tracking-tight truncate text-slate-900 sm:text-xl">
              Opportunity<span className="text-indigo-600">Hub</span>
            </p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Discover your next opportunity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-500 md:block">
            Student Portal
          </span>
          <div className="flex items-center justify-center w-10 h-10 text-indigo-700 rounded-full bg-indigo-50">
            <GraduationCap size={21} />
          </div>
        </div>
      </header>

      {/* Sidebar and page content share the full available viewport width. */}
      <div className="flex min-h-[calc(100vh-72px)] w-full">
        {sidebarOpen && (
          <aside className="fixed bottom-0 left-0 top-[72px] z-20 flex w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 shadow-sm md:sticky md:top-[72px] md:h-[calc(100vh-72px)] md:shadow-none">
            <p className="px-3 mb-4 text-xs font-semibold tracking-wider uppercase text-slate-400">
              Workspace
            </p>

            <nav className="space-y-1.5">
              {navigation.map(({ label, icon: Icon }) => {
                const active = activePage === label && !selected;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => changePage(label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={19} />
                    <span>{label}</span>
                    {active && (
                      <ChevronRight className="ml-auto" size={16} />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 mt-auto rounded-2xl bg-slate-50">
              <p className="text-sm font-semibold text-slate-800">
                Find your next step
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Explore opportunities that match your interests and skills.
              </p>
              <button
                type="button"
                onClick={() => changePage("Opportunities")}
                className="flex items-center gap-2 mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Explore now <ArrowUpRight size={15} />
              </button>
            </div>
          </aside>
        )}

        {/* Main content expands when the sidebar is collapsed. */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto w-full max-w-[1600px]">
            {applicationMessage && (
              <div
                role="status"
                className="flex items-start gap-3 p-4 mb-6 text-sm border rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800"
              >
                <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
                <p className="flex-1">{applicationMessage}</p>
                <button
                  type="button"
                  onClick={() => setApplicationMessage("")}
                  aria-label="Dismiss message"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            {/* Dashboard overview */}
            {activePage === "Dashboard" && !selected && (
              <>
                <section className="flex flex-col justify-between gap-4 mb-8 lg:flex-row lg:items-center">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">
                      STUDENT WORKSPACE
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      Dashboard overview
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Track your applications and discover new opportunities.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => changePage("Opportunities")}
                    className="inline-flex items-center self-start justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition bg-indigo-600 shadow-sm rounded-xl hover:bg-indigo-700 lg:self-auto"
                  >
                    <Search size={17} /> Browse opportunities
                  </button>
                </section>

                <section className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 xl:grid-cols-3">
                  <StatCard
                    title="Available opportunities"
                    value={opportunities.length}
                    subtitle="Listings to explore"
                    icon={BriefcaseBusiness}
                  />
                  <StatCard
                    title="My applications"
                    value={applications.length}
                    subtitle="Applications saved"
                    icon={FileText}
                  />
                  <StatCard
                    title="Profile completion"
                    value={`${Math.round(
                      ([
                        "name",
                        "email",
                        "college",
                        "university",
                        "degree",
                        "graduationYear",
                      ].filter((key) => profile[key]?.trim()).length /
                        6) *
                        100
                    )}%`}
                    subtitle="Based on essential profile fields"
                    icon={UserRound}
                  />
                </section>

                <section className="p-6 mb-8 text-white rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-600 sm:p-8">
                  <div className="max-w-2xl">
                    <p className="text-sm font-medium text-indigo-100">
                      YOUR NEXT OPPORTUNITY STARTS HERE
                    </p>
                    <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                      Turn your skills into opportunities.
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-indigo-100">
                      Find internships and jobs, explore roles by domain, and
                      keep your applications organized in one place.
                    </p>
                    <button
                      type="button"
                      onClick={() => changePage("Opportunities")}
                      className="inline-flex items-center gap-2 px-4 py-3 mt-5 text-sm font-semibold text-indigo-700 transition bg-white rounded-xl hover:bg-indigo-50"
                    >
                      Explore opportunities <ArrowUpRight size={17} />
                    </button>
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Recommended opportunities
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Explore the latest sample listings.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => changePage("Opportunities")}
                      className="text-sm font-semibold text-indigo-600 shrink-0 hover:text-indigo-800"
                    >
                      View all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {opportunities.slice(0, 4).map((item) => (
                      <OpportunityCard
                        key={item.id}
                        item={item}
                        onView={setSelected}
                        onApply={applyToOpportunity}
                        applied={applications.some((app) => app.opportunityId  === item.id)}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Opportunities search and filters */}
            {activePage === "Opportunities" && !selected && (
              <>
                <section className="mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Explore opportunities
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Search internships and jobs by role, company, skills, or domain.
                  </p>
                </section>

                <section className="p-4 mb-6 bg-white border shadow-sm rounded-2xl border-slate-200 sm:p-5">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <label className="relative block min-w-0">
                      <Search
                        size={19}
                        className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400"
                      />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search job title, company, skill..."
                        className="w-full py-3 pr-4 text-sm border outline-none rounded-xl border-slate-200 pl-11 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      />
                    </label>

                    <label className="relative block min-w-0">
                      <SlidersHorizontal
                        size={17}
                        className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400"
                      />
                      <select
                        value={domain}
                        onChange={(event) => setDomain(event.target.value)}
                        className="w-full py-3 pr-4 text-sm bg-white border outline-none appearance-none rounded-xl border-slate-200 pl-11 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      >
                        {domains.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </section>

                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <p className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-900">
                      {filteredOpportunities.length}
                    </span>{" "}
                    opportunities found
                  </p>
                  {(search || domain !== "All Domains") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setDomain("All Domains");
                      }}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {filteredOpportunities.length ? (
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {filteredOpportunities.map((item) => (
                      <OpportunityCard
                        key={item.id}
                        item={item}
                        onView={setSelected}
                        onApply={applyToOpportunity}
                        applied={applications.some((app) => app.opportunityId  === item.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-16 text-center bg-white border border-dashed rounded-2xl border-slate-300">
                    <Search className="mx-auto text-slate-400" size={32} />
                    <h3 className="mt-4 font-semibold text-slate-900">
                      No opportunities found
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Try another keyword or select a different domain.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Opportunity details */}
            {selected && (
              <section>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="mb-6 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  ← Back to opportunities
                </button>

                <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200 sm:p-8">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex items-center justify-center text-indigo-700 h-14 w-14 shrink-0 rounded-2xl bg-indigo-50">
                        <BriefcaseBusiness size={27} />
                      </div>
                      <div className="min-w-0">
                        <h1 className="text-2xl font-bold break-words text-slate-900">
                          {selected.title}
                        </h1>
                        <p className="mt-2 text-slate-500">{selected.company}</p>
                        <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={15} /> {selected.location}
                          </span>
                          <span>{selected.type}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => applyToOpportunity(selected)}
                      disabled={applications.some(
                        (app) => app.opportunityId === selected.id
                      )}
                      className="px-5 py-3 text-sm font-semibold text-white bg-indigo-600 shrink-0 rounded-xl hover:bg-indigo-700 disabled:bg-emerald-600"
                    >
                      {applications.some((app) => app.opportunityId  === selected.id)
                        ? "Already applied"
                        : "Submit application"}
                    </button>
                  </div>

                  <div className="border-t my-7 border-slate-100" />

                  <h2 className="text-lg font-bold text-slate-900">
                    About this opportunity
                  </h2>
                  <p className="max-w-3xl mt-3 text-sm leading-7 text-slate-600">
                    {selected.description}
                  </p>

                  <h2 className="text-lg font-bold mt-7 text-slate-900">
                    Required skills
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(Array.isArray(selected.skills)
                        ? selected.skills
                        : (selected.skills || "").split(",").map((skill) => skill.trim())
                      ).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-2 text-sm text-indigo-700 rounded-lg bg-indigo-50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="p-4 mt-7 rounded-xl bg-slate-50">
                    <p className="text-sm font-medium text-slate-700">
                      Application deadline
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {selected.deadline}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Application history */}
            {activePage === "My Applications" && !selected && (
              <>
                <section className="mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    My applications
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Review the opportunities you have applied for.
                  </p>
                </section>

                {applications.length ? (
                  <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
                    <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
                      <span>Opportunity</span>
                      <span>Applied on</span>
                      <span>Status</span>
                    </div>
                    {applications.map((application) => (
                      <div
                        key={application.id}
                        className="grid grid-cols-1 gap-3 border-b border-slate-100 px-5 py-5 last:border-b-0 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-center sm:gap-4 sm:px-6"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold break-words text-slate-900">
                            {application.title}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {application.company}
                          </p>
                        </div>
                        <p className="text-sm text-slate-500">
                          <span className="sm:hidden">Applied: </span>
                          {application.appliedAt}
                        </p>
                        <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                          {application.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-16 text-center bg-white border border-dashed rounded-2xl border-slate-300">
                    <FileText className="mx-auto text-slate-400" size={32} />
                    <h2 className="mt-4 font-semibold text-slate-900">
                      No applications yet
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      When you apply for an opportunity, it will appear here.
                    </p>
                    <button
                      type="button"
                      onClick={() => changePage("Opportunities")}
                      className="px-5 py-3 mt-5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
                    >
                      Browse opportunities
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Existing account details can be edited here — no duplicate account card in sidebar. */}
            {activePage === "My Profile" && !selected && (
              <>
                <section className="mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    My profile
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Manage your education, contact details, resume, and career preferences.
                  </p>
                </section>

                <form
                  onSubmit={saveProfile}
                  className="p-5 space-y-6 bg-white border shadow-sm rounded-2xl border-slate-200 sm:p-8"
                >
                  <section>
                    <h2 className="text-base font-bold text-slate-900">
                      Personal information
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Update the details associated with your existing account.
                    </p>
                    <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
                      <Field
                        label="Full name"
                        name="name"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        required
                      />
                      <Field
                        label="Email address"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        placeholder="Enter your email"
                        required
                      />
                      <Field
                        label="Phone number"
                        name="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </section>

                  <div className="border-t border-slate-100" />

                  <section>
                    <h2 className="text-base font-bold text-slate-900">
                      Education details
                    </h2>
                    <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
                      <Field
                        label="College"
                        name="college"
                        value={profile.college}
                        onChange={(e) =>
                          setProfile({ ...profile, college: e.target.value })
                        }
                        placeholder="College name"
                      />
                      <Field
                        label="University"
                        name="university"
                        value={profile.university}
                        onChange={(e) =>
                          setProfile({ ...profile, university: e.target.value })
                        }
                        placeholder="University name"
                      />
                      <Field
                        label="Degree / Diploma"
                        name="degree"
                        value={profile.degree}
                        onChange={(e) =>
                          setProfile({ ...profile, degree: e.target.value })
                        }
                        placeholder="e.g. B.E. Computer Engineering"
                      />
                      <Field
                        label="Graduation year"
                        name="graduationYear"
                        type="number"
                        value={profile.graduationYear}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            graduationYear: e.target.value,
                          })
                        }
                        placeholder="e.g. 2027"
                      />
                      <Field
                        label="10th marks (%)"
                        name="tenthMarks"
                        type="number"
                        value={profile.tenthMarks}
                        onChange={(e) =>
                          setProfile({ ...profile, tenthMarks: e.target.value })
                        }
                        placeholder="e.g. 85"
                        min="0"
                        max="100"
                      />
                      <Field
                        label="12th / Diploma marks (%)"
                        name="twelfthMarks"
                        type="number"
                        value={profile.twelfthMarks}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            twelfthMarks: e.target.value,
                          })
                        }
                        placeholder="e.g. 80"
                        min="0"
                        max="100"
                      />
                      <Field
                        label="Graduation marks / CGPA"
                        name="graduationMarks"
                        value={profile.graduationMarks}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            graduationMarks: e.target.value,
                          })
                        }
                        placeholder="e.g. 8.2 CGPA or 75%"
                      />
                    </div>
                  </section>

                  <div className="border-t border-slate-100" />

                  <section>
                    <h2 className="text-base font-bold text-slate-900">
                      Career preferences
                    </h2>
                    <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
                      <Field
                        label="Preferred job role"
                        name="preferredJob"
                        value={profile.preferredJob}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            preferredJob: e.target.value,
                          })
                        }
                        placeholder="e.g. Java Developer"
                      />
                      <Field
                        label="Preferred location"
                        name="preferredLocation"
                        value={profile.preferredLocation}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            preferredLocation: e.target.value,
                          })
                        }
                        placeholder="e.g. Pune, Remote"
                      />
                      <div className="md:col-span-2">
                        <Field
                          label="Resume link (Google Drive or other URL)"
                          name="resumeLink"
                          type="url"
                          value={profile.resumeLink}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              resumeLink: e.target.value,
                            })
                          }
                          placeholder="https://drive.google.com/..."
                        />
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          Ensure your Drive link has the correct sharing permissions.
                        </p>
                      </div>
                    </div>
                  </section>

                  <div className="flex flex-wrap justify-end gap-3 pt-5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() =>
                        setProfile({ ...emptyProfile, ...profile })
                      }
                      className="px-5 py-3 text-sm font-semibold border rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      Reset form
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
                    >
                      Save profile
                    </button>
                  </div>
                </form>
              </>
            )}

            <footer className="py-5 mt-10 text-xs text-center border-t border-slate-200 text-slate-400">
              OpportunityHub · Discover opportunities and build your future
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
