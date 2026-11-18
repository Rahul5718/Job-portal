
import React, { useState } from "react";
import WelcomePage from "./pages/welcomePage";

export default function App() {

  // Get the previously logged-in user from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("opportunityhub-user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error loading user:", error);
      return null;
    }
  });

  // Called after successful backend login
  const handleLoginSuccess = (user, token) => {

    // Save user information
    localStorage.setItem(
      "opportunityhub-user",
      JSON.stringify(user)
    );

    // Save JWT authentication token
    localStorage.setItem("opportunityhub-token", token);

    // Update application state
    setCurrentUser(user);
  };

  // Logout user
  const handleLogout = () => {

    localStorage.removeItem("opportunityhub-user");
    localStorage.removeItem("opportunityhub-token");

    setCurrentUser(null);
  };

  return (
    <WelcomePage
      user={currentUser}
      onLoginSuccess={handleLoginSuccess}
      onLogout={handleLogout}
      onNavigateToJobs={() => {
        window.location.hash = "opportunities";
      }}
    />
  );
}
