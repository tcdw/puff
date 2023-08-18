/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: [
        '@nexet/eslint-config-nexet',
        "@nexet/eslint-config-nexet/react", // 如果是 React 项目
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
    },
    settings: {
        "import/resolver": {
            alias: {
                map: [
                    ["@", "./src"],
                ],
                extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"]
            }
        }
    },
    "rules": {
        // https://stackoverflow.com/questions/73757885/unknown-property-xxx-found-in-emotion-next-js-react-app
        "react/no-unknown-property": ["error", {
            "ignore": ["css"]
        }]
    }
};
