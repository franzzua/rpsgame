import * as esbuild from 'esbuild';
import {getConfig} from "./config.js";

const context = await esbuild.context(getConfig({
    prod: false,
    watch: true
}));

await context.watch();


let { host, port } = await context.serve({
    servedir: 'dist',
    port: process.env.PORT || 3208,
    host: '0.0.0.0',
    fallback: './dist/index.html'
});
console.log(`server is running on http://${host}:${port}`)