const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["babel-polyfill", path.join(__dirname, "src/index.ts")],
  output: {
    path: __dirname,
    filename: "index.bundle.js"
  },
  resolve: {
    extensions: [".js", ".ts"]
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader:"babel-loader",
            options: { presets: [ [ 'es2015', { modules: false } ] ] }
          },
         {
           loader: 'ts-loader'
         }
       ]

      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        dead_code: true,
        warnings: false
      }
    })
  ]
};
