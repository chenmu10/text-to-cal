module.exports = {
  env: {
    browser: true,
    es2022: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    unicorn
  ],
  rules: {
    quotes: ['error', 'single'],
    "unicorn/better-regex": error,
    "unicorn/…": error
  },
}
