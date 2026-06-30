"use client";

import { useActionState } from "react";
import { FiLock, FiLogIn, FiMail, FiShield } from "react-icons/fi";
import {
  loginAdminAction,
} from "@/app/admin/actions";
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
      {state.status === "success" ? (
        <p className="admin-notice admin-notice--success" role="status">
          {state.message}
        </p>
      ) : null}

      <button
        className="admin-button admin-button--primary admin-button--wide"
        type="submit"
        name="intent"
        value="login"
        disabled={isPending}
      >
        <FiLogIn aria-hidden="true" />
        {isPending ? "Signing in…" : "Sign in to dashboard"}
      </button>
      <button
        className="admin-button admin-button--ghost admin-button--wide"
        type="submit"
        name="intent"
        value="register"
        disabled={isPending}
      >
        <FiShield aria-hidden="true" />
        First-time approved admin setup
      </button>
      <small className="admin-login__hint">
        Setup only works for an email included in the server-side
        ADMIN_EMAILS whitelist.
      </small>
    </form>
  );
}
