import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listEbooksTool from "./tools/list-ebooks";
import getEbookTool from "./tools/get-ebook";
import updateAffiliateLinkTool from "./tools/update-affiliate-link";

// The OAuth issuer MUST be the direct Supabase host; the .lovable.cloud proxy
// fails RFC 8414 issuer discovery. VITE_SUPABASE_PROJECT_ID is inlined by Vite
// at build time. The fallback keeps the issuer well-formed during manifest
// extraction; the published build inlines the real ref.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "alevi-ai-mcp",
  title: "Alevi.ai MCP",
  version: "0.1.0",
  instructions:
    "Tools for the Alevi.ai e-book platform. Use `list_ebooks` to browse the signed-in user's e-books, `get_ebook` to fetch the full content of one, and `update_affiliate_link` to set the affiliate link on a published e-book.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listEbooksTool, getEbookTool, updateAffiliateLinkTool],
});
