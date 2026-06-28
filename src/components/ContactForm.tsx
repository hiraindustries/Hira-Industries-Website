"use client";

import { FormEvent, useState } from "react";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import { businessInfo } from "@/lib/site-data";

type ContactFormState = {
  name: string;
  phone: string;
  email: string;
  enquiryType: string;
  message: string;
};

type ContactFormProps = {
  requestedResource?: string;
};

const createInitialState = (requestedResource?: string): ContactFormState => ({
  name: "",
  phone: "",
  email: "",
  enquiryType: requestedResource ? "catalogue-request" : "",
  message: requestedResource
    ? `Hello Hira Industries,\nPlease share your ${requestedResource}.`
    : "",
});

export default function ContactForm({ requestedResource }: ContactFormProps) {
  const [form, setForm] = useState<ContactFormState>(() =>
    createInitialState(requestedResource),
  );
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  const updateField = (key: keyof ContactFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent(
      requestedResource
        ? `Hira Industries ${requestedResource} request`
        : `Hira Industries ${form.enquiryType} enquiry`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        `Email: ${form.email || "Not provided"}`,
        `Enquiry type: ${form.enquiryType}`,
        "",
        form.message,
      ].join("\n"),
    );

    setStatus("ready");
    window.location.href = `mailto:${businessInfo.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form
      id="contact-form"
      className="contact-form-card"
      onSubmit={handleSubmit}
    >
      <div className="contact-form-card__heading">
        <h2>Send an Enquiry</h2>
        <p>Fill out the form below and we&apos;ll get back to you shortly.</p>
      </div>

      {requestedResource ? (
        <div className="contact-request-note">
          Selected request: <strong>{requestedResource}</strong>
        </div>
      ) : null}

      <div className="contact-form-grid">
        <label className="contact-field">
          <span>Full Name *</span>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            autoComplete="name"
            required
          />
        </label>

        <label className="contact-field">
          <span>Phone Number *</span>
          <input
            type="tel"
            name="phone"
            placeholder="Your phone number"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            autoComplete="tel"
            required
          />
        </label>

        <label className="contact-field">
          <span>Email Address</span>
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="contact-field">
          <span>Enquiry Type *</span>
          <select
            name="enquiryType"
            value={form.enquiryType}
            onChange={(event) =>
              updateField("enquiryType", event.target.value)
            }
            required
          >
            <option value="" disabled>
              Select enquiry type
            </option>
            <option value="product">Product Enquiry</option>
            <option value="bulk-order">Bulk Order</option>
            <option value="catalogue-request">Catalogue Request</option>
            <option value="samples">Sample Request</option>
            <option value="custom-oem">Custom / OEM Requirement</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="contact-field contact-field--message">
          <span>Message *</span>
          <textarea
            name="message"
            rows={7}
            placeholder="Tell us about your requirements..."
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            required
          />
        </label>
      </div>

      <div className="contact-form-actions">
        <button type="submit" className="contact-button contact-button--gold">
          <FiSend aria-hidden="true" />
          Submit Enquiry
        </button>
        <a
          href={businessInfo.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-button contact-button--whatsapp"
        >
          <FiMessageCircle aria-hidden="true" />
          WhatsApp Now
        </a>
      </div>

      <p className="contact-form-status" aria-live="polite">
        {status === "ready"
          ? "Opening your email app now."
          : "Submitting opens a prepared email draft."}
      </p>
    </form>
  );
}
