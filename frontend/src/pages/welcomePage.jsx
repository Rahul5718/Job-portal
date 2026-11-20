import React, { useState,useEffect } from "react";

import Navbar from "../components/navbar";
import HeroSection from "../components/heroSection";
import OpportunityCard from "../components/opportunityCard";
import AboutSection from "../components/aboutSection";
import AuthForm from "../components/authForm";
import Footer from "../components/footer";

import CandidateDashboard from "./CandidateDashboard";
import AdminDashboard from "./adminDashboard";
import API from '../services/api';

import {
  ArrowRight,
} from "lucide-react";

export default function WelcomePage({
  user,
  onLogout,
  onNavigateToJobs,
  onLoginSuccess,
  
}) {
  const [authMode, setAuthMode] = useState(null);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "recruiter";

  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);
const [loadingOpportunities, setLoadingOpportunities] = useState(true);

useEffect(() => {
  const fetchOpportunities = async () => {
    try {
      const response = await API.get("/opportunities");

      setFeaturedOpportunities(
        response.data.opportunities || []
      );

    } catch (error) {
      console.error(
        "Error fetching opportunities:",
        error.response?.data || error.message
      );
    } finally {
      setLoadingOpportunities(false);
    }
  };

  fetchOpportunities();
}, []);

  // Show dashboard after successful login
  if (user) {
    return (
      <div className="min-h-screen bg-slate-50">

        {/* Authenticated header */}
        <header className="sticky top-0 z-30 bg-white border-b">
          <div className="flex items-center justify-between h-20 px-5 mx-auto max-w-7xl">

            <a href="#dashboard" className="text-xl font-extrabold">
              Opportunity<span className="text-indigo-600">Hub</span>
            </a>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold">
                  {user.name || "Welcome"}
                </p>

                <p className="text-xs text-slate-500">
                  {isAdmin ? "Admin / Recruiter" : "Candidate"}
                </p>
              </div>

              <div className="flex items-center justify-center w-10 h-10 font-bold text-indigo-700 bg-indigo-100 rounded-full">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>

              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-semibold border rounded-lg hover:bg-rose-50 hover:text-rose-600"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Role-based dashboard */}
        <main className="px-5 py-8 mx-auto max-w-7xl">
          {isAdmin ? (
            <AdminDashboard user={user} />
          ) : (
            <CandidateDashboard
              user={user}
              onNavigateToJobs={onNavigateToJobs}
            />
          )}
        </main>
      </div>
    );
  }

  // Open login or registration
  const openAuth = (mode) => {
    setAuthError("");
    setAuthSuccess("");
    setAuthMode(mode);
  };

  // Submit login or registration


const handleAuthSubmit = async (formData) => {
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    try {
        // ================= REGISTER =================
        if (authMode === "register") {

            const response = await API.post("/auth/register", {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            setAuthSuccess(
                response.data.message || "Registration successful!"
            );

            // After successful registration, switch to login
            setAuthMode("login");

        }

        // ================= LOGIN =================
        else {

            const response = await API.post("/auth/login", {
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            const { user, token, message } = response.data;

            if (!user || !token) {
                throw new Error("User or authentication token is missing.");
            }

            // Send authenticated user and token to App.jsx
            onLoginSuccess(user, token);

            setAuthSuccess(message || "Login successful!");

        }

    } catch (error) {

        console.error("Registration/Login Error:", error);

        console.log("Error response:", error.response?.data);
        console.log("Status:", error.response?.status);

        setAuthError(
            error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again."
        );

    } finally {
        setAuthLoading(false);
    }
};



  const handleProtectedAction = (callback) => {
  if (!user) {
    setAuthMode("register");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  callback?.();
};

  return (
    <div className="min-h-screen bg-white">

      {/* Navigation */}
      <Navbar
        onLogin={() => openAuth("login")}
        onRegister={() => openAuth("register")}
      />

      {/* Public landing page */}
      {!authMode && (
        <>
          <HeroSection
              onRegister={() => handleProtectedAction()}
              onExplore={() => handleProtectedAction(() => {
                document.getElementById("opportunities")?.scrollIntoView({
                  behavior: "smooth"
                });
              })}
          />

          {/* Featured opportunities */}
          <section
            id="opportunities"
            className="px-5 py-16 scroll-mt-24"
          >
            <div className="mx-auto max-w-7xl">

              <div className="max-w-2xl mx-auto text-center">
                <span className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
                  Explore your options
                </span>

                <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                  Opportunities for every career stage
                </h2>

                <p className="mt-4 text-slate-500">
                  Explore different career paths and find roles that match
                  your goals, education, and interests.
                </p>
              </div>

              {/*Opportunity cards*/ }
              {/* Featured opportunities from MongoDB */}
              {loadingOpportunities ? (
                <p className="mt-10 text-center text-slate-500">
                  Loading opportunities...
                </p>
              ) : featuredOpportunities.length > 0 ? (
                <div className="grid gap-5 mt-10 md:grid-cols-3">
                  {featuredOpportunities.slice(0, 3).map((item) => (
                    <OpportunityCard
                      key={item.id}
                      opportunity={item}
                      onExplore={() => openAuth("register")}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-10 text-center text-slate-500">
                  No opportunities available currently.
                </p>
              )}

              {/* Explore portal button */}
              <div className="mt-10 text-center">
                <button
                  onClick={() => {
                    if (onNavigateToJobs) {
                      onNavigateToJobs();
                    } else {
                      openAuth("login");
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-4 font-semibold text-white rounded-xl bg-slate-900 hover:bg-indigo-700"
                >
                  Explore the portal <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </section>

          {/* About section */}
          <AboutSection
            onRegister={() => handleProtectedAction()}
          />

          {/* Call to action */}
          <section className="px-5 py-16">
            <div className="px-6 mx-auto text-center text-white max-w-7xl rounded-3xl bg-gradient-to-r from-indigo-700 to-violet-600 py-14">

              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Ready to take the next step?
              </h2>

              <p className="max-w-2xl mx-auto mt-4 leading-7 text-indigo-100">
                Create your account, complete your profile, and start
                exploring opportunities that match your ambitions.
              </p>

              <button
                onClick={() => openAuth("register")}
                className="py-4 mt-8 font-bold text-indigo-700 bg-white rounded-xl px-7 hover:bg-indigo-50"
              >
                Get Started
              </button>
            </div>
          </section>

          {/* Footer */}
          <Footer
            onLogin={() => openAuth("login")}
            onRegister={() => openAuth("register")}
          />
        </>
      )}

      {/* Login and registration page */}
      {authMode && (
        <AuthForm
          mode={authMode}
          onSubmit={handleAuthSubmit}
          onBack={() => {
            setAuthMode(null);
            setAuthError("");
            setAuthSuccess("");
          }}
          onSwitchMode={() => {
            setAuthError("");
            setAuthSuccess("");
            setAuthMode(
              authMode === "login" ? "register" : "login"
            );
          }}
          error={authError}
          success={authSuccess}
          loading={authLoading}
        />
      )}
       
    </div>
  );
}