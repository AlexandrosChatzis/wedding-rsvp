const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const { DefinePlugin, ProvidePlugin } = require("webpack");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

module.exports = {
  entry: {
    main: "./src/js/index.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
    assetModuleFilename: "assets/img/[name][ext][query]", // without this assets used in js/css will go to main dir
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: "asset",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      alwaysWriteToDisk: true,
      template: "src/index.html",
    }),
    new HtmlWebpackHarddiskPlugin(),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "assets"),
          to: "./assets",
        },
      ],
    }),
    new DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    new ProvidePlugin({
      process: "process/browser",
    }),
  ],
};
