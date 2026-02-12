# Specification

## Summary
**Goal:** Increase the lesson video upload size limit from 10 MB to 100 MB across frontend and backend, with updated user-facing messaging.

**Planned changes:**
- Update frontend video validation logic to allow video files up to 100 MB and reject larger files with an error message that states the 100 MB limit.
- Update the frontend file-reading utility defaults to allow reading files up to 100 MB without requiring a custom max size parameter.
- Update all Upload Lesson page helper/validation text that references the old 10 MB limit to instead reference 100 MB.
- Update backend `createLesson` video size validation to accept videos up to 100 MB and reject larger files with an error message that states the 100 MB limit.

**User-visible outcome:** Users can upload lesson videos up to 100 MB on the Upload Lesson page, and both the UI text and backend validation consistently reflect the 100 MB limit.
