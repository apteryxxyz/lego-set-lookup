const config = require('apteryx-eslint-config');

module.exports = Object.assign(config, {
    ignorePatterns: ['*.d.ts', '*.mjs'],
    rules: Object.assign(config.rules, {
        'func-names': 'off',
        '@typescript-eslint/no-invalid-void-type': 'off',
        'no-alert': 'off',
    }),
});
