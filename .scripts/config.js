import * as esbuild from 'esbuild';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';

export const getConfig = ({prod, watch}) => ({
    entryPoints: ['index.tsx', 'global.css'],
    bundle: true,
    minify: !!prod,
    sourcemap: !prod,
    target: ['chrome88', 'safari14', 'firefox88'],
    outdir: 'dist',
    metafile: true,
    treeShaking: prod,
    tsconfig: 'tsconfig.json',
    jsx: 'automatic',
    plugins: [
        htmlPlugin({
            files: [{
                entryPoints: ['index.tsx', 'global.css'],
                filename: 'index.html',
                extraScripts: watch ? [
                    `data:text/javascript,new EventSource('/esbuild').addEventListener('change', () => location.reload())`
                ] : []
            }]
        })
    ],
});