const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const Application = require("../models/application");
const {
    sendApplicationConfirmation,
    sendCompanyNotification,
    sendStatusUpdate
} = require("../services/emailService");

function formatApplication(application) {
  const opportunity = application.opportunity || {};
  const candidate = application.candidate || {};
  const appliedDate = application.applicationDate || application.createdAt;

  return {
    id: String(application._id),
    opportunityId: String(application.opportunityId),
    title: opportunity.title || application.title || "Opportunity",
    company: opportunity.company || opportunity.companyName || application.company || "",
    appliedAt: appliedDate ? new Date(appliedDate).toLocaleDateString() : "",
    status: application.status || "submitted",
    applicant: {
      ...(application.applicant || {}),
      name: application.applicant?.name || candidate.name || "",
      email: application.applicant?.email || candidate.email || "",
    },
  };
}

exports.applyForOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.body;
    const submittedApplicant = req.body.applicant;

    const applicant =
      submittedApplicant &&
      typeof submittedApplicant === "object" &&
      !Array.isArray(submittedApplicant)
        ? submittedApplicant
        : {};

    if (!ObjectId.isValid(String(opportunityId))) {
      return res.status(400).json({ message: "Invalid opportunity ID." });
    }

    const db = getDB();

    //Find the opportunity
    const opportunity = await db.collection("opportunities").findOne({
      _id: new ObjectId(String(opportunityId)),
    });

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found." });
    }

    if (
      !opportunity.adminId ||
      !ObjectId.isValid(String(opportunity.adminId))
    ) {
      return res.status(400).json({
        message: "This opportunity is missing its owning admin.",
      });
    }

    // Get the logged-in candidate
    const userId = req.user.userId;

    const candidateFromDB = await db.collection("users").findOne({
      _id: new ObjectId(String(userId)),
    });

    if (!candidateFromDB) {
      return res.status(404).json({ message: "Candidate account not found." });
    }

    const candidate = {
      name: candidateFromDB.name || applicant.name || "Candidate",
      email: candidateFromDB.email || applicant.email || "",
    };

    // Prevent duplicate applications
    const existing = await db.collection("applications").findOne({
      userId: new ObjectId(String(userId)),
      opportunityId: opportunity._id,
    });

    if (existing) {
      return res.status(409).json({
        message: "You have already applied for this opportunity.",
      });
    }

    //  Save application in MongoDB
    const application = await Application.create({
      userId,
      opportunityId: opportunity._id,
      adminId: opportunity.adminId,
      applicant: {
        ...applicant,
        name: candidate.name,
        email: candidate.email,
      },
      resume: applicant.resumeLink || "",
      status: "Submitted",
    });

    //  Send candidate confirmation email
    try {
      await sendApplicationConfirmation(candidate, opportunity);
      
    } catch (emailError) {
      console.error("Candidate email failed:", emailError.message);
    }

    //  Notify the company
    if (opportunity.companyEmail) {
      try {
        await sendCompanyNotification(candidate, opportunity);
        
      } catch (emailError) {
        console.error("Company notification failed:", emailError.message);
      }
    } else {
      console.log("Company email is missing for this opportunity.");
    }

    //  Return successful response
    return res.status(201).json({
      message: "Application submitted successfully.",
      application: formatApplication({
        ...application,
        opportunity,
      }),
    });

  } catch (error) {
    console.error("Create application error:", error);
    return res.status(500).json({
      message: "Failed to submit application.",
    });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findByUser(req.user.userId);
    return res.status(200).json({
      applications: applications.map(formatApplication),
    });
  } catch (error) {
    console.error("Get candidate applications error:", error);
    return res.status(500).json({ message: "Failed to fetch applications." });
  }
};

exports.getAdminApplications = async (req, res) => {
  try {
    const applications = await Application.findByAdmin(req.user.userId);
    return res.status(200).json({
      applications: applications.map(formatApplication),
    });
  } catch (error) {
    console.error("Get admin applications error:", error);
    return res.status(500).json({ message: "Failed to fetch applications." });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, nextStep } = req.body;

    const allowedStatuses = [
      "Submitted",
      "Pending",
      "Shortlisted",
      "Accepted",
      "Rejected",
    ];

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid application ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status.",
      });
    }

    const db = getDB();

    // 1. Find the application belonging to this admin
    const application = await db.collection("applications").findOne({
      _id: new ObjectId(id),
      adminId: new ObjectId(String(req.user.userId)),
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found or you are not authorized.",
      });
    }

    // 2. Update the application status
    const result = await db.collection("applications").updateOne(
      {
        _id: new ObjectId(id),
        adminId: new ObjectId(String(req.user.userId)),
      },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (!result.matchedCount) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    // 3. Send email only when the status actually changes
    if (application.status !== status) {
      try {
        // Find candidate details
        const candidateFromDB = await db.collection("users").findOne({
          _id: new ObjectId(String(application.userId)),
        });

        // Find opportunity details
        const opportunity = await db.collection("opportunities").findOne({
          _id: new ObjectId(String(application.opportunityId)),
        });

        if (candidateFromDB && opportunity) {
          const candidate = {
            name: candidateFromDB.name || "Candidate",
            email: candidateFromDB.email || "",
          };

          if (candidate.email) {
            await sendStatusUpdate(
              candidate,
              opportunity,
              status,
              nextStep || ""
            );

            console.log(`Status email sent: ${status}`);
          } else {
            console.log("Candidate email address is missing.");
          }
        }
      } catch (emailError) {
        // Do not undo the status update if email delivery fails
        console.error("Status update email failed:", emailError.message);
      }
    }

    return res.status(200).json({
      message: "Application status updated successfully.",
      status,
    });

  } catch (error) {
    console.error("Update application status error:", error);
    return res.status(500).json({
      message: "Failed to update application status.",
    });
  }
};
