
<div align="center">
  <img width="200" height="200"
    src="https://cdn3.iconfinder.com/data/icons/lexter-flat-colorfull-file-formats/56/raw-256.png">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>Raw Extend Loader</h1>
  <p>A loader for webpack that lets you import files as a string,
  <a href="https://github.com/webpack-contrib/raw-loader">raw-loader</a> enhanced.</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save-dev raw-extend-loader
```

<h2 align="center">Usage</h2>

Use the loader either via your webpack config, CLI or inline.

### Via webpack config (recommended)

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: [
          {
            loader: require.resolve('raw-extend-loader'),
            options: {
              dir: '/path/md', // Copy to the '/path/md' directory.
              filename: 'dir', // "underline | dir"
              sep: '___', // filename="underline", File name to the directory, using '___' interval, default value '__'.
            },
          },
        ],
      }
    ]
  }
}
```

### option

- `dir` Copy to the '/path/md' directory.
- `filename` Optional `underline | dir`, According to the directory to store, or do not create a directory.
- `sep` Set `filename="underline"`, File name to the directory, using `___` interval, default value `__`.

**In your application**
```js
import txt from './file.txt';
```

### CLI

```bash
webpack --module-bind 'txt=raw-extend-loader'
```

**In your application**
```js
import txt from 'file.txt';
```

### Inline

**In your application**
```js
import txt from 'raw-extend-loader!./file.txt';
```
