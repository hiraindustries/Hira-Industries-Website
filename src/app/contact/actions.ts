"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { ContactEnquiryActionState } from "@/lib/contact/enquiry-state";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database } from "@/lib/supabase/database.types";

const successMessage =
  "Thank you. Your enquiry has been submitted successfully. Our team will contact you shortly.";

const errorMessage =
  "Sorry, we could not submit your enquiry. Please try again or contact us on WhatsApp.";

const defaultNotificationTo = "hiraindustrieskhurja@gmail.com";
const defaultNotificationFrom =
  "Hira Industries Website <onboarding@resend.dev>";

type ContactEnquiryInsert =
  Database["public"]["Tables"]["contact_enquiries"]["Insert"];

type ContactNotificationPayload = ContactEnquiryInsert & {
  created_at: string;
};

function getString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getEnvValue(name: string) {
  return process.env[name]?.trim() || "";
}

function getNotificationRecipients() {
  return (
    getEnvValue("CONTACT_NOTIFICATION_TO") || defaultNotificationTo
  )
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function buildNotificationText(enquiry: ContactNotificationPayload) {
  const createdAt = formatCreatedAt(enquiry.created_at);

  return [
    `Full Name: ${enquiry.full_name}`,
    `Phone Number: ${enquiry.phone}`,
    `Email Address: ${enquiry.email || "Not provided"}`,
    `Enquiry Type: ${enquiry.enquiry_type}`,
    "",
    "Message:",
    enquiry.message,
    "",
    "Source: Website Contact Form",
    `Created: ${createdAt}`,
  ].join("\n");
}

function buildNotificationHtml(enquiry: ContactNotificationPayload) {
  const createdAt = formatCreatedAt(enquiry.created_at);
  const rows = [
    ["Full Name", enquiry.full_name],
    ["Phone Number", enquiry.phone],
    ["Email Address", enquiry.email || "Not provided"],
    ["Enquiry Type", enquiry.enquiry_type],
    ["Source", "Website Contact Form"],
    ["Created", createdAt],
  ];

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
      <h2>New Hira Industries website enquiry</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        <tbody>
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <td style="font-weight:700;border:1px solid #ddd">${escapeHtml(label)}</td>
                  <td style="border:1px solid #ddd">${escapeHtml(value)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
      <h3>Message</h3>
      <p style="white-space:pre-wrap">${escapeHtml(enquiry.message)}</p>
    </div>
  `;
}

async function sendNotificationEmail(enquiry: ContactNotificationPayload) {
  const apiKey = getEnvValue("RESEND_API_KEY");

  if (!apiKey) {
    return;
  }

  const to = getNotificationRecipients();

  if (to.length === 0) {
    console.warn(
      "[contact] RESEND_API_KEY is configured, but CONTACT_NOTIFICATION_TO is empty.",
    );
    return;
  }

  const from =
    getEnvValue("CONTACT_NOTIFICATION_FROM") || defaultNotificationFrom;
  const subject = `New enquiry from Hira Industries website - ${enquiry.enquiry_type}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text: buildNotificationText(enquiry),
      html: buildNotificationHtml(enquiry),
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(
      `Resend notification failed with ${response.status}: ${responseBody}`,
    );
  }
}

export async function submitContactEnquiryAction(
  _previousState: ContactEnquiryActionState,
  formData: FormData,
): Promise<ContactEnquiryActionState> {
  const fullName = getString(formData, "full_name");
  const phone = getString(formData, "phone");
  const email = getString(formData, "email");
  const enquiryType = getString(formData, "enquiry_type");
  const message = getString(formData, "message");

  if (!fullName || !phone || !enquiryType || !message) {
    return {
      status: "error",
      message: errorMessage,
      submissionId: _previousState.submissionId,
    };
  }

  if (email && !isValidEmail(email)) {
    return {
      status: "error",
      message: errorMessage,
      submissionId: _previousState.submissionId,
    };
  }

  try {
    const requestHeaders = await headers();
    const userAgent = requestHeaders.get("user-agent")?.trim() || null;
    const payload = {
      full_name: fullName,
      phone,
      email: email || null,
      enquiry_type: enquiryType,
      message,
      source: "website_contact_form",
      user_agent: userAgent,
    } satisfies ContactEnquiryInsert;
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("contact_enquiries")
      .insert(payload)
      .select("created_at")
      .single();

    if (error) {
      console.error("[contact] Could not save contact enquiry:", error);
      return {
        status: "error",
        message: errorMessage,
        submissionId: _previousState.submissionId,
      };
    }

    const createdAt = data?.created_at ?? new Date().toISOString();

    try {
      await sendNotificationEmail({
        ...payload,
        created_at: createdAt,
      });
    } catch (notificationError) {
      console.error(
        "[contact] Could not send contact enquiry notification:",
        notificationError,
      );
    }

    revalidatePath("/admin");
    revalidatePath("/admin/enquiries");

    return {
      status: "success",
      message: successMessage,
      submissionId: createdAt,
    };
  } catch (error) {
    console.error("[contact] Contact enquiry submission failed:", error);
    return {
      status: "error",
      message: errorMessage,
      submissionId: _previousState.submissionId,
    };
  }
}
