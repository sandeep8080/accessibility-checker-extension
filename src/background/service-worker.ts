import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  MappedViolation,
  AISuggestion,
  MessageAction,
  AIProvider,
} from "../types";

// In-memory cache fallback in case chrome.storage.session isn't available
const memoryCache = new Map<string, AISuggestion>();

async function getCachedSuggestion(
  cacheKey: string
): Promise<AISuggestion | null> {
  try {
    const result = await chrome.storage.session.get(cacheKey);
    return (
      (result[cacheKey] as AISuggestion) || memoryCache.get(cacheKey) || null
    );
  } catch {
    return memoryCache.get(cacheKey) || null;
  }
}

async function setCachedSuggestion(
  cacheKey: string,
  suggestion: AISuggestion
): Promise<void> {
  try {
    memoryCache.set(cacheKey, suggestion);
    await chrome.storage.session.set({ [cacheKey]: suggestion });
  } catch (e) {
    console.warn("Could not save to session storage, using memory cache", e);
  }
}

async function getApiKey(): Promise<{
  key: string;
  provider: AIProvider;
} | null> {
  const result = await chrome.storage.local.get(["apiKey", "aiProvider"]);
  return result.apiKey
    ? {
        key: result.apiKey as string,
        provider: (result.aiProvider as AIProvider) || "gemini",
      }
    : null;
}

// Generate suggestion using Google Gemini API
async function generateGeminiSuggestion(
  apiKey: string,
  violation: MappedViolation
): Promise<AISuggestion> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `You are an expert accessibility developer and WCAG 2.1 specialist.
Analyze the following accessibility violation and provide a structured JSON response.

Violation Details:
- Rule ID: ${violation.id}
- Impact/Severity: ${violation.severity}
- Description: ${violation.description}
- Help URL: ${violation.helpUrl}
- Affected HTML: ${violation.nodes[0]?.html || "N/A"}

Provide your response in raw JSON format WITHOUT markdown blocks, using EXACTLY this schema:
{
  "explanation": "Clear, concise explanation of why this fails WCAG and why it matters for users.",
  "codeSnippet": "A concrete HTML/React code example showing how to fix the issue. Use standard HTML/JSX.",
  "wcagReference": "E.g. WCAG 2.1 Success Criterion 1.1.1 Non-text Content"
}

Do not include any text before or after the JSON. Provide only the valid JSON object.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  console.log(responseText);
  try {
    // Strip markdown code blocks if the model wrapped the JSON
    const cleanJson = responseText
      .replace(/```json\s*/, "")
      .replace(/```\s*$/, "")
      .trim();
    return JSON.parse(cleanJson) as AISuggestion;
  } catch {
    console.error("Failed to parse Gemini response as JSON:", responseText);
    throw new Error("AI returned an invalid response format.");
  }
}

chrome.runtime.onMessage.addListener(
  (message: MessageAction, _sender, sendResponse) => {
    if (message.action === "GET_AI_SUGGESTION") {
      handleAISuggestion(message.payload.violation)
        .then((suggestion) => sendResponse({ success: true, data: suggestion }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );

      // Return true to indicate we'll respond asynchronously
      return true;
    }
  }
);

async function handleAISuggestion(
  violation: MappedViolation
): Promise<AISuggestion> {
  const nodeHtml = violation.nodes[0]?.html || "no-html";
  const cacheKey = `ai-sugg-${violation.id}-${btoa(nodeHtml).substring(0, 32)}`;

  // 1. Check cache
  const cached = await getCachedSuggestion(cacheKey);
  if (cached) return cached;

  // 2. Get API Key
  const credentials = await getApiKey();
  if (!credentials) {
    throw new Error(
      "API Key missing. Please configure your API key in the Settings tab."
    );
  }

  // 3. Call AI API
  let suggestion: AISuggestion;
  if (credentials.provider === "gemini") {
    suggestion = await generateGeminiSuggestion(credentials.key, violation);
  } else {
    throw new Error(`Provider ${credentials.provider} is not supported yet.`);
  }

  // 4. Cache and return
  await setCachedSuggestion(cacheKey, suggestion);
  return suggestion;
}

// Logic to listen for keyboard shortcut to run audit
chrome.commands.onCommand.addListener((command) => {
  if (command === "run-audit") {
    console.log("Keyboard shortcut triggered: Running accessibility audit");
  }
});
