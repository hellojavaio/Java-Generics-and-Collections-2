const PATH = require('path');
const FS = require('fs');
const write = require('write');

const markdownImageReferencesRE = /(!\[[^\]]*\]\((?!(?:https?:)?\/\/)[^)]+\))/g
const imagePathRE = /^(!\[[^\]]*\]\()((?!(?:https?:)?\/\/)[^)]+)(\))$/
const codeRE = /^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/gm
const imgTagReferencesRE = /<img.*?src="(.*?)"/g
const imgTagRE = /<img.*?src="(.*?)"/

// [link text](/path/to/img.jpg "Optional title")
//                 1            2       3         <--- captures
// This will capture up to the last paren in the block. We then pull
// var m = text.match(/^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/);

module.exports = class CopyMarkdownImageWebpackPlugin {
  constructor(options) {
    this.option = options || { dir: [], toDir: '' };
  }
  apply(compiler) {
    compiler.hooks.afterCompile.tapAsync(this.constructor.name, (compilation, callback) => {
      compilation.fileDependencies.forEach((filePath) => {
        if (/\.(md|markdown)$/.test(filePath) && this.option.toDir) {

          const isIndexOf = this.option.dir.some(item => filePath.indexOf(item) > -1)
          if (this.option.dir.some(item => filePath.indexOf(item) > -1)) {
            if (!FS.existsSync(filePath)) return;
            let content = FS.readFileSync(filePath).toString();
            // 替换代码高亮部分
            content = content.replace(codeRE, '');

            let imgPaths = content.match(markdownImageReferencesRE);
            if (imgPaths && imgPaths.length > 0) {
              // ![MDN web docs](./guides/canvas.jpg)
              // ![MDN web docs](../assets/canvas.jpg)
              imgPaths.forEach((imgPath) => {
                let [, mdImageStart, mdImagePath, mdImageEnd] = imagePathRE.exec(imgPath) || [];
                this.copyImageFile(mdImagePath);
              })
            }

            let imgTagPaths = content.match(imgTagReferencesRE);
            if (imgTagPaths && imgTagPaths.length > 0) {
              // <img alt="node" width="18" height="18" src="./assets/node-logo.svg"/>
              imgTagPaths.forEach((imgPath) => {
                let [, mdImagePath] = imgTagRE.exec(imgPath) || [];
                this.copyImageFile(mdImagePath);
              })
            }
          }
        }
      })
      callback()
    });
  }
  copyImageFile(mdImagePath) {
    if (!mdImagePath) return;
    mdImagePath = mdImagePath.replace(/^\.\.\//, '').replace(/^\.\//, '');
    const rootPath = this.option.dir.filter((fileRootPath) => {
      // 图片存在
      if (FS.existsSync(PATH.join(fileRootPath, mdImagePath))) {
        const imageData = FS.readFileSync(PATH.join(fileRootPath, mdImagePath))
        write.sync(PATH.join(this.option.toDir, mdImagePath), imageData)
      }
    })
  }
}
