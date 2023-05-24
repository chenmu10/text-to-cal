const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/popup.ts",
  devtool: false,
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "popup.js",
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "public", to: "." },
        // {
        //   from: "public/manifest.json", transform(content, path) {
        //   return content.toString().replace('GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID)
        // }}
      ],
    }),
    new CleanWebpackPlugin(),
  ],
};
