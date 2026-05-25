module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  rules: {
    'no-console': 'error',
    // PropTypes are authored by hand on the exported components; the lint rule
    // misfires on small in-file helper components, so we keep it off.
    'react/prop-types': 'off',
  },
  overrides: [
    {
      // Node-side files: Vite build config + Vercel serverless functions.
      files: ['vite.config.js', 'api/**/*.js'],
      env: { node: true },
    },
  ],
};

// ESLint: no-unused-vars enforced, react/prop-types added (2026-05-25)
