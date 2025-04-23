const path = require("path");
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Read all html files on src and create a new HtmlWebpackPlugin
const htmlFiles = fs
  .readdirSync(path.resolve(__dirname, 'src'))
  .filter((file) => file.endsWith('.html'));

const htmlPlugins = htmlFiles.map((file) => {
  return new HtmlWebpackPlugin({
    template: `./src/${file}`,
    filename: file,
    chunks: [file.split('.')[0]],
  });
});

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    login: "./src/login.js",
    register: "./src/register.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: 'eval-source-map',
  devServer: {
    watchFiles: ['./src/index.html'], 
  },
  plugins: [
    ...htmlPlugins,
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};