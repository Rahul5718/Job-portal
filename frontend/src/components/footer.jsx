import React from "react";

export default function Footer() {
  return (
    <footer className="border-t p-6 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} OpportunityHub.
      All rights reserved.
    </footer>
  );
}