import "server-only";

import nodemailer from "nodemailer";

import { COMPANY } from "@/lib/constants";

export interface LeadNotificationPayload {
  id: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  serviceType: string | null;
  budgetRange: string | null;
  source: string;
  message: string;
}

function getMailerConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
  };
}

export async function sendLeadNotificationEmail(payload: LeadNotificationPayload) {
  const config = getMailerConfig();

  if (!config) {
    return { sent: false as const, reason: "missing_smtp_config" as const };
  }

  const transporter = nodemailer.createTransport(config);
  const to = process.env.CONTACT_NOTIFICATION_EMAIL || COMPANY.email;
  const from = process.env.CONTACT_FROM_EMAIL || config.auth.user;
  const subject = `New Biznexa lead: ${payload.name}`;

  const text = [
    "A new lead was submitted from the Biznexa contact form.",
    "",
    `Lead ID: ${payload.id}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Company: ${payload.company || "N/A"}`,
    `Phone: ${payload.phone || "N/A"}`,
    `Service Type: ${payload.serviceType || "N/A"}`,
    `Budget Range: ${payload.budgetRange || "N/A"}`,
    `Source: ${payload.source}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 16px;">New Biznexa Lead</h2>
      <p>A new lead was submitted from the website contact form.</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
        <tbody>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Lead ID</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${payload.id}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${payload.name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${payload.email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Company</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${payload.company || "N/A"}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${payload.phone || "N/A"}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Service Type</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${payload.serviceType || "N/A"}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Budget Range</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${payload.budgetRange || "N/A"}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Source</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${payload.source}</td></tr>
        </tbody>
      </table>
      <div style="margin-top: 20px;">
        <strong>Message</strong>
        <p style="white-space: pre-wrap; padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb;">${payload.message}</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    replyTo: payload.email,
    subject,
    text,
    html,
  });

  return { sent: true as const };
}
