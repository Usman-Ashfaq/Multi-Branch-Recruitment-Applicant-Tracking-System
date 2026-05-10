const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"ATS Recruitment" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error.message);
    throw error;
  }
};

// Email Templates
const shortlistEmailTemplate = (candidateName, jobTitle) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎉 Congratulations!</h1>
    </div>
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #333;">Dear <strong>${candidateName}</strong>,</p>
      <p style="font-size: 15px; color: #555; line-height: 1.6;">
        We are pleased to inform you that you have been <strong style="color: #e2b714;">shortlisted</strong> for the position of <strong>${jobTitle}</strong>.
      </p>
      <p style="font-size: 15px; color: #555; line-height: 1.6;">
        Our team will reach out to you shortly with the next steps in the recruitment process. Please ensure your contact information is up to date.
      </p>
      <div style="background: #f8f9fa; border-left: 4px solid #e2b714; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #555; font-size: 14px;">Stay tuned for further updates. We look forward to speaking with you!</p>
      </div>
      <p style="font-size: 14px; color: #888; margin-top: 30px;">Best regards,<br><strong>ATS Recruitment Team</strong></p>
    </div>
  </div>
`;

const rejectionEmailTemplate = (candidateName, jobTitle) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Application Update</h1>
    </div>
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #333;">Dear <strong>${candidateName}</strong>,</p>
      <p style="font-size: 15px; color: #555; line-height: 1.6;">
        Thank you for your interest in the <strong>${jobTitle}</strong> position and for taking the time to apply.
      </p>
      <p style="font-size: 15px; color: #555; line-height: 1.6;">
        After careful consideration, we regret to inform you that we have decided to move forward with other candidates for this particular role.
      </p>
      <p style="font-size: 15px; color: #555; line-height: 1.6;">
        We encourage you to apply for future openings that match your skills and experience. We wish you the very best in your career.
      </p>
      <p style="font-size: 14px; color: #888; margin-top: 30px;">Best regards,<br><strong>ATS Recruitment Team</strong></p>
    </div>
  </div>
`;

const interviewEmailTemplate = (candidateName, jobTitle, date, time, message) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📅 Interview Invitation</h1>
    </div>
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #333;">Dear <strong>${candidateName}</strong>,</p>
      <p style="font-size: 15px; color: #555; line-height: 1.6;">
        We are excited to invite you for an interview for the <strong>${jobTitle}</strong> position.
      </p>
      <div style="background: #f0f4ff; border-radius: 10px; padding: 20px; margin: 20px 0;">
        <p style="margin: 5px 0; font-size: 15px; color: #333;"><strong>📅 Date:</strong> ${date}</p>
        <p style="margin: 5px 0; font-size: 15px; color: #333;"><strong>🕐 Time:</strong> ${time}</p>
      </div>
      ${message ? `
      <div style="background: #f8f9fa; border-left: 4px solid #4361ee; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #555; font-size: 14px;"><strong>Additional Information:</strong><br>${message}</p>
      </div>` : ''}
      <p style="font-size: 15px; color: #555; line-height: 1.6;">
        Please confirm your availability at the earliest. We look forward to meeting you!
      </p>
      <p style="font-size: 14px; color: #888; margin-top: 30px;">Best regards,<br><strong>ATS Recruitment Team</strong></p>
    </div>
  </div>
`;

const customEmailTemplate = (candidateName, messageBody) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Message from Recruitment</h1>
    </div>
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #333;">Dear <strong>${candidateName}</strong>,</p>
      <div style="font-size: 15px; color: #555; line-height: 1.6;">
        ${messageBody}
      </div>
      <p style="font-size: 14px; color: #888; margin-top: 30px;">Best regards,<br><strong>ATS Recruitment Team</strong></p>
    </div>
  </div>
`;

module.exports = {
  sendEmail,
  shortlistEmailTemplate,
  rejectionEmailTemplate,
  interviewEmailTemplate,
  customEmailTemplate
};
