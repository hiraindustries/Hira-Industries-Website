"use client";

import { useActionState } from "react";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import { submitContactEnquiryAction } from "@/app/contact/actions";
import { contactEnquiryInitialState } from "@/lib/contact/enquiry-state";
import { businessInfo } from "@/lib/site-data";

type ContactFormState = {
  fullName: string;
  phone: string;
  email: string;
  enquiryType: string;
  message: string;
};

type ContactFormProps = {
  requestedResource?: string;
};

const createInitialState = (requestedResource?: string): ContactFormState => ({
  fullName: "",
  phone: "",
  email: "",
  enquiryType: requestedResource ? "catalogue-request" : "",
  message: requestedResource
    ? `Hello Hira Industries,\nPlease share your ${requestedResource}.`
    : "",
});

export default function ContactForm({ requestedResource }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitContactEnquiryAction,
    contactEnquiryInitialState,
  );
  const initialForm = createInitialState(requestedResource);
  const formKey = `${requestedResource ?? "general-enquiry"}-${
    state.submissionId ?? "initial"
  }`;

  return (
    <form
      key={formKey}
      id="contact-form"
      className="contact-form-card"
      action={formAction}
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
            name="full_name"
            placeholder="Your full name"
            defaultValue={initialForm.fullName}
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
            defaultValue={initialForm.phone}
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
            defaultValue={initialForm.email}
            autoComplete="email"
          />
        </label>

        <label className="contact-field">
          <span>Enquiry Type *</span>
          <select
            name="enquiry_type"
            defaultValue={initialForm.enquiryType}
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
            defaultValue={initialForm.message}
            required
          />
        </label>
      </div>

      <div className="contact-form-actions">
        <button
          type="submit"
          className="contact-button contact-button--gold"
          disabled={isPending}
        >
          <FiSend aria-hidden="true" />
          {isPending ? "Submitting..." : "Submit Enquiry"}
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

      {state.message ? (
        <p
          className={`contact-form-status contact-form-status--${state.status}`}
          aria-live="polite"
          role={state.status === "error" ? "alert" : undefined}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
