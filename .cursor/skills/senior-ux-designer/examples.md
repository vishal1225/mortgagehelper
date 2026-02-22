# UX Review Examples — Mortgage App

## Example 1: BorrowerQuizForm (Multi-Step)

**Context**: Borrower lead capture form with 3 steps.

**Critical**
- **Missing focus management**: After advancing to step 2, focus remains on the "Next" button. Screen reader users may not know new content loaded. **Fix**: Use `aria-live="polite"` on the step content container, or programmatically focus the first field of the new step.

**Important**
- **Vague progress indicator**: "Step 2 of 3" doesn't indicate what step 2 is. **Fix**: Add step labels, e.g. "Step 2 of 3: Financial details".
- **No back confirmation**: If user clicks back after entering step 3 data, changes may be lost without warning. **Fix**: Persist form state across steps, or confirm before navigating back.

**Enhancement**
- **Credit score band**: "excellent | good | fair | poor" may be unclear. **Fix**: Add tooltip or helper text with rough score ranges (e.g. "Good: 670–739").

---

## Example 2: Home Page Pathway Selection

**Context**: Landing page with refinance, self-employed, and broker pathway buttons.

**Important**
- **Equal visual weight**: All three buttons look identical, but "Broker portal" serves a different user type. **Fix**: Visually distinguish broker entry (e.g. secondary style, or separate section) so borrowers don't accidentally click it.
- **No context for choice**: Users may not know which pathway applies. **Fix**: Add one-line descriptions under each option ("Refinancing your home loan", "Self-employed or business owner", "Broker login").

**Enhancement**
- **Mobile layout**: Buttons stack; on narrow screens consider card layout with icons for quicker scanning.

---

## Example 3: Error State Feedback

**Context**: Form submission fails (e.g. network error).

**Critical**
- **Generic error**: "Something went wrong" with no recovery path. **Fix**: "We couldn't submit your application. Please check your connection and try again." Include a retry button. Preserve form data.

**Important**
- **Error placement**: Error only in toast that disappears. **Fix**: Show persistent error near the submit button; keep form data; allow user to fix and resubmit.

---

## Example 4: Confirmation Page

**Context**: Post-submission confirmation screen.

**Important**
- **Unclear next steps**: "Thank you for submitting" with no timeline. **Fix**: "We've received your application. A broker will contact you within 2 business days. Check your email for a confirmation."
- **No reference**: User has nothing to save or quote. **Fix**: Provide reference number or confirmation email with details.

**Enhancement**
- **Dead end**: No way to return home or start another application. **Fix**: Add "Return to home" or "Start another application" link.
