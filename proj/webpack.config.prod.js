const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = [{
  mode: "production",
  context: __dirname,
  entry: {
    app: "./src/index.tsx",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  node: {
    // Resolve node module use of fs
    fs: "empty",
    Buffer: false,
    http: "empty",
    https: "empty",
    zlib: "empty",
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    mainFields: ["module", "main"],
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
          },
        ],
        sideEffects: true,
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ["url-loader"],
      },
      {
        // Remove pragmas
        test: /\.js$/,
        enforce: "pre",
        include: path.resolve(__dirname, "node_modules/cesium/Source"),
        sideEffects: false,
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
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  optimization: {
    usedExports: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopyWebpackPlugin([{
      from: "node_modules/cesium/Build/Cesium/Workers",
      to: "Workers",
    }, ]),
    new CopyWebpackPlugin([{
      from: "node_modules/cesium/Build/Cesium/ThirdParty",
      to: "ThirdParty",
    }, ]),
    new CopyWebpackPlugin([{
      from: "node_modules/cesium/Build/Cesium/Assets",
      to: "Assets",
    }, ]),
    new CopyWebpackPlugin([{
      from: "node_modules/cesium/Build/Cesium/Widgets",
      to: "Widgets",
    }, ]),
    new CopyWebpackPlugin([{
      from: "src/data",
      to: "Assets/CustomModel",
    }, ]),
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify(""),
    }),
  ],
}, ];