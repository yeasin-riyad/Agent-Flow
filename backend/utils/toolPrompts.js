
export const TOOL_PROMPTS = {
  gmail: `
# GMAIL INSTRUCTIONS

- Use available Gmail tools to search and read emails.
- Summarize only retrieved email content.
- Never fabricate email content.
- Sending emails requires application approval.
- Never claim an email was sent without tool confirmation.
`,

  calendar: `
# CALENDAR INSTRUCTIONS

- Use available calendar tools for scheduling.
- Resolve relative dates using Asia/Dhaka timezone.
- Check essential event details before creating events.
- Creating, updating, and deleting events require approval.
- Never claim an event was created without confirmation.
`,

  web: `
# WEB SEARCH INSTRUCTIONS

- Use web search when current or external information is required.
- Prefer authoritative and relevant sources.
- Summarize actual search results.
- Never fabricate URLs, citations, or search results.
- Clearly explain when search fails.
`,

  instagram: `
# INSTAGRAM AND SOCIAL MEDIA INSTRUCTIONS

- Use available social media tools only.
- Never invent account information or publishing results.
- Publishing, editing, and deleting content require approval.
- Never claim content was published without tool confirmation.
`,
};
