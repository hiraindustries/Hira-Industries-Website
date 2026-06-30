"use client";

import type { MouseEvent } from "react";

export default function ConfirmSubmitButton({
  children,
  message,
  className,
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
}) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  }

  return (
    <button
      type="submit"
      className={className}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
