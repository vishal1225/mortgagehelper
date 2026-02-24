"use client";

import { trackEvent } from "@/lib/analytics";

type UnlockLeadButtonProps = {
  action: (formData: FormData) => void;
  leadId: string;
  segment: "refinance" | "self_employed";
  priceLabel: string;
  disabled?: boolean;
  label?: string;
  helperText?: string | null;
};

export function UnlockLeadButton({
  action,
  leadId,
  segment,
  priceLabel,
  disabled = false,
  label,
  helperText,
}: UnlockLeadButtonProps) {
  const buttonLabel = label ?? `Unlock lead (${priceLabel})`;

  return (
    <form
      action={action}
      className="pt-1"
      onSubmit={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        trackEvent("broker_unlock_start", { segment, lead_id: leadId });
      }}
    >
      <input type="hidden" name="lead_id" value={leadId} />
      <button
        type="submit"
        disabled={disabled}
        className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {buttonLabel}
      </button>
      {helperText ? (
        <p className="mt-2 text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </form>
  );
}
