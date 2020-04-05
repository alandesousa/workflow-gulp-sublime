const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const copiar = [
  {from: './src/assets/img/', to: './assets/img'},
  {from: './src/assets/fonts/', to: './assets/fonts'},
  {from: './src/favicon.png', to: './'},
];

const commonconfig = {
  entry: {
    app: "./src/assets/js/index.js",
  },
  output: {
    filename: "./assets/js/[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        // test: /\.s[ac]ss$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              // modules: true,
              // sourceMap: true
            },
          },
          {
            loader: "stylus-loader",
            // loader: 'sass-loader'
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.pug$/,
        loader: "pug-loader",
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "file-loader",
        options: {
          name: "./assets/img/[name].[ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              limit: 5000,
              name: "./assets/fonts/[name].[ext]",
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "test pug",
      template: "./src/pug/index.pug",
      // template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: "./assets/css/styles.css",
    }),
    new CopyPlugin(copiar),
  ],
};

const production = () => {
    commonconfig.plugins.push(new PurgecssPlugin({
      paths: glob.sync(path.join(__dirname, "src/pug/*.pug")),
    })),
    commonconfig.plugins.push(new TerserPlugin()),
    commonconfig.plugins.push(new OptimizeCSSAssetsPlugin())
};

const development = () => {
  commonconfig.devServer = {
    contentBase: "./dist",
    port: 3000,
    compress: true,
    // hot: true
  };
};

module.exports = (env, options) => {
  if (options.mode === 'production') {
    production();
  }
  if (options.mode === 'development') {
    commonconfig.devtool = "inline-source-map";
    development();
  }
  return commonconfig;
}