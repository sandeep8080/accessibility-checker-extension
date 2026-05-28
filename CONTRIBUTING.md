# Contributing to Accessibility Checker Extension

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Fork and clone the repo
2. `npm install`
3. `npm run dev`
4. Load `dist/` as an unpacked extension in `chrome://extensions/` (Developer mode)

## Making Changes

- Create a feature branch from `master`
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages (e.g., `feat: add score gauge`, `fix: handle empty audit`)
- Ensure `npm run lint` and `npm run format:check` pass
- Open a PR against `master`

## Project Structure

```
src/
├── background/       # Service worker (AI API calls, keyboard shortcut)
├── content/          # Content script (axe-core audit engine)
├── components/       # React UI components
├── context/          # React context providers
├── hooks/            # Custom hooks
├── types/            # TypeScript types
└── utils/            # Shared utilities and constants
```

## Reporting Issues

Please include:

- Steps to reproduce
- Expected vs actual behavior
- Browser version and OS
- Console errors (if any)

## Code Style

- TypeScript strict mode
- Prettier + ESLint (auto-enforced via Husky pre-commit hooks)
- Tailwind CSS v4 for styling
