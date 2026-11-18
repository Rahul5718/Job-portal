import React from "react";
import { MapPin, Briefcase, Clock, ArrowUpRight } from "lucide-react";


const OpportunityCard = ({ opportunity, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col">

      {/* Company and opportunity information */}
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Briefcase className="text-indigo-600" size={23} />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
          {opportunity.type || "Full Time"}
        </span>
      </div>

      {/* Job title */}
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {opportunity.title}
      </h3>

      {/* Company name */}
      <p className="text-sm font-medium text-indigo-600 mb-4">
        {opportunity.company}
      </p>

      {/* Job details */}
      <div className="space-y-3 text-sm text-slate-500 mb-5">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          {opportunity.location || "Not specified"}
        </div>

        <div className="flex items-center gap-2">
          <Briefcase size={16} />
          {opportunity.domain || "General"}
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} />
          Deadline: {opportunity.deadline || "Not specified"}
        </div>
      </div>

      {/* Opportunity description */}
      <p className="text-sm text-slate-500 leading-6 line-clamp-3 mb-6">
        {opportunity.description}
      </p>

      {/* View details button */}
      <button
        onClick={() => onViewDetails?.(opportunity)} 
        className="mt-auto w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
      >
        View Details
        <ArrowUpRight size={17} />
      </button>
    </div>
  );
};

export default OpportunityCard;