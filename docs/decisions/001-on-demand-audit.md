# 001 - Audit trigger is on-demand, not auto-on-open

**Date:** 2026-04-18
**Status:** Accepted ✔

## Context

In the initial architecture decision the whole Run_Audit workflow was designed to run on the start of the extension. After working and testing find few issues & gaps:

- User open extension the scan will run immediately before the use can make changes or update settings
- Pollutes the audit history as scan run every time the extension opens creating many unwanted scans

## Decision

Instead of auto scan on open, will be moving to a on demand scan.

## Consequences

- User has much more control over what it wants to scan
- More cleaner audit history & other workflows
