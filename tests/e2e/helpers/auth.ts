import type { BrowserContext, Page } from "@playwright/test";

/**
 * Restores the Supabase session that Lovable injects into the sandbox env.
 * Returns `true` when a session was applied, `false` when the sandbox has no
 * session (LOVABLE_BROWSER_AUTH_STATUS !== "injected"). Callers should skip
 * authenticated scenarios when this returns false.
 */
export async function restoreSupabaseSession(
  context: BrowserContext,
  page: Page,
  origin = "http://localhost:8080",
): Promise<boolean> {
  const status = process.env.LOVABLE_BROWSER_AUTH_STATUS;
  const storageKey = process.env.LOVABLE_BROWSER_SUPABASE_STORAGE_KEY;
  const sessionJson = process.env.LOVABLE_BROWSER_SUPABASE_SESSION_JSON;
  const cookiesJson = process.env.LOVABLE_BROWSER_SUPABASE_COOKIES_JSON;

  if (status !== "injected" || !storageKey || !sessionJson) return false;

  if (cookiesJson) {
    try {
      const cookies = JSON.parse(cookiesJson).map((c: Record<string, unknown>) => ({
        ...c,
        url: origin,
      }));
      await context.addCookies(cookies);
    } catch {
      // ignore malformed cookies; localStorage path is usually enough
    }
  }

  await page.goto(origin);
  await page.evaluate(
    ([key, value]) => window.localStorage.setItem(key, value),
    [storageKey, sessionJson] as const,
  );
  return true;
}

/** Clears the Supabase session in the running tab to simulate expiration. */
export async function clearSupabaseSession(page: Page): Promise<void> {
  const storageKey = process.env.LOVABLE_BROWSER_SUPABASE_STORAGE_KEY;
  await page.evaluate((key) => {
    if (key) window.localStorage.removeItem(key);
    // Belt & suspenders: purge every Supabase auth key.
    for (const k of Object.keys(window.localStorage)) {
      if (k.startsWith("sb-") && k.endsWith("-auth-token")) {
        window.localStorage.removeItem(k);
      }
    }
  }, storageKey ?? "");
}
