const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "src", "index.tsx"),
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },
  devtool: "eval-source-map",
  devServer: {
    historyApiFallback: true,
    proxy: {
      "/graphql": {
        pathRewrite: function (path, req) {
          return "http://192.168.1.6:20002/graphql";
        },
        logLevel: "debug" /*optional*/,
      },
      "/graphql/realtime": {
        pathRewrite: function (path, req) {
          return "http://192.168.1.6:20002/graphql";
        },
        logLevel: "debug" /*optional*/,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-typescript",
              "@babel/preset-env",
              "@babel/preset-react",
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
              outputPath: "images",
              publicPath: "images",
              name: "[name].[ext]",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
    }),
  ],
};
