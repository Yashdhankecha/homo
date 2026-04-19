import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const theme = {
  sage: "#6B7F5E",
  charcoal: "#333333",
  linen: "#F8F6F2",
  textGray: "#666666",
  white: "#ffffff",
};

const getHTMLTemplate = (title, content, appointment) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: ${theme.charcoal}; background-color: ${theme.linen}; margin: 0; padding: 40px 0; }
    .container { max-width: 600px; margin: 0 auto; background: ${theme.white}; border-radius: 24px; overflow: hidden; shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(107, 127, 94, 0.1); }
    .header { background-color: ${theme.sage}; padding: 40px; text-align: center; color: ${theme.white}; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 400; letter-spacing: 1px; }
    .header p { margin: 5px 0 0; opacity: 0.8; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
    .content { padding: 40px; }
    .content h2 { color: ${theme.sage}; font-size: 22px; margin-top: 0; }
    .details { background-color: ${theme.linen}; padding: 25px; border-radius: 16px; margin: 25px 0; border: 1px solid rgba(107, 127, 94, 0.1); }
    .details-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
    .details-label { font-weight: bold; color: ${theme.sage}; }
    .footer { padding: 30px; text-align: center; font-size: 12px; color: ${theme.textGray}; border-top: 1px solid ${theme.linen}; }
    .button { display: inline-block; padding: 14px 30px; background-color: ${theme.sage}; color: ${theme.white} !important; text-decoration: none; border-radius: 30px; font-weight: bold; margin-top: 20px; transition: background 0.3s ease; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Homoecare</h1>
      <p>by Dr. Kruti Desai</p>
    </div>
    <div class="content">
      <h2>${title}</h2>
      ${content}
      
      <div class="details">
        <div class="details-row"><span class="details-label">Patient Name:</span> <span>${appointment.name}</span></div>
        <div class="details-row"><span class="details-label">Preferred Date:</span> <span>${new Date(appointment.preferredDate).toLocaleDateString()}</span></div>
        <div class="details-row"><span class="details-label">Time Slot:</span> <span style="text-transform: capitalize;">${appointment.preferredTime}</span></div>
        <div class="details-row"><span class="details-label">Consultation:</span> <span style="text-transform: capitalize;">${appointment.mode}</span></div>
      </div>

      <p>If you have any questions, feel free to message us on WhatsApp at <strong>+91 9081660475</strong>.</p>
    </div>
    <div class="footer">
      <p>© 2026 Homoecare by Dr. Kruti Desai. All rights reserved.</p>
      <p>Anand, Gujarat, India</p>
    </div>
  </div>
</body>
</html>
`;

export const sendAppointmentEmail = async (appointment, type) => {
  if (!appointment.email) return;

  let subject = "";
  let title = "";
  let content = "";

  switch (type) {
    case "applied":
      subject = "Appointment Request Received - Homoecare";
      title = "Request Received";
      content = `
        <p>Dear ${appointment.name},</p>
        <p>Thank you for choosing Homoecare. We have received your appointment request and it is currently being reviewed by Dr. Kruti Desai.</p>
        <p>You will receive a confirmation message shortly via WhatsApp or Email.</p>
      `;
      break;

    case "confirmed":
      subject = "Appointment Confirmed - Homoecare";
      title = "Consultation Confirmed";
      content = `
        <p>Dear ${appointment.name},</p>
        <p>Your appointment has been <strong>successfully confirmed</strong>! We look forward to helping you on your healing journey.</p>
        <p>If this is a Video consultation, Dr. Kruti will share the session link with you shortly before the scheduled time.</p>
        <a href="https://wa.me/919081660475" class="button">Visit WhatsApp Chat</a>
      `;
      break;

    case "completed":
      subject = "Consultation Follow-up - Homoecare";
      title = "Healing Journey Continued";
      content = `
        <p>Dear ${appointment.name},</p>
        <p>It was a pleasure consulting with you today. We hope the session provided you with clarity and a clear path toward recovery.</p>
        <p>Please follow the prescribed regimen carefully. Feel free to reach out if you have any questions regarding your treatment.</p>
      `;
      break;

    case "rejected":
      subject = "Appointment Status Update - Homoecare";
      title = "Update on your Request";
      content = `
        <p>Dear ${appointment.name},</p>
        <p>We appreciate your interest in Homoecare. However, we are unable to fulfill your specific appointment request at this time due to scheduling constraints.</p>
        <p>Please feel free to book another available slot or contact us directly to find a suitable time.</p>
      `;
      break;

    default:
      return;
  }

  const html = getHTMLTemplate(title, content, appointment);

  try {
    await transporter.sendMail({
      from: `"Homoecare" <${process.env.EMAIL_USER}>`,
      to: appointment.email,
      subject,
      html,
    });
    console.log(`Professional HTML email sent for ${type} to ${appointment.email}`);
  } catch (error) {
    console.error("Error sending professional email:", error);
  }
};
