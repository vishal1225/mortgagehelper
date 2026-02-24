"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { submitBorrowerLeadAction } from "@/app/borrower/actions";
import { trackEvent } from "@/lib/analytics";
import type { LeadSegment } from "@/lib/leads";

type BorrowerQuizFormProps = {
  segment: LeadSegment;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: "VIC" | "NSW" | "";
  creditScoreBand: "excellent" | "good" | "fair" | "poor" | "";
  depositBand: "gt20" | "10to20" | "lt10" | "";
  incomeStable: "yes" | "mostly" | "no" | "";
  businessYears: "3plus" | "2to3" | "1to2" | "lt1" | "";
  hasTwoYearsFinancials: "yes" | "no" | "";
  consent: boolean;
};

const INITIAL_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  state: "",
  creditScoreBand: "",
  depositBand: "",
  incomeStable: "",
  businessYears: "",
  hasTwoYearsFinancials: "",
  consent: false,
};

function toSegmentLabel(segment: LeadSegment) {
  return segment === "self_employed" ? "self-employed" : segment;
}

export function BorrowerQuizForm({ segment }: BorrowerQuizFormProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const totalSteps = 3;
  const storageKey = `borrower_quiz_${segment}`;
  const hasStartedRef = useRef(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      hasLoadedRef.current = true;
      return;
    }
    try {
      const parsed = JSON.parse(stored) as { step?: number; form?: FormState };
      if (parsed.form) {
        setForm({
          ...INITIAL_FORM,
          ...parsed.form,
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        });
      }
      if (parsed.step && parsed.step >= 1 && parsed.step <= totalSteps) {
        setStep(parsed.step);
      }
    } catch {
      // ignore storage parse errors
    }
    hasLoadedRef.current = true;
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasLoadedRef.current) return;
    const { firstName, lastName, email, phone, ...rest } = form;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ step, form: rest }),
    );
  }, [form, step, storageKey]);

  const canAdvance = useMemo(() => {
    if (step === 1) {
      return (
        form.firstName &&
        form.lastName &&
        form.email &&
        form.phone &&
        (form.state === "VIC" || form.state === "NSW")
      );
    }

    if (step === 2) {
      return Boolean(form.creditScoreBand && form.depositBand);
    }

    if (segment === "refinance") {
      return Boolean(form.incomeStable && form.consent);
    }

    return Boolean(form.businessYears && form.hasTwoYearsFinancials && form.consent);
  }, [form, segment, step]);

  return (
    <form
      action={submitBorrowerLeadAction}
      className="space-y-6"
      onSubmit={() => {
        trackEvent("borrower_quiz_complete", { segment });
        trackEvent("borrower_lead_submit", { segment });
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(storageKey);
        }
      }}
    >
      <div className="card-muted px-3 py-2 text-sm text-slate-700">
        {step === 1 && "Step 1 of 3: Contact details"}
        {step === 2 && "Step 2 of 3: Financial profile"}
        {step === 3 && `Step 3 of 3: ${toSegmentLabel(segment)} questions`}
      </div>

      {step === 1 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium">First name</span>
            <input
              className="input-field"
              value={form.firstName}
              onChange={(event) => setForm({ ...form, firstName: event.target.value })}
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium">Last name</span>
            <input
              className="input-field"
              value={form.lastName}
              onChange={(event) => setForm({ ...form, lastName: event.target.value })}
              required
            />
          </label>
          <label className="space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">Email</span>
            <input
              className="input-field"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium">Phone</span>
            <input
              className="input-field"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium">State</span>
            <select
              className="input-field"
              value={form.state}
              onChange={(event) =>
                setForm({ ...form, state: event.target.value as "VIC" | "NSW" | "" })
              }
              required
            >
              <option value="">Select state</option>
              <option value="VIC">VIC</option>
              <option value="NSW">NSW</option>
            </select>
          </label>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium">Credit profile</span>
            <select
              className="input-field"
              value={form.creditScoreBand}
              onChange={(event) =>
                setForm({
                  ...form,
                  creditScoreBand: event.target.value as FormState["creditScoreBand"],
                })
              }
              required
            >
              <option value="">Select option</option>
              <option value="excellent">Excellent (780+)</option>
              <option value="good">Good (700-779)</option>
              <option value="fair">Fair (620-699)</option>
              <option value="poor">Poor (&lt;620)</option>
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium">Deposit / equity level</span>
            <select
              className="input-field"
              value={form.depositBand}
              onChange={(event) =>
                setForm({
                  ...form,
                  depositBand: event.target.value as FormState["depositBand"],
                })
              }
              required
            >
              <option value="">Select option</option>
              <option value="gt20">20%+ available</option>
              <option value="10to20">10% to 20%</option>
              <option value="lt10">Less than 10%</option>
            </select>
          </label>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold capitalize">
            {toSegmentLabel(segment)} specific questions
          </h2>

          {segment === "refinance" ? (
            <label className="space-y-1 text-sm">
              <span className="font-medium">How stable is your income?</span>
              <select
                className="input-field"
                value={form.incomeStable}
                onChange={(event) =>
                  setForm({
                    ...form,
                    incomeStable: event.target.value as FormState["incomeStable"],
                  })
                }
                required
              >
                <option value="">Select option</option>
                <option value="yes">Stable</option>
                <option value="mostly">Mostly stable</option>
                <option value="no">Unstable</option>
              </select>
            </label>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Years self-employed</span>
                <select
                  className="input-field"
                  value={form.businessYears}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      businessYears: event.target.value as FormState["businessYears"],
                    })
                  }
                  required
                >
                  <option value="">Select option</option>
                  <option value="3plus">3+ years</option>
                  <option value="2to3">2 to 3 years</option>
                  <option value="1to2">1 to 2 years</option>
                  <option value="lt1">Less than 1 year</option>
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Two years financials ready?</span>
                <select
                  className="input-field"
                  value={form.hasTwoYearsFinancials}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      hasTwoYearsFinancials:
                        event.target.value as FormState["hasTwoYearsFinancials"],
                    })
                  }
                  required
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
            </div>
          )}

          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) => setForm({ ...form, consent: event.target.checked })}
              className="mt-1"
              aria-label="Consent to share details with a matching broker"
            />
            <span>
              I consent to share my details with one matching broker so they can contact me.
              See our{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="underline">
                Terms
              </Link>
              .
            </span>
          </label>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 1 ? (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setStep((prev) => prev - 1)}
          >
            Back
          </button>
        ) : null}

        {step < totalSteps ? (
          <button
            type="button"
            disabled={!canAdvance}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              if (!hasStartedRef.current && step === 1) {
                trackEvent("borrower_quiz_start", { segment });
                hasStartedRef.current = true;
              }
              setStep((prev) => prev + 1);
            }}
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canAdvance}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit quiz
          </button>
        )}
      </div>

      <input type="hidden" name="segment" value={segment} />
      <input type="hidden" name="first_name" value={form.firstName} />
      <input type="hidden" name="last_name" value={form.lastName} />
      <input type="hidden" name="email" value={form.email} />
      <input type="hidden" name="phone" value={form.phone} />
      <input type="hidden" name="state" value={form.state} />
      <input type="hidden" name="credit_score_band" value={form.creditScoreBand} />
      <input type="hidden" name="deposit_band" value={form.depositBand} />
      <input type="hidden" name="income_stable" value={form.incomeStable} />
      <input type="hidden" name="business_years" value={form.businessYears} />
      <input type="hidden" name="consent" value={form.consent ? "yes" : ""} />
      <input
        type="hidden"
        name="has_two_years_financials"
        value={form.hasTwoYearsFinancials}
      />
    </form>
  );
}
