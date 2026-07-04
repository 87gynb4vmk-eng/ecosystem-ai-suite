import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "update_affiliate_link",
  title: "Update affiliate link",
  description: "Set or clear the affiliate link on one of the signed-in user's e-books and publish it.",
  inputSchema: {
    id: z.string().uuid().describe("E-book UUID."),
    affiliate_link: z
      .string()
      .max(500)
      .describe("Full URL to the affiliate offer, or empty string to clear."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  handler: async ({ id, affiliate_link }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { error } = await supabaseForUser(ctx)
      .from("ebooks")
      .update({ affiliate_link: affiliate_link || null, is_published: true })
      .eq("id", id)
      .eq("usuario_id", ctx.getUserId());
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: "Affiliate link updated." }] };
  },
});
