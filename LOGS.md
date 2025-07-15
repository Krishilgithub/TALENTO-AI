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

## [2024-07-12] Technical Assessment Model Integration

- Error: `uvicorn : The term 'uvicorn' is not recognized as the name of a cmdlet, function, script file, or operable program.`

  - Solution: Installed uvicorn using `pip install uvicorn` and ensured the virtual environment was activated.

- Error: `ValueError: You must provide an api_key to work with featherless-ai API or log in with huggingface-cli login.`

  - Solution: Created a `.env` file with `HUGGINGFACEHUB_ACCESS_TOKEN` and ensured it was loaded in the correct directory.

- Error: `TypeError: list indices must be integers or slices, not str` and `TypeError: list indices must be integers or slices, not dict`

  - Solution: Refactored the code to safely handle both list and dict outputs from the model, iterating over items or values as appropriate.

- Error: `net::ERR_CONNECTION_REFUSED` in frontend console

  - Solution: Ensured the FastAPI server was running and accessible at the correct port. Fixed backend errors so the server would not crash.

- Error: `OUTPUT_PARSING_FAILURE` from LangChain

  - Solution: Made the prompt more explicit to require valid JSON output, and added error handling to log and return a user-friendly error if parsing failed.

- Error: FastAPI root URL (`/`) shows blank or error page

  - Solution: This is expected; used `/docs` endpoint to test API and confirmed backend was running.

- General: Restarted the FastAPI server after every code change to ensure changes took effect and errors were resolved.
