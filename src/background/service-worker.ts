import { GoogleGenerativeAI } from "@google/generative-ai";

import type {
  AIProvider,
  AISuggestion,
  MappedViolation,
  MessageAction,
} from "../types";
import type { AppSettings } from "../types/settings";
import { saveAuditResultToLocal, tabValidator } from "../utils";
import {
  ACTIONS,
  AI_CONFIG,
  ERROR_MESSAGES,
  STORAGE_KEY,
} from "../utils/constant";

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
  const result = await chrome.storage.local.get([STORAGE_KEY]);
  const { provider, apiKeys } = (result.appSettings as AppSettings).ai;
  return apiKeys[provider]
    ? {
        key: apiKeys[provider] as string,
        provider: (provider as AIProvider) || "gemini",
      }
    : null;
}

// Generate suggestion using Google Gemini API
async function generateGeminiSuggestion(
  apiKey: string,
  violation: MappedViolation
): Promise<AISuggestion> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: AI_CONFIG.GEMINI_MODEL });

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
    throw new Error(ERROR_MESSAGES.AI_INVALID_RESPONSE);
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
    throw new Error(ERROR_MESSAGES.API_KEY_MISSING);
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
chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "run-audit") {
    if (tabValidator(tab)) {
      // Setting the loading state to true
      await chrome.storage.local.set({ auditInProgress: true });
      console.log("Keyboard shortcut triggered: Running accessibility audit");
      const response = await chrome.tabs
        .sendMessage(tab?.id, { action: ACTIONS.RUN_AUDIT })
        .catch((e) => {
          console.error("Failed to send RUN_AUDIT message:", e);
        });

      console.log("Audit result from command run:", response);
      saveAuditResultToLocal(response);
    } else {
      await chrome.storage.local.set({
        auditError: ERROR_MESSAGES.AUDIT_TAB_INACCESSIBLE,
        auditInProgress: false,
      });
    }
  }
});
