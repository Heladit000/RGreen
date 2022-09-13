const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "@styles": path.resolve(__dirname, "src/style"),
      "@components": path.resolve(__dirname, "src/components"),
      "@config": path.resolve(__dirname, "config.js"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@images": path.resolve(__dirname, "src/images")
    },
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /(node_modules|bower_components)/,
        use: "babel-loader",
      },
      {
        test: /\.html$/i,
        use: "html-loader",
      },
      {
        test: /\.(png|jpg|svg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(s[ac]ss)$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash][ext][query]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "./styles/main.css",
    }),
  ],
};