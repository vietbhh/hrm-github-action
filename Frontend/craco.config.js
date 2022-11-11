const path = require("path")
const CracoLessPlugin = require("craco-less")
module.exports = {
  reactScriptsVersion: "react-scripts",
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true
          }
        },
        modifyLessRule(lessRule, context) {
          lessRule.use.forEach((element, index) => {
            if (element.options.hasOwnProperty("sassOptions")) {
              delete element.options.sassOptions
            }
          })
          return lessRule
        }
      }
    }
  ],
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: ["node_modules", "src/assets"]
        }
      }
    },
    postcss: {
      plugins: [require("postcss-rtl")()]
    }
  },
  webpack: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/@core/assets"),
      "@components": path.resolve(__dirname, "src/@core/components"),
      "@layouts": path.resolve(__dirname, "src/@core/layouts"),
      "@store": path.resolve(__dirname, "src/redux"),
      "@styles": path.resolve(__dirname, "src/@core/scss"),
      "@configs": path.resolve(__dirname, "src/configs"),
      "@utils": path.resolve(__dirname, "src/utility/Utils"),
      "@hooks": path.resolve(__dirname, "src/utility/hooks"),
      "@modules": path.resolve(__dirname, "src/@modules"),
      "@apps": path.resolve(__dirname, "src/@apps"),
      "@scss": path.resolve(__dirname, "src/assets/scss")
    }
  }
}
