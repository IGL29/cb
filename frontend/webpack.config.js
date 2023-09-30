const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, `environments/.env.${process.env.NODE_ENV}`)
});

const {
  NODE_ENV = 'production',
  BUNDLE_ANALIZER,
  API_MAP_KEY,
  API_URL = 'localhost',
  API_PORT = 5000,
  API_PROTOCOL_REST = 'http',
  API_PROTOCOL_WS = 'ws',
  IS_DOCKER,
  PORT = 3000
} = process.env;

const IS_PROD = NODE_ENV === 'production';
const IS_DEV = !IS_PROD;

const setupDevTool = () => (IS_DEV ? 'source-map' : false);
const setupBundleAnalyzer = () => (BUNDLE_ANALIZER === 'on' ? 'server' : 'disabled');
const setupMiniCssPlugin = () => (IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader');
const setupWatchOptionPool = () => !!IS_DOCKER;

module.exports = {
  mode: NODE_ENV,
  entry: {
    main: 'src/scripts/index.ts'
  },
  output: {
    filename: '[name].[fullhash].js',
    chunkFilename: '[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },

  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: [setupMiniCssPlugin(), 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'assets'
      },
      {
        test: /\.m?(t|j)s$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(API_URL),
      API_PROTOCOL_REST: JSON.stringify(API_PROTOCOL_REST),
      API_PROTOCOL_WS: JSON.stringify(API_PROTOCOL_WS),
      API_PORT: JSON.stringify(API_PORT),
      NODE_ENV: JSON.stringify(NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      favicon: path.resolve(__dirname, 'src/assets/favicon.png'),
      template: path.resolve(__dirname, 'src/index.html'),
      minify: {
        collapseWhitespace: IS_PROD
      },
      chunks: ['main']
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),

    new ESLintPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: setupBundleAnalyzer()
    })
  ],

  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimize: IS_PROD,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify
      }),
      new CssMinimizerPlugin(),
      new ImageMinimizerWebpackPlugin({
        minimizer: {
          implementation: ImageMinimizerWebpackPlugin.imageminMinify,
          options: {
            plugins: [
              ['optipng', { optimizationLevel: 5 }],
              [
                'svgo',
                {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }]
                            }
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            ]
          }
        }
      })
    ]
  },

  externalsType: 'script',
  externals: {
    ymaps: [`https://api-maps.yandex.ru/2.1/?apikey=${API_MAP_KEY}&lang=ru_RU`, 'ymaps']
  },

  devServer: {
    watchFiles: [path.join(__dirname, 'src'), path.join(__dirname, 'public')],
    compress: true,
    port: PORT,
    open: true,
    liveReload: true,
    client: {
      progress: true
    },
    historyApiFallback: {
      rewrites: [{ from: /./, to: '/index.html' }]
    }
  },
  watchOptions: {
    poll: setupWatchOptionPool()
  },
  devtool: setupDevTool(),
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    plugins: [new TsconfigPathsPlugin({ configFile: 'tsconfig.json' })]
  }
};
