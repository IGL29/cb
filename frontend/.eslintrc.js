export default {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
    overrides: [
        {
            files: ['*.ts', '*.js']
        }

    ],
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
        },
        "import/resolver": {
            "typescript": {
                "alwaysTryTypes": true,
                "project": "./tsconfig.json",
            }
        }
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: "tsconfig.json"
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'no-var': 'warn',
        'prettier/prettier': 'error',
        "lines-between-class-members": "off",
        "@typescript-eslint/lines-between-class-members": ["off"],
        "no-underscore-dangle": "off",
        "import/no-unresolved": "error",
        "class-methods-use-this": "off",
        "import/prefer-default-export": "off",
        "no-restricted-globals": "off",
        "no-constructor-return": "off",
        "no-new": "off",
        "import/no-unresolved": "off",
        "no-param-reassign": "off",
        "no-plusplus": "off",
        "no-nested-ternary": "off",
        "func-names": "off",
        "no-restricted-syntax": "off",
        "prefer-promise-reject-errors": "off",
        "@typescript-eslint/no-throw-literal": "off"
    },
};
