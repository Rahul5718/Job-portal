
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

function formatOpportunity(opportunity) {
  return {
    ...opportunity,
    id: String(opportunity._id),
    company: opportunity.company || opportunity.companyName || "",
    companyEmail: opportunity.companyEmail || opportunity.email || "",
    type: opportunity.type || opportunity.jobType || opportunity.employmentType || "",
    deadline: opportunity.deadline || opportunity.applicationDeadline || "",
    applicationlink: opportunity.applicationlink || opportunity.applicationLink || "",
  };
}

// ADMIN: CREATE OPPORTUNITY

exports.createOpportunity = async (req, res) => {
  try {
    const {
      title,
      company,
      companyEmail,
      domain,
      description,
      location,
      type,
      jobType,
      skills,
      salary,
      experience,
      deadline,
      applicationlink
    } = req.body;

    if (!title || !company || !description || !companyEmail) {
      return res.status(400).json({
        message: "Title, companyname, email and description are required"
      });
    }

    // Get admin ID from verified JWT
    const adminId = req.user.userId;

    if (!ObjectId.isValid(String(adminId))) {
      return res.status(400).json({
        message: "Invalid admin ID"
      });
    }

    const db = getDB();

    const opportunity = {
      adminId: new ObjectId(adminId),
      title: title.trim(),
      company: company.trim(),
      companyEmail:companyEmail.trim().toLowerCase(),
      domain: domain || "",
      description: description.trim(),
      location: location || "",
      jobType: jobType || type || "Full-time",
      skills: Array.isArray(skills) ? skills : [],
      salary: salary || "",
      experience: experience || "",
      deadline: deadline || "",
      applicationlink: applicationlink || "",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("opportunities")
      .insertOne(opportunity);

    return res.status(201).json({
      message: "Opportunity posted successfully",
      opportunity: formatOpportunity({ ...opportunity, _id: result.insertedId })
    });

  } catch (error) {
    console.error("Create opportunity error:", error);

    return res.status(500).json({
      message: "Failed to create opportunity"
    });
  }
};


// ALL USERS: GET ALL OPPORTUNITIES

exports.getAllOpportunities = async (req, res) => {
  try {
    const db = getDB();

    const opportunities = await db.collection("opportunities")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      message: "Opportunities fetched successfully",
      opportunities: opportunities.map(formatOpportunity)
    });

  } catch (error) {
    console.error("Get opportunities error:", error);

    return res.status(500).json({
      message: "Failed to fetch opportunities"
    });
  }
};


// GET SINGLE OPPORTUNITY BY ID

exports.getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid opportunity ID"
      });
    }

    const db = getDB();

    const opportunity = await db.collection("opportunities")
      .findOne({
        _id: new ObjectId(id)
      });

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found"
      });
    }

    return res.status(200).json({
      message: "Opportunity fetched successfully",
      opportunity: formatOpportunity(opportunity)
    });

  } catch (error) {
    console.error("Get opportunity error:", error);

    return res.status(500).json({
      message: "Failed to fetch opportunity"
    });
  }
};


// ADMIN: UPDATE OPPORTUNITY

exports.updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid opportunity ID"
      });
    }

    const {
      title,
      company,
      companyEmail,
      domain,
      description,
      location,
      type,
      jobType,
      skills,
      salary,
      experience,
      deadline,
      applicationlink
    } = req.body;

    const db = getDB();

    const updateData = {
      updatedAt: new Date()
    };

    if (title !== undefined) updateData.title = title.trim();
    if (company !== undefined) updateData.company = company.trim();
    if(companyEmail !== undefined) updateData.companyEmail = companyEmail.trim().toLowerCase()
    if (domain !== undefined) updateData.domain = domain;
    if (description !== undefined) updateData.description = description.trim();
    if (location !== undefined) updateData.location = location;
    if (jobType !== undefined || type !== undefined) {
      updateData.jobType = jobType || type;
    }
    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({
          message: "Skills must be an array"
        });
      }
      updateData.skills = skills;
    }
    if (salary !== undefined) updateData.salary = salary;
    if (experience !== undefined) updateData.experience = experience;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (applicationlink !== undefined) updateData.applicationlink = applicationlink;

    const result = await db.collection("opportunities").updateOne(
      {
        _id: new ObjectId(id),
        adminId: new ObjectId(req.user.userId)
      },
      {
        $set: updateData
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Opportunity not found or you are not authorized"
      });
    }

    return res.status(200).json({
      message: "Opportunity updated successfully"
    });

  } catch (error) {
    console.error("Update opportunity error:", error);

    return res.status(500).json({
      message: "Failed to update opportunity"
    });
  }
};


// ADMIN: DELETE OPPORTUNITY

exports.deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid opportunity ID"
      });
    }

    const db = getDB();

    const result = await db.collection("opportunities").deleteOne({
      _id: new ObjectId(id),
      adminId: new ObjectId(req.user.userId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Opportunity not found or you are not authorized"
      });
    }

    return res.status(200).json({
      message: "Opportunity deleted successfully"
    });

  } catch (error) {
    console.error("Delete opportunity error:", error);

    return res.status(500).json({
      message: "Failed to delete opportunity"
    });
  }
};


// ADMIN: GET OWN OPPORTUNITIES

exports.getAdminOpportunities = async (req, res) => {
  try {
    const db = getDB();

    const opportunities = await db.collection("opportunities")
      .find({
        adminId: new ObjectId(req.user.userId)
      })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      message: "Admin opportunities fetched successfully",
      opportunities: opportunities.map(formatOpportunity)
    });

  } catch (error) {
    console.error("Admin opportunities error:", error);

    return res.status(500).json({
      message: "Failed to fetch admin opportunities"
    });
  }
};
