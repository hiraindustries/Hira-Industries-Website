"use client";

import { useActionState } from "react";
import { FiLock, FiLogIn, FiMail } from "react-icons/fi";
import { loginAdminAction } from "@/app/admin/actions";
import { initialAdminActionState } from "@/lib/admin/action-state";

export default function LoginForm() {
  const [state, action, isPending] = useActionState(
    loginAdminAction,
    initialAdminActionState,
  );

  return (
    <form action={action} className="admin-login__form">
      <label className="admin-field">
        <span>Email address</span>
        <span className="admin-input-wrap">
          <FiMail aria-hidden="true" />
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="admin@hiraindustries.com"
          />
        </span>
      </label>

      <label className="admin-field">
        <span>Password</span>
        <span className="admin-input-wrap">
          <FiLock aria-hidden="true" />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="Your password"
          />
        </span>
      </label>

      {state.status === "error" ? (
        <p className="admin-notice admin-notice--error" role="alert">
          {state.message}
        </p>
      ) : null}
      <button
        className="admin-button admin-button--primary admin-button--wide"
        type="submit"
        disabled={isPending}
      >
        <FiLogIn aria-hidden="true" />
        {isPending ? "Signing in…" : "Sign in to dashboard"}
      </button>
    </form>
  );
}
