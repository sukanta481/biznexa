import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2/promise";
import { z } from "zod";

import { sendLeadNotificationEmail } from "@/lib/contact-mail";
import { query } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(100).optional().default(""),
  email: z.email().trim().max(100),
  message: z.string().trim().min(10).max(4000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fill in all required fields with valid details." },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    const result = await query<ResultSetHeader>(
      `INSERT INTO leads (name, email, phone, company, service_type, message, budget_range, source, status, priority)
       VALUES (?, ?, NULL, ?, NULL, ?, NULL, 'website', 'new', 'medium')`,
      [payload.name, payload.email, payload.company || null, payload.message],
    );

    const leadId = result.insertId;
    let emailSent = false;
    let emailWarning: string | null = null;

    try {
      const mailResult = await sendLeadNotificationEmail({
        id: leadId,
        name: payload.name,
        email: payload.email,
        company: payload.company || null,
        phone: null,
        serviceType: null,
        budgetRange: null,
        source: "website",
        message: payload.message,
      });

      emailSent = mailResult.sent;
      if (!mailResult.sent) {
        emailWarning = "Lead saved, but email notification is not configured yet.";
      }
    } catch (error) {
      console.error("Failed to send lead notification email", error);
      emailWarning = "Lead saved, but email delivery failed.";
    }

    return NextResponse.json(
      {
        ok: true,
        leadId,
        emailSent,
        emailWarning,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact form submission failed", error);
    return NextResponse.json(
      { error: "Unable to submit your message right now. Please try again shortly." },
      { status: 500 },
    );
  }
}
