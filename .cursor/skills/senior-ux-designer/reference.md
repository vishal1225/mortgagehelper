# UX Design Reference — Detailed Patterns

## Form Design

### Field Layout
- One column for short forms (< 6 fields); two columns for longer forms when fields pair logically (e.g. first/last name)
- Group related fields with clear section headings
- Required vs optional: mark required with asterisk; avoid "optional" on every optional field

### Validation
- **Inline**: Validate on blur for format (email, phone); avoid validating on every keystroke
- **On submit**: Validate completeness and business rules; show summary of errors
- **Error placement**: Place errors near the field, not only at top of form
- **Error tone**: Neutral, actionable ("Enter a valid email" not "Invalid input")

### Multi-Step Forms
- Show progress (Step X of Y) and allow back navigation
- Persist data when moving between steps
- Consider saving draft for long forms
- Final step: summary + clear CTA ("Submit application")

## Navigation & IA

### Primary Navigation
- 5–9 top-level items max
- Use consistent labels; avoid jargon
- Active state should be obvious

### Breadcrumbs
- Use when users can be 3+ levels deep
- Make each segment clickable
- Current page: not a link, visually distinct

### Search
- Provide when there are 20+ items or when users know what they want
- Show recent/popular if helpful
- Handle no results with suggestions

## Feedback & States

### Loading
- Skeleton or spinner for content; avoid blank screens
- For actions: disable button, show loading indicator
- Perceived performance: show something within ~100ms

### Success
- Confirm what happened ("Application submitted")
- State next steps ("We'll contact you within 2 business days")
- Provide a clear next action if relevant

### Errors
- Explain what went wrong in plain language
- Suggest how to fix it
- For system errors: apologize, offer retry or support

## Accessibility Patterns

### Keyboard
- All interactive elements reachable via Tab
- Logical tab order (top-to-bottom, left-to-right)
- Focus visible (outline or ring)
- Escape closes modals; Enter submits primary action

### Screen Readers
- Use semantic HTML (button, nav, main, etc.)
- Associate labels with inputs (label + id, or aria-label)
- Use aria-live for dynamic content that should be announced

### Color & Contrast
- Text: 4.5:1 minimum (3:1 for large text)
- Don't rely on color alone for meaning (use icons, text)
- Test with color blindness simulators

## Responsive & Touch

### Breakpoints
- Mobile-first: design for 320px, scale up
- Touch targets: 44×44px minimum
- Avoid hover-only interactions on touch devices

### Forms on Mobile
- Use appropriate input types (tel, email, number)
- Consider native date pickers
- Avoid tiny dropdowns; use full-screen pickers if needed
