// The path to the CesiumJS source code
const cesiumSource = "node_modules/cesium/Source";
const cesiumWorkers = "../Build/Cesium/Workers";
const CopywebpackPlugin = require("copy-webpack-plugin");

var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    //__dirname： 执行脚本所在的目录路径
    path: path.resolve(__dirname, "test_dist"),

    // Needed to compile multiline strings in Cesium
    // '' overrides the webpack default for adding a \t tab character before each line. CesiumJS has some multiline strings, so we need to override this default with an empty prefix ''.
    sourcePrefix: "",
  },
  amd: {
    // Enable webpack-friendly use of require in Cesium
    // true tells CesiumJS that the version of AMD webpack uses to evaluate require statements is not compliant with the standard toUrl function.
    toUrlUndefined: true,
  },
  node: {
    // Resolve node module use of fs
    // 'empty' resolves some third-party usage of the fs module, which is targeted for use in a Node environment rather than the browser.
    fs: "empty",

    Buffer: false,
    http: "empty",
    https: "empty",
    zlib: "empty",
  },
  resolve: {
    alias: {
      // CesiumJS module name
      //
      cesium: path.resolve(__dirname, cesiumSource),
    },
  },
  mode: "development",
  // Enable sourcemaps for debugging webpack's output.
  // devtool: "source-map",
  devtool: "eval",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"],
    mainFields: ["module", "main"],
  },

  module: {
    rules: [{
        test: /\.js$/,
        enforce: "pre",
        include: path.resolve(__dirname, cesiumSource),
        use: [{
          loader: "strip-pragma-loader",
          options: {
            pragmas: {
              debug: false,
            },
          },
        }, ],
      },
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
      },
      // {
      // 	test: /\.json$/,
      // 	loader: 'json-loader'
      // },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ["url-loader"],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      // { test: /\.js$/, enforce: "pre", loader: "source-map-loader" },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      // {
      //     // Remove pragmas
      //     test: /\.js$/,
      //     enforce: 'pre',
      //     include: path.resolve(__dirname, 'node_modules/cesium/Source'),
      //     sideEffects: false,
      //     use: [{
      //         loader: 'strip-pragma-loader',
      //         options: {
      //             pragmas: {
      //                 debug: false
      //             }
      //         }
      //     }]
      // }
    ],
  },
  // optimization: {
  //     usedExports: true
  // },
  plugins: [
    // new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    // This copies the Assets and Widgets directories, and the built web worker scripts.
    new CopywebpackPlugin([{
      from: path.join(cesiumSource, cesiumWorkers),
      to: "Workers",
    }, ]),
    new CopywebpackPlugin([{
      from: path.join(cesiumSource, "ThirdParty"),
      to: "ThirdParty",
    }, ]),
    new CopywebpackPlugin([{
      from: path.join(cesiumSource, "Assets"),
      to: "Assets",
    }, ]),
    new CopywebpackPlugin([{
      from: path.join(cesiumSource, "Widgets"),
      to: "Widgets",
    }, ]),
    // Define an environment variable that tells CesiumJS the base URL for loading static files using the webpack DefinePlugin.
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify(""),
    }),
  ],
};