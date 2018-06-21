
Create Spare Webpack Plugin
---

Install the plugin via NPM:

```bash
npm i create-spare-webpack-plugin --save
```

**webpack.config.js**

```js
module.exports = {
  entry: './src/index.js',
  plugins: [
    new CreateSpareWebpackPlugin({
      // 备用文件目录，比对是否存在，不存在生成，根据sep 目录规则生成
      path: PATH.join(cachePath, './md'),
      sep: '___', // 检查目标目录文件，文件名存储，文件夹+下划线间隔+文件名
      directoryTrees: { // 索引目录
        dir: cmd.markdownDirs,
        mdconf: true,
        extensions: /\.md$/,
      },
    }),
  ]
}
```