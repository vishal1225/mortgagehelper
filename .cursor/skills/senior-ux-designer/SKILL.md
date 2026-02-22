---
name: senior-ux-designer
description: Provides expert UX design guidance for the mortgage app. Reviews borrower flows (refinance, self-employed quiz), broker flows (onboarding, dashboard, leads), and payment/Stripe flows. Use when designing or reviewing mortgage app UIs, forms, or user experience.
---

# Senior UX Designer — Mortgage App

Apply senior UX design thinking to this mortgage application. Extends the base UX skill with financial-services and mortgage-domain considerations.

## Mortgage App Context

- **Borrower flows**: Refinance pathway, self-employed pathway, multi-step quiz forms
- **Broker flows**: Signup, login, onboarding, dashboard, lead management
- **Payments**: Stripe integration
- **Regions**: VIC, NSW

## Financial Services UX Priorities

1. **Trust and clarity**: Financial decisions are high-stakes. Avoid jargon; explain terms; show progress.
2. **Data sensitivity**: Forms collect PII and financial info. Clear purpose, secure-feeling UI, minimal fields.
3. **Commitment clarity**: Users must understand what they're submitting and what happens next.
4. **Error recovery**: Validation and errors should be specific and fixable without losing progress.

## Mortgage-Specific Checklist

When reviewing borrower or broker flows:

- [ ] **Pathway clarity**: Home page clearly distinguishes refinance vs self-employed vs broker
- [ ] **Form progress**: Multi-step forms show step X of Y and allow back/forward
- [ ] **Field labels**: Financial terms (e.g. deposit band, credit score band) have brief explanations
- [ ] **State selection**: VIC/NSW choice is obvious and accessible
- [ ] **Confirmation**: After submission, users see clear next steps and expectations
- [ ] **Broker onboarding**: Profile completion feels purposeful; optional vs required is clear

## Form UX (BorrowerQuizForm, Broker Onboarding)

- Group related fields; one logical concept per step
- Inline validation where helpful; summary validation before submit
- Preserve data on back/refresh where possible
- Loading and submit states are visible and understandable

## Additional Resources

- For general UX principles and review format, see the personal skill at `~/.cursor/skills/senior-ux-designer/`
- For detailed patterns, see [reference.md](reference.md)
- For example reviews tailored to this app, see [examples.md](examples.md)
