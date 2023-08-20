import { defineConfig } from "umi";
import path from "node:path";

export default defineConfig({
    npmClient: 'pnpm',
    // https://github.com/umijs/umi/issues/11501
    extraBabelPresets: [
        path.join(
            path.dirname(require.resolve('@emotion/babel-preset-css-prop/package.json')),
            'dist/emotion-babel-preset-css-prop.cjs.js'
        )
    ],
    chainWebpack(config) {
        config.module.rule("mjscfg")
            .test(/\.m?js/)
            .resolve.set("fullySpecified", false)
    },
    jsMinifier: 'swc'
});
