
import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  MapPin,
  CalendarDays,
  Users,
  CheckCircle2,
  Clock,
  ChevronDown,
  ExternalLink
} from "lucide-react";

const EMPTY_FORM = {
  title: "",
  company: "",
  companyEmail:"",
  domain: "Software Development",
  location: "",
  type: "Internship",
  deadline: "",
  description: "",
  skills: "",
  experience: "",
  applicationlink: "",
};

// Reusable field for the add/edit opportunity form.
function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = true,
  ...props
}) {
  return (
    <label className="block min-w-0">
      <span className="block mb-2 text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
        className="w-full px-4 py-3 text-sm transition bg-white border outline-none rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
      />
    </label>
  );
}

function StatusBadge({ status }) {
  const normalized = (status || "Submitted").toLowerCase();

  const styles = {
    submitted: "bg-blue-50 text-blue-700",
    pending: "bg-amber-50 text-amber-700",
    shortlisted: "bg-violet-50 text-violet-700",
    accepted: "bg-emerald-50 text-emerald-700",
    rejected: "bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        styles[normalized] || styles.submitted
      }`}
    >
      {status || "Submitted"}
    </span>
  );
}

export default function AdminDashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);

  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [applicationSearch, setApplicationSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [opportunityResponse, applicationResponse] = await Promise.all([
          API.get("/opportunities/admin/my-opportunities"),
          API.get("/applications/admin-applications"),
        ]);
        setOpportunities(opportunityResponse.data.opportunities || []);
        setApplications(applicationResponse.data.applications || []);
      } catch (error) {
        setNotice(
          `Error: ${error.response?.data?.message || "Could not load dashboard data."}`
        );
      }
    };

    loadDashboardData();
  }, []);

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return opportunities.filter((item) =>
      [
        item.title,
        item.company,
        item.domain,
        item.location,
        item.type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [opportunities, search]);

  const filteredApplications = useMemo(() => {
    const query = applicationSearch.trim().toLowerCase();

    return applications.filter((item) =>
      [
        item.title,
        item.company,
        item.status,
        item.applicant?.name,
        item.applicant?.email,
        item.applicant?.college,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [applications, applicationSearch]);

  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormOpen(true);
  };

  const openEditForm = (item) => {
    setEditingId(item.id);
    setForm({
      ...EMPTY_FORM,
      ...item,
      skills: Array.isArray(item.skills)
        ? item.skills.join(", ")
        : item.skills || "",
    });
    setFormOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  // Create a new opportunity or update the selected one.
  const handleSaveOpportunity = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      title: form.title.trim(),
      company: form.company.trim(),
      description: form.description.trim(),
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await API.put(`/opportunities/${editingId}`, payload);
        setOpportunities((previous) =>
          previous.map((item) => item.id === editingId ? { ...item, ...payload } : item)
        );
        setNotice("Opportunity updated successfully.");
        setTimeout(()=>{
          setNotice()
        },2000)
      } else {
        const response = await API.post("/opportunities", payload);
        setOpportunities((previous) => [response.data.opportunity, ...previous]);
        setNotice("Opportunity added successfully.");
      }
      setFormOpen(false);
      setEditingId(null);
      setForm({ ...EMPTY_FORM });
    } catch (error) {
      setNotice(`Error: ${error.response?.data?.message || "Could not save opportunity."}`);
    }
  };

  // Confirm before deleting an opportunity.
  const handleDeleteOpportunity = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) return;

    try {
      await API.delete(`/opportunities/${item.id}`);
      setOpportunities((previous) =>
        previous.filter((opportunity) => opportunity.id !== item.id)
      );
      setNotice("Opportunity deleted.");
    } catch (error) {
      setNotice(`Error: ${error.response?.data?.message || "Could not delete opportunity."}`);
    }
  };

  // Update the application status from the admin panel.
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await API.patch(`/applications/${applicationId}/status`, { status });
      setApplications((previous) =>
        previous.map((application) =>
          application.id === applicationId ? { ...application, status } : application
        )
      );
      setNotice("Application status updated.");
    } catch (error) {
      setNotice(`Error: ${error.response?.data?.message || "Could not update application status."}`);
    }
  };

  const navigation = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Manage Opportunities", icon: BriefcaseBusiness },
    { label: "Applications", icon: FileText },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800">
      {/* Top header */}
      <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Opportunity<span className="text-indigo-600">Hub</span>
          </p>
          <p className="hidden text-xs text-slate-500 sm:block">
            Administration portal
          </p>
        </div>

        <span className="px-3 py-2 text-xs font-semibold text-indigo-700 rounded-full bg-indigo-50 sm:px-4 sm:text-sm">
          Administrator
        </span>
      </header>

      <div className="flex min-h-[calc(100vh-72px)]">
        {/* Admin navigation */}
        <aside className="hidden w-[250px] shrink-0 border-r border-slate-200 bg-white px-4 py-6 md:block">
          <p className="px-3 mb-4 text-xs font-semibold tracking-wider uppercase text-slate-400">
            Admin workspace
          </p>

          <nav className="space-y-2">
            {navigation.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActiveTab(label);
                  setFormOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  activeTab === label
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={19} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto max-w-[1500px]">
            {/* Mobile navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto md:hidden">
              {navigation.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => {
                    setActiveTab(label);
                    setFormOpen(false);
                  }}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    activeTab === label
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* Success feedback */}
            {notice && (
              <div className={`flex items-center gap-3 p-4 mb-6 text-sm border rounded-xl ${
                notice.startsWith("Error:")
                  ? "border-rose-200 bg-rose-50 text-rose-800"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}>
                <CheckCircle2 size={18} />
                <span className="flex-1">{notice}</span>
                <button onClick={() => setNotice("")} aria-label="Dismiss">
                  <X size={17} />
                </button>
              </div>
            )}

            {/* Overview page */}
            {activeTab === "Overview" && (
              <>
                <section className="mb-8">
                  <p className="text-sm font-semibold text-indigo-600">
                    ADMINISTRATION
                  </p>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Admin dashboard
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Manage listings and monitor submitted applications.
                  </p>
                </section>

                <section className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500">
                        Total opportunities
                      </p>
                      <BriefcaseBusiness className="text-indigo-600" size={21} />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-slate-900">
                      {opportunities.length}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Current listings
                    </p>
                  </div>

                  <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500">
                        Total applications
                      </p>
                      <Users className="text-violet-600" size={21} />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-slate-900">
                      {applications.length}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Submitted application records
                    </p>
                  </div>

                  <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500">
                        Pending review
                      </p>
                      <Clock className="text-amber-600" size={21} />
                    </div>
                    <p className="mt-4 text-3xl font-bold text-slate-900">
                      {
                        applications.filter((item) =>
                          ["submitted", "pending"].includes(
                            (item.status || "Submitted").toLowerCase()
                          )
                        ).length
                      }
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Awaiting a decision
                    </p>
                  </div>
                </section>

                <section className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Quick actions
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Manage the portal from one place.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-5 sm:grid-cols-2">
                    <button
                      onClick={() => {
                        setActiveTab("Manage Opportunities");
                        openAddForm();
                      }}
                      className="flex items-center gap-4 p-4 text-left transition border rounded-xl border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                    >
                      <span className="p-3 text-indigo-600 rounded-xl bg-indigo-50">
                        <Plus size={21} />
                      </span>
                      <span>
                        <span className="block font-semibold text-slate-900">
                          Add opportunity
                        </span>
                        <span className="block mt-1 text-sm text-slate-500">
                          Publish a new job or internship.
                        </span>
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab("Applications")}
                      className="flex items-center gap-4 p-4 text-left transition border rounded-xl border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                    >
                      <span className="p-3 rounded-xl bg-violet-50 text-violet-600">
                        <FileText size={21} />
                      </span>
                      <span>
                        <span className="block font-semibold text-slate-900">
                          View applications
                        </span>
                        <span className="block mt-1 text-sm text-slate-500">
                          Review candidates and update status.
                        </span>
                      </span>
                    </button>
                  </div>
                </section>
              </>
            )}

            {/* Add, edit, and delete opportunities */}
            {activeTab === "Manage Opportunities" && (
              <>
                <section className="flex flex-col justify-between gap-4 mb-7 sm:flex-row sm:items-center">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      Manage opportunities
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                      Create, update, and remove job or internship listings.
                    </p>
                  </div>

                  {!formOpen && (
                    <button
                      onClick={openAddForm}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
                    >
                      <Plus size={18} /> Add opportunity
                    </button>
                  )}
                </section>

                {formOpen && (
                  <section className="p-5 mb-8 bg-white border shadow-sm rounded-2xl border-slate-200 sm:p-7">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {editingId ? "Edit opportunity" : "Add new opportunity"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Enter the listing details below.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormOpen(false)}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                        aria-label="Close form"
                      >
                        <X size={19} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveOpportunity}>
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                          label="Opportunity title"
                          name="title"
                          value={form.title}
                          onChange={handleFormChange}
                          placeholder="e.g. React Developer Intern"
                        />
                        <FormField
                          label="Company name"
                          name="company"
                          value={form.company}
                          onChange={handleFormChange}
                          placeholder="Company name"
                        />

                        <FormField
                          label="Company contact email"
                          name="companyEmail"
                          type="email"
                          value={form.companyEmail}
                          onChange={handleFormChange}
                          placeholder="hr@opportunityhub.com"
                        />

                        <label className="block">
                          <span className="block mb-2 text-sm font-medium text-slate-700">
                            Domain
                          </span>
                          <select
                            name="domain"
                            value={form.domain}
                            onChange={handleFormChange}
                            className="w-full px-4 py-3 text-sm bg-white border outline-none rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                          >
                            {[
                              "Software Development",
                              "Web Development",
                              "Data Analytics",
                              "Cybersecurity",
                              "Design",
                              "Marketing",
                              "Other",
                            ].map((domain) => (
                              <option key={domain}>{domain}</option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="block mb-2 text-sm font-medium text-slate-700">
                            Employment type
                          </span>
                          <select
                            name="type"
                            value={form.type}
                            onChange={handleFormChange}
                            className="w-full px-4 py-3 text-sm bg-white border outline-none rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                          >
                            <option>Internship</option>
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                          </select>
                        </label>

                        <FormField
                          label="Location"
                          name="location"
                          value={form.location}
                          onChange={handleFormChange}
                          placeholder="e.g. Pune or Remote"
                        />

                        <FormField
                          label = "Experience"
                          name = "experience"
                          value = {form.experience}
                          onChange = {handleFormChange}
                          placeholder = "0 - 2 yers"
                          />
                        <FormField
                          label = "Application Link"
                          name = "applicationlink"
                          value = {form.applicationlink}
                          onChange = {handleFormChange}
                          placeholder = "https://example.com/apply"
                          />
                        <FormField
                          label="Application deadline"
                          name="deadline"
                          type="date"
                          value={form.deadline}
                          onChange={handleFormChange}
                        />

                        <div className="md:col-span-2">
                          <label className="block">
                            <span className="block mb-2 text-sm font-medium text-slate-700">
                              Description
                            </span>
                            <textarea
                              name="description"
                              value={form.description}
                              onChange={handleFormChange}
                              required
                              rows={4}
                              placeholder="Describe the responsibilities and requirements..."
                              className="w-full px-4 py-3 text-sm border outline-none resize-y rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                            />
                          </label>
                        </div>

                        <div className="md:col-span-2">
                          <FormField
                            label="Skills (separate with commas)"
                            name="skills"
                            value={form.skills}
                            onChange={handleFormChange}
                            placeholder="React, JavaScript, SQL"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-end gap-3 pt-5 mt-6 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setFormOpen(false)}
                          className="px-5 py-3 text-sm font-semibold border rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
                        >
                          {editingId ? "Save changes" : "Create opportunity"}
                        </button>
                      </div>
                    </form>
                  </section>
                )}

                <section className="mb-5">
                  <label className="relative block max-w-xl">
                    <Search
                      size={18}
                      className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400"
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search opportunities..."
                      className="w-full py-3 pr-4 text-sm bg-white border outline-none rounded-xl border-slate-200 pl-11 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />
                  </label>
                </section>

                <section className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sm:px-6">
                    <h2 className="font-bold text-slate-900">
                      All listings ({filteredOpportunities.length})
                    </h2>
                  </div>

                  {filteredOpportunities.length ? (
                    <div className="divide-y divide-slate-100">
                      {filteredOpportunities.map((item) => (
                        <article
                          key={item.id}
                          className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6"
                        >
                          <div className="flex min-w-0 gap-4">
                            <div className="flex items-center justify-center w-12 h-12 text-indigo-600 shrink-0 rounded-xl bg-indigo-50">
                              <BriefcaseBusiness size={22} />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold break-words text-slate-900">
                                {item.title}
                              </h3>
                              <p className="mt-1 text-sm text-slate-500">
                                {item.company} · {item.domain}
                              </p>
                              <div className="flex flex-wrap mt-2 text-xs gap-x-4 gap-y-2 text-slate-500">
                                <span className="flex items-center gap-1">
                                  <MapPin size={13} /> {item.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <CalendarDays size={13} /> {item.deadline}
                                </span>
                                <span>{item.type}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => openEditForm(item)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                              <Pencil size={15} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteOpportunity(item)}
                              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 size={15} /> Delete
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="px-5 text-center py-14">
                      <BriefcaseBusiness
                        size={30}
                        className="mx-auto text-slate-400"
                      />
                      <p className="mt-3 font-semibold text-slate-800">
                        No opportunities found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Add a listing or try another search.
                      </p>
                    </div>
                  )}
                </section>
              </>
            )}

            {/* View applications and change their status */}
            {activeTab === "Applications" && (
              <>
                <section className="mb-7">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Student applications
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Review submitted applications and update their status.
                  </p>
                </section>

                <section className="p-4 mb-5 bg-white border shadow-sm rounded-2xl border-slate-200">
                  <label className="relative block">
                    <Search
                      size={18}
                      className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400"
                    />
                    <input
                      value={applicationSearch}
                      onChange={(event) =>
                        setApplicationSearch(event.target.value)
                      }
                      placeholder="Search by student, email, company, or role..."
                      className="w-full py-3 pr-4 text-sm border outline-none rounded-xl border-slate-200 pl-11 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />
                  </label>
                </section>

                {filteredApplications.length ? (
                  <section className="space-y-4">
                    {filteredApplications.map((application, index) => {
                      const applicationId =
                        application.id ?? `application-${index}`;
                      const applicant = application.applicant || {};

                      return (
                        <article
                          key={applicationId}
                          className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200 sm:p-6"
                        >
                          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                            <div className="min-w-0">
                              <h2 className="text-lg font-bold break-words text-slate-900">
                                {application.title || "Opportunity"}
                              </h2>
                              <p className="mt-1 text-sm text-slate-500">
                                {application.company || "Company not specified"}
                              </p>

                              <div className="grid grid-cols-1 gap-3 mt-4 text-sm sm:grid-cols-2">
                                <div>
                                  <p className="text-xs font-medium tracking-wide uppercase text-slate-400">
                                    Applicant
                                  </p>
                                  <p className="mt-1 font-medium text-slate-800">
                                    {applicant.name || "Name not recorded"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium tracking-wide uppercase text-slate-400">
                                    Email
                                  </p>
                                  <p className="mt-1 break-all text-slate-700">
                                    {applicant.email || "Email not recorded"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium tracking-wide uppercase text-slate-400">
                                    College
                                  </p>
                                  <p className="mt-1 text-slate-700">
                                    {applicant.college || "Not provided"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium tracking-wide uppercase text-slate-400">
                                    Application date
                                  </p>
                                  <p className="mt-1 text-slate-700">
                                    {application.appliedAt || "Not recorded"}
                                  </p>
                                </div>
                                {applicant.resumeLink && (
                                  <div className="sm:col-span-2">
                                    <a
                                      href={applicant.resumeLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-800"
                                    >
                                      View resume <ExternalLink size={14} />
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-start gap-3 shrink-0 lg:items-end">
                              <StatusBadge status={application.status} />
                              <label className="block w-full lg:w-48">
                                <span className="block mb-2 text-xs font-medium text-slate-500">
                                  Update status
                                </span>
                                <div className="relative">
                                  <select
                                    value={application.status || "Submitted"}
                                    onChange={(event) =>
                                      updateApplicationStatus(
                                        applicationId,
                                        event.target.value
                                      )
                                    }
                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm outline-none focus:border-indigo-500"
                                  >
                                    <option>Submitted</option>
                                    <option>Pending</option>
                                    <option>Shortlisted</option>
                                    <option>Accepted</option>
                                    <option>Rejected</option>
                                  </select>
                                  <ChevronDown
                                    size={15}
                                    className="absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 text-slate-400"
                                  />
                                </div>
                              </label>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </section>
                ) : (
                  <div className="px-5 py-16 text-center bg-white border border-dashed rounded-2xl border-slate-300">
                    <FileText
                      size={32}
                      className="mx-auto text-slate-400"
                    />
                    <h2 className="mt-4 font-semibold text-slate-900">
                      No applications found
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Applications submitted by users will appear here when saved.
                    </p>
                  </div>
                )}
              </>
            )}

            <footer className="py-5 mt-10 text-xs text-center border-t border-slate-200 text-slate-400">
              OpportunityHub Admin Portal
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
