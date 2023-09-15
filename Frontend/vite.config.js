import fs from "fs"
import * as path from "path"
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import rollupNodePolyFill from "rollup-plugin-node-polyfills"
import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill"

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  const startPort = process.env.VITE_PORT ?? 3000

  const config = {
    plugins: [react()],
    server: {
      https : true,
      port: startPort
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ["node_modules", "./src/assets"]
        }
      },
      postcss: {
        plugins: [require("postcss-rtl")()]
      }
    },
    resolve: {
      alias: [
        {
          find: /^~.+/,
          replacement: (val) => {
            return val.replace(/^~/, "")
          }
        },
        { find: "stream", replacement: "stream-browserify" },
        { find: "crypto", replacement: "crypto-browserify" },
        { find: "@src", replacement: path.resolve(__dirname, "src") },
        { find: "@store", replacement: path.resolve(__dirname, "src/redux") },
        {
          find: "@configs",
          replacement: path.resolve(__dirname, "src/configs")
        },
        {
          find: "url",
          replacement: "rollup-plugin-node-polyfills/polyfills/url"
        },
        {
          find: "@styles",
          replacement: path.resolve(__dirname, "src/@core/scss")
        },
        {
          find: "util",
          replacement: "rollup-plugin-node-polyfills/polyfills/util"
        },
        {
          find: "zlib",
          replacement: "rollup-plugin-node-polyfills/polyfills/zlib"
        },
        {
          find: "@utils",
          replacement: path.resolve(__dirname, "src/utility/Utils")
        },
        {
          find: "@hooks",
          replacement: path.resolve(__dirname, "src/utility/hooks")
        },
        {
          find: "@assets",
          replacement: path.resolve(__dirname, "src/@core/assets")
        },
        {
          find: "@layouts",
          replacement: path.resolve(__dirname, "src/@core/layouts")
        },
        {
          find: "assert",
          replacement: "rollup-plugin-node-polyfills/polyfills/assert"
        },
        {
          find: "buffer",
          replacement: "rollup-plugin-node-polyfills/polyfills/buffer-es6"
        },
        {
          find: "process",
          replacement: "rollup-plugin-node-polyfills/polyfills/process-es6"
        },
        {
          find: "@components",
          replacement: path.resolve(__dirname, "src/@core/components")
        },
        { find: "@", replacement: path.resolve(__dirname, "src") },
        {
          find: "@modules",
          replacement: path.resolve(__dirname, "src/@modules")
        },
        { find: "@core", replacement: path.resolve(__dirname, "src/@core") },
        { find: "@apps", replacement: path.resolve(__dirname, "src/@apps") },
        {
          find: "layouts",
          replacement: path.resolve(__dirname, "src/layouts")
        },
        {
          find: "utility",
          replacement: path.resolve(__dirname, "src/utility")
        },
        { find: "assets", replacement: path.resolve(__dirname, "src/assets") },
        {
          find: "@scss",
          replacement: path.resolve(__dirname, "src/assets/scss")
        }
      ]
    },
    esbuild: {
      loader: "jsx",
      include: /.\/src\/.*\.js?$/,
      exclude: [],
      jsx: "automatic"
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx"
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true
          }),
          {
            name: "load-js-files-as-jsx",
            setup(build) {
              build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
                loader: "jsx",
                contents: fs.readFileSync(args.path, "utf8")
              }))
            }
          }
        ]
      }
    },
    build: {
      assetsDir: "",
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
        output: {
          chunkFileNames: (file) => {
            const { facadeModuleId } = file
            if (
              facadeModuleId !== null &&
              facadeModuleId !== "" &&
              facadeModuleId.includes("/src/@modules/")
            ) {
              const isModule = facadeModuleId.split("/src/@modules/")
              if (isModule.length === 2) {
                const moduleData = isModule[1].split("/")
                if (
                  moduleData.length === 3 &&
                  moduleData[1] === "pages" &&
                  moduleData[2].includes(".js")
                ) {
                  return `@modules/${moduleData[0]}/pages/[name].js`
                }
              }
            }
            return "assets/js/[name]-[hash].js"
          },
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: ({ name }) => {
            if (/\.(gif|jpe?g|png|svg)$/.test(name ?? "")) {
              return "assets/images/[name]-[hash][extname]"
            }

            if (/\.css$/.test(name ?? "")) {
              return "assets/css/[name]-[hash][extname]"
            }

            // default value
            // ref: https://rollupjs.org/guide/en/#outputassetfilenames
            return "assets/other/[name]-[hash][extname]"
          }
        }
      }
    }
  }

  if (mode === "development") {
    config.define = {
      global: "globalThis"
    }
  }

  if (mode !== "development") {
    config.build.cssCodeSplit = false
    config.build.rollupOptions.input = ["index.html", "build_modules.js"]
  }

  return defineConfig(config)
}
