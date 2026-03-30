# Accessibility Checker Chrome Extension 🛡️

A modern, AI-powered Chrome Extension designed to seamlessly audit webpages for WCAG 2.1 accessibility violations and provide immediate, intelligent code-level remediation suggestions.

This project was built to empower developers to create more accessible web experiences with zero friction, directly from their browser.

---

## 🚀 Features
- **One-Click Auditing:** Instantly scan any webpage for WCAG 2.1 AA violations.
- **Categorized Results:** Sorts issues into intuitive Severity groups (Errors, Warnings, Notices).
- **AI-Powered Code Fixes:** Leverages Google Gemini 2.0 to explain *why* an element fails and provides the exact React/HTML snippet to fix it.
- **Audit History:** Automatically saves your last 50 audits locally, with the ability to export them as raw JSON datasets.
- **BYOK (Bring Your Own Key):** Secure local storage integration to manage your own AI API keys.

---

## 🛠️ How to Run Locally

Because this project is built using modern tooling, hot-reloading works flawlessly out of the box—even for a Chrome Extension!

1. **Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   *(This starts Vite and creates a continuously updated \`dist/\` folder in your project root.)*

3. **Load the Extension into Chrome:**
   - Open Google Chrome and navigate to \`chrome://extensions/\`
   - Enable the **"Developer mode"** toggle (top right corner).
   - Click the **"Load unpacked"** button.
   - Select the \`dist\` directory located inside your project folder.
   
4. **Develop with HMR:**
   - Pin the extension to your toolbar.
   - Any changes you make to the React UI will instantly reflect in the popup—try changing a color in \`src/App.tsx\`!
   - *(Note: If you encounter Content Security Policy (CSP) errors in the console from \`localhost\`, just click the circular "Reload" icon on the extension's card in the \`chrome://extensions/\` page!)*

---

## 🧠 How the Project Works (Architecture)

A Chrome extension isn't a single website—it's essentially three separate environments communicating with each other:

1. **The Popup UI (\`src/popup/\` equivalent -> \`src/App.tsx\`)**
   This is the React Single Page Application that opens when you click the extension icon. It acts as the "Director". When opened, it queries the active Chrome Tab and sends a \`RUN_AUDIT\` message to the Content Script.
   
2. **The Content Script (\`src/content/content.ts\`)**
   This script is injected directly into the DOM of the website you are currently viewing. When it receives the \`RUN_AUDIT\` message, it fires up the \`axe-core\` engine to analyze the page's HTML structure. It packages the raw violations, maps them to simpler severity tiers, and sends them back to the Popup UI for display.

3. **The Background Service Worker (\`src/background/service-worker.ts\`)**
   The Service Worker operates silently in the background of the browser. We use this strictly as an **Environment securely separated from the DOM** to handle our AI API calls securely (preventing CORS issues and keeping API keys out of the target webpage's memory scope).

---

## 🤖 How the AI Fix Engine Works

When a user clicks "Get AI Fix" on a specific violation in the Popup UI:

1. **Proxy Request:** The Popup UI sends a \`GET_AI_SUGGESTION\` message (containing the violation details and raw HTML node) to the Background Service Worker.
2. **Key Retrieval:** The Service Worker pulls your encrypted API Key from \`chrome.storage.local\`.
3. **Session Caching:** To save latency and API costs, the Service Worker checks \`chrome.storage.session\` (which is wiped when Chrome closes) to see if we've already generated a fix for this exact violation + HTML combo.
4. **Prompt Engineering:** If no cache exists, the Service Worker connects to the \`@google/generative-ai\` SDK. It wraps the violation metadata into a strict prompt that demands a structured JSON response containing:
   - \`explanation\`: A human-readable breakdown of the WCAG failure.
   - \`codeSnippet\`: The proposed structural fix.
   - \`wcagReference\`: The exact rule standard.
5. **Return:** The Service Worker returns the AI payload to the Popup UI, where it is beautifully rendered.

---

## 📖 The \`manifest.json\` Explained

The \`public/manifest.json\` is the "blueprint" that Chrome reads to understand what your extension is allowed to do.

- **\`manifest_version: 3\`**: Google's modern, heavily-secured standard for extensions.
- **\`permissions\`**: 
  - \`activeTab\`: Allows us temporary access to the webpage to run the audit.
  - \`scripting\`: Required in MV3 to execute content scripts programmatically.
  - \`storage\`: Allows us to use `chrome.storage.local` (for API keys and History) and `chrome.storage.session` (for AI caching).
- **\`host_permissions\`**: \`<all_urls>\` ensures we can audit any webpage the user is on.
- **\`content_security_policy\`**: By default, MV3 heavily restricts where an extension can fetch data from. We specifically opened up \`connect-src\` to allow Vite's Hot Module Replacement (HMR) to talk to \`localhost\`, and to allow our Service Worker to securely contact the Google Gemini API endpoint (\`https://generativelanguage.googleapis.com\`).

---

## 📦 Why We Used These Specific Packages

| Package | Purpose | Why We Chose It |
| :--- | :--- | :--- |
| **Vite / React SPA** | Frontend Engine | React is the industry standard for complex interactive UIs. Vite provides near-instant compilation and a vastly superior developer experience compared to Webpack or CRA. |
| **@crxjs/vite-plugin** | Extension Bundler | Historically, building Chrome Extensions with React was a configuration nightmare. CRXJS acts as the bridge—parsing the \`manifest.json\` on the fly, enabling Vite's Hot Module Replacement *inside* an extension environment, and correctly outputting multiple entry points (Popup, Content, Background). |
| **axe-core** | Accessibility Engine | The absolute gold standard of automated accessibility testing. Maintained by Deque Systems, it is the exact same engine that powers Google Lighthouse and Microsoft Accessibility Insights. |
| **Tailwind CSS (v4)** | Styling | Allows for rapid prototyping of a premium, dark-mode-first aesthetic without writing bloated CSS files. V4 introduces lightning-fast engine compiling without needing a \`tailwind.config.js\` file. |
| **Lucide React** | Iconography | Lightweight, crisp, and neutral SVG icons that easily match modern interface design patterns. |
| **@google/generative-ai** | AI Integration | The official SDK to interact with Gemini 2.0 Flash. We chose Gemini Flash because it is incredibly fast (crucial for a snappy UI), accurate for code generation, and currently offers a generous free tier for developers. |
