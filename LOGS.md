# Project Logs

## [2024-07-11]

- Installed dependencies: tailwindcss, postcss, autoprefixer, @headlessui/react, @heroicons/react, framer-motion, react-hook-form, zod, react-icons, swr, axios, jest, @testing-library/react, @testing-library/jest-dom, storybook, @storybook/react, next-auth, @stripe/stripe-js, @stripe/react-stripe-js.
- Ran `npx storybook init` (Storybook initialized, but encountered PostCSS config error).
- Ran `npx tailwindcss init -p` (failed due to npm executable issue, needs manual fix).
- Next: Fix Tailwind CSS config, update PostCSS config for Storybook compatibility, and begin landing page UI implementation.

- Manually created tailwind.config.js (CLI would not run on Windows).
- Updated app/globals.css to use Tailwind v4 @import syntax for preflight and utilities.
- CLI for Tailwind init still fails; workaround applied.

- Replaced app/page.js content with a new landing page UI scaffold: Hero, Features, and placeholders for Testimonials, Pricing, FAQ, and Contact sections.

- Error: PostCSS config using object format caused Tailwind v4/Next.js error.
- Fix: Updated postcss.config.mjs to use array format for plugins (tailwindcss, autoprefixer).

- Build error: Tailwind v4 requires @tailwindcss/postcss as the PostCSS plugin.
- Fix: Installed @tailwindcss/postcss and updated postcss.config.mjs to use it as the plugin.
