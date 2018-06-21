
Copy Markdown Image Webpack Plugin
---

Install the plugin via NPM:

```bash
npm i copy-markdown-image-webpack-plugin --save
```

**webpack.config.js**

```js
module.exports = {
  entry: './src/index.js',
  plugins: [
      new CopyMarkdownImageWebpackPlugin({
        dir: ['path/to/dir','path/to/dir2'],
        toDir: 'path/to/dist',
      }),
  ]
}
```