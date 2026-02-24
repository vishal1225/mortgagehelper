import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type LogContext = Record<string, unknown>;

export async function logServerError(
  source: string,
  message: string,
  context: LogContext = {},
) {
  try {
    const supabase = createSupabaseAdminClient();
    await supabase.from("error_logs").insert({
      source,
      message,
      context,
    });
  } catch (error) {
    console.error("error_log_failed", {
      source,
      message,
      error: error instanceof Error ? error.message : String(error),
      context,
    });
  }
}
