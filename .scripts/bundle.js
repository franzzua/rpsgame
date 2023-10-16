import * as esbuild from 'esbuild';
import {getConfig} from "./config.js";
import {htmlPlugin} from "@craftamap/esbuild-plugin-html";

const context = await esbuild.context({
    entryPoints: ['./lib.ts'],
    bundle: true,
    outdir: 'dist',
    metafile: true,
    platform: 'node',
    tsconfig: 'tsconfig.json',
    format: "esm",
    external: ['@cmmn'],
    define: {
        localStorage: "{}"
    }
});

await context.watch();