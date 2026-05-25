const config = {
  '**/*.{ts,tsx}': ['prettier --write', 'eslint --fix --cache'],
  '**/*.{js,jsx}': ['prettier --write', 'eslint --fix --cache'],
  '*.{json,css,scss,md,yml,yaml}': ['prettier --write'],
};

export default config;
