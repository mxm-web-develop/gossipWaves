import { defineConfig, loadEnv, normalizePath } from 'vite';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'vite-plugin-commonjs';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import dts from 'vite-plugin-dts';
import version from 'vite-plugin-package-version';
import pkg from './package.json';
import copy from 'rollup-plugin-copy';
import fs from 'fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const require = createRequire(import.meta.url);

const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
const cMapsDir = normalizePath(path.join(pdfjsDistPath, 'cmaps'));
function shiftStaticFiles(directories: string[]) {
  return {
    name: 'shift-static-file',
    writeBundle() {
      directories.forEach((dir) => {
        const targetDir = path.resolve(__dirname, 'dist', dir);
        if (fs.existsSync(targetDir)) {
          fs.rmSync(targetDir, { recursive: true, force: true });
          console.log(`Deleted directory: ${targetDir}`);
        } else {
          console.warn(`Directory not found: ${targetDir}`);
        }
      });
    },
  };
}

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd());
  console.log(env);

  return defineConfig({
    base: './',
    publicDir: false,
    plugins: [
      
      resolve(),
      commonjs(),
      svgr(),
      react({
        jsxRuntime: 'automatic',
        jsxImportSource: 'react',
        babel: {
          plugins: ['babel-plugin-macros']
        }
      }),
      version(),
      dts({
        tsconfigPath: './tsconfig.app.json',
        insertTypesEntry: true,
        copyDtsFiles: true,
        include: ['src/application/**/*.ts'], // 仅包含 application 目录
      }),
      generatePackageJson({
        outputFolder: 'dist',
        baseContents: {
          name: env.VITE_PUBLISH_NAME || pkg.name,
          main: 'index.js',
          license: 'MIT',
          // @ts-expect-error 这里是因为样式文件可能没有类型定义
          style: 'assets/style.css',
          types: 'index.d.ts',
          private: false,
          version: pkg.version,
          author: pkg.author,
          type: 'module',
          scripts: {
            test: 'yarn link',
            disconnect: 'yarn unlink',
          },
          exports: {
            ".": {
              "import": "./index.js",
              "types": "./index.d.ts"
            },
            "./style.css": "./assets/style.css"
          },
          files: ["index.js", "index.d.ts", "assets"]
        },
      }),
      copy({
        targets: [
          { src: 'NPMREADME.md', dest: 'dist', rename: 'README.md' },
          // { src: 'index.d.ts', dest: 'dist', rename: 'index.d.ts' },
          { src: cMapsDir, dest: 'dist/assets' }
        ],
        hook: 'writeBundle',
      }),
      shiftStaticFiles(['files']),
      {
        name: 'replace-browser-externals',
        transform(code, id) {
          if (!/\.(js|ts|jsx|tsx)$/.test(id)) return null;
          
          if (code.includes('__vite-browser-external')) {
            return code.replace(
              /await\s+import\(\s*['"]\.\/\__vite-browser-external[^'"]+['"]\s*\)/g,
              '({ default: typeof window !== "undefined" ? window : {} })'
            );
          }
          return null;
        }
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    esbuild: {
      charset: 'ascii',
    },
    // assetsInclude: ['**/*.mjs'], // 确保 Vite 能识别 .mjs 文件为资源
    build: {
      outDir: 'dist',
      lib: {
        entry: path.resolve(__dirname, 'src/application/lib_enter.ts'),
        name: 'fileviewer',
        formats: ['es'], // 只使用ES模块格式
        fileName: () => 'index.js'
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        input: {
          main: path.resolve(__dirname, 'src/application/lib_enter.ts'),
        },
        output: {
          dir: 'dist', // 确保输出在 dist 根目录
          entryFileNames: `index.js`,
          assetFileNames: `assets/[name].[ext]`,
          globals: {
            react: 'React',
            // 'react-dom': 'ReactDOM',
          },
        },
        treeshake: true, // 启用 tree-shaking，减少无用代码
        
      },
      
    },

    // server: {
    //   cors: true,
    //   host: '0.0.0.0',
    //   port: 8888,
    //   proxy: {
    //     '/local': {
    //       target: 'http://172.17.163.107:8888',
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/local/, ''),
    //     },
    //     '/api': {
    //       target: 'https://www.pdf995.com',
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, ''),
    //     },
    //   },
    // },
  });
};
