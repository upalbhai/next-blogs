import nodemailer from "nodemailer";
import { Subscription } from "../models/subscribtionModel.js";
import dotenv from "dotenv";

dotenv.config();
const { EMAILID, EMAIL_PASSWORD, SITE_URL } = process.env;

// Ensure environment variables are set
if (!EMAILID || !EMAIL_PASSWORD) {
  console.error("Missing email credentials. Please check your .env file.");
  process.exit(1);
}

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAILID,
    pass: EMAIL_PASSWORD,
  },
});


// Function to Notify Subscribers
export const notifySubscribers = async (blogPost) => {
  try {
    const subscribers = await Subscription.find({}, "email"); // Fetch only emails
    if (!subscribers.length) {
      console.log("No subscribers found.");
      return;
    }

    const emails = subscribers.map((sub) => sub.email);

    const mailOptions = {
      from: `"Blog Updates" <${EMAILID}>`,
      to: emails,
      subject: `New Blog Post: ${blogPost.title}`,
      html: `
        <h1>${blogPost.title}</h1>
        <p>${blogPost.content.substring(0, 100)}...</p>
        <a href="${SITE_URL || "your-site.com"}/blog/${blogPost._id}" style="display:inline-block;padding:10px 20px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">
          Read more
        </a>
      `,
    };

    // Send emails
    await transporter.sendMail(mailOptions);
    console.log(`Emails sent successfully to ${emails.length} subscribers!`);
  } catch (error) {
    console.error("Error sending emails:", error);
  }
};
