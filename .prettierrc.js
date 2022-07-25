module.exports = Object.assign(require('apteryx-prettier-config'), {
    printWidth: 120,
    overrides: [
        {
            files: '*.tsx',
            options: {
                tabWidth: 4,
            },
        },
    ],
});
