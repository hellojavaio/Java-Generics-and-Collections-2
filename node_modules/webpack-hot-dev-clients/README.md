webpack-hot-dev-clients
---

This alternative [WebpackDevServer](https://github.com/webpack/webpack-dev-server) combines the functionality of:

> 1. It only supports their simplest configuration (hot updates on same server).  
> 2. It makes some opinionated choices on top, like adding a syntax error overlay that looks similar to our console output.  

It currently supports only Webpack 3.x above.

```bash
npm i webpack-hot-dev-clients
```

Webpack development config

```diff
module.exports = {
  entry: [
    // You can replace the line below with these two lines if you prefer the
    // stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
+   require.resolve('webpack-hot-dev-clients/webpackHotDevClient'),
    "./src/index.js"
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
+    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hot Module Replacement'
    }),
+    new webpack.NamedModulesPlugin(),
+    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```