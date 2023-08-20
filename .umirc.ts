import { defineConfig } from "umi";
import path from "node:path";

export default defineConfig({
    npmClient: 'pnpm',
    chainWebpack(config) {
        config.module.rule("mjscfg")
            .test(/\.m?js/)
            .resolve.set("fullySpecified", false)
        config.module.rule("compile")
            .test(/\.txt/)
            .type("asset/source")
    },
    jsMinifier: 'swc'
});
