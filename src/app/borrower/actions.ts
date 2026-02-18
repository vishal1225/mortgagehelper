"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculateReadinessScore } from "@/lib/readiness";
import { isLeadSegment, isLeadState, type LeadSegment } from "@/lib/leads";

function redirectWithMessage(path: string, message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

function getRequiredValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function getQuizPath(segment: LeadSegment) {
  return segment === "refinance" ? "/refinance/quiz" : "/self-employed/quiz";
}

export async function submitBorrowerLeadAction(formData: FormData) {
  const segmentRaw = getRequiredValue(formData, "segment");
  const firstName = getRequiredValue(formData, "first_name");
  const lastName = getRequiredValue(formData, "last_name");
  const email = getRequiredValue(formData, "email");
  const phone = getRequiredValue(formData, "phone");
  const state = getRequiredValue(formData, "state");
  const creditScoreBand = getRequiredValue(formData, "credit_score_band");
  const depositBand = getRequiredValue(formData, "deposit_band");
  const incomeStable = getRequiredValue(formData, "income_stable");
  const businessYears = getRequiredValue(formData, "business_years");
  const hasTwoYearsFinancials = getRequiredValue(formData, "has_two_years_financials");

  if (!isLeadSegment(segmentRaw)) {
    redirectWithMessage("/", "Invalid quiz segment.");
  }

  const segment = segmentRaw;
  const quizPath = getQuizPath(segment);

  if (!isLeadState(state)) {
    redirectWithMessage(quizPath, "Please select VIC or NSW.");
  }

  if (!firstName || !lastName || !email || !phone || !creditScoreBand || !depositBand) {
    redirectWithMessage(quizPath, "Please complete all required fields.");
  }

  if (segment === "refinance" && !incomeStable) {
    redirectWithMessage(quizPath, "Please answer all refinance questions.");
  }

  if (segment === "self_employed" && (!businessYears || !hasTwoYearsFinancials)) {
    redirectWithMessage(quizPath, "Please answer all self-employed questions.");
  }

  const readinessScore = calculateReadinessScore(segment, {
    creditScoreBand: creditScoreBand as "excellent" | "good" | "fair" | "poor",
    depositBand: depositBand as "gt20" | "10to20" | "lt10",
    incomeStable: incomeStable as "yes" | "mostly" | "no",
    businessYears: businessYears as "3plus" | "2to3" | "1to2" | "lt1",
    hasTwoYearsFinancials: hasTwoYearsFinancials as "yes" | "no",
  });

  const quizData =
    segment === "refinance"
      ? {
          credit_score_band: creditScoreBand,
          deposit_band: depositBand,
          income_stable: incomeStable,
        }
      : {
          credit_score_band: creditScoreBand,
          deposit_band: depositBand,
          business_years: businessYears,
          has_two_years_financials: hasTwoYearsFinancials,
        };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("leads").insert({
    segment,
    state,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    readiness_score: readinessScore,
    quiz_data: quizData,
    is_unlocked: false,
    locked_by_broker_id: null,
    lock_expires_at: null,
  });

  if (error) {
    redirectWithMessage(quizPath, "We could not submit your quiz. Please try again.");
  }

  redirect(
    `/confirmation?segment=${encodeURIComponent(segment)}&score=${encodeURIComponent(readinessScore)}`,
  );
}
