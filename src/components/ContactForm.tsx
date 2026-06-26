"use client";

import { FormEvent, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { businessInfo } from "@/lib/site-data";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ContactFormProps = {
  requestedResource?: string;
};

const createInitialState = (requestedResource?: string): ContactFormState => ({
  name: "",
  email: "",
  phone: "",
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
        : "Hira Industries enquiry",
    );
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Phone: ${form.phone}`,
        "",
        form.message,
      ].join("\n"),
    );

    setStatus("ready");
    window.location.href = `mailto:${businessInfo.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="field-grid">
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Phone</span>
          <input
            type="tel"
            name="phone"
            placeholder={businessInfo.phoneDisplay}
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </label>

        <label className="field">
          <span>Company</span>
          <input type="text" name="company" placeholder="Your company" />
        </label>
      </div>

      <label className="field field--textarea">
        <span>Message</span>
        <textarea
          name="message"
          rows={7}
          placeholder="Tell us what you are looking for..."
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          required
        />
      </label>

      <div className="submit-row">
        <button type="submit" className="site-button site-button--solid">
          Send Enquiry
          <FiArrowRight className="button-arrow" />
        </button>

        <div className="status-chip">
          {status === "ready"
            ? "Opening your email app now"
            : "No backend needed - this opens your email draft"}
        </div>
      </div>
    </form>
  );
}
