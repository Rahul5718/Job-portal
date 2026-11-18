const nodemailer = require("nodemailer")
require("dotenv").config()

const transporter = nodemailer.createTransport({
     service:"gmail",
     auth : {
          user:process.env.EMAIL_USER,
          pass:process.env.EMAIL_PASS
     }
})

//common email sesnding function

async function sendEmail(to,subject,html){
     if(!to){
          throw new Error("REcipient email address is missing");
     }

     return await transporter.sendMail({
          from:`"OpportunityHub"<${process.env.EMAIL_USER}>`,
          to,
          subject,
          html
     })
}

//user application confirmation

async function sendApplicationConfirmation(candidate,opportunity){
     const html = `
          <h2>Application Submitted Successfully!</h2>
        <p>Hello ${candidate.name},</p>
        <p>Your application has been submitted successfully.</p>
        <p><strong>Position:</strong> ${opportunity.title}</p>
        <p><strong>Company:</strong> ${opportunity.company}</p>
        <p>We will notify you when your application status changes.</p>
        <p>Thank you for using OpportunityHub!</p>`

     return sendEmail(
          candidate.email,
          `Application Submitted - ${opportunity.title}`,
          html
     )
}

//receive application notification 

async function sendCompanyNotification(candidate, opportunity) {
    const html = `
        <h2>New Job Application Received</h2>
        <p>Hello ${opportunity.company},</p>
        <p>A new candidate has applied for your opportunity.</p>
        <p><strong>Position:</strong> ${opportunity.title}</p>
        <p><strong>Candidate:</strong> ${candidate.name}</p>
        <p><strong>Email:</strong> ${candidate.email}</p>
        <p>Please log in to OpportunityHub to review the application.</p>
    `;

    return sendEmail(
        opportunity.companyEmail,
        `New Application Received - ${opportunity.title}`,
        html
    );
}

//Candidate receives application status update

async function sendStatusUpdate(candidate, opportunity, status, nextStep = "") {
    let message = "";

    switch (status) {
        case "Shortlisted":
            message = `
                <h2>Congratulations! You have been shortlisted.</h2>
                <p>Your application for ${opportunity.title} at
                ${opportunity.company} has been shortlisted.</p>
                <p><strong>Next step:</strong> ${nextStep || "The company will contact you with further instructions."}</p>
            `;
            break;

        case "Rejected":
            message = `
                <h2>Application Status Update</h2>
                <p>Thank you for applying for ${opportunity.title} at
                ${opportunity.company}.</p>
                <p>Unfortunately, your application has not been selected
                at this stage.</p>
            `;
            break;

        case "Accepted":
            message = `
                <h2>Congratulations! Your application has been accepted.</h2>
                <p>Your application for ${opportunity.title} at
                ${opportunity.company} has been accepted.</p>
                <p>${nextStep || "The company will contact you with further details."}</p>
            `;
            break;

        case "Pending":
        case "Submitted":
            message = `
                <h2>Application Status Update</h2>
                <p>Your application for ${opportunity.title} at
                ${opportunity.company} is currently ${status}.</p>
            `;
            break;

        default:
            throw new Error("Unsupported application status");
    }

    return sendEmail(
        candidate.email,
        `Application ${status} - ${opportunity.title}`,
        `
            <p>Hello ${candidate.name},</p>
            ${message}
            <p>Thank you for using OpportunityHub!</p>
        `
    );
}

module.exports = {
    sendApplicationConfirmation,
    sendCompanyNotification,
    sendStatusUpdate
};