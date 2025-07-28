import angularConfig from '@caniparadis/eslint-config/angular.js';

// On ajoute manuellement les options nécessaires pour le bon fonctionnement du parser
const adjustedConfig = angularConfig.map((config) => {
  return {
    ...config,
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...(config.languageOptions?.parserOptions ?? {}),
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname, // <- nécessaire
      },
    },
  };
});

export default adjustedConfig;
