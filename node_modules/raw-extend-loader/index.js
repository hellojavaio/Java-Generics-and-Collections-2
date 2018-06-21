/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Kenny Wang @jaywcjlove
*/

const loaderUtils = require('loader-utils');
const FS = require('fs');
const PATH = require('path');
const mkdirp = require('mkdirp');

module.exports = function (content) {
  const options = loaderUtils.getOptions(this) || {}
  const {
    dir,
    filename,
    sep = "dir"
  } = options;
  this.cacheable && this.cacheable();
  this.value = content;
  const cb = this.async();

  content = JSON.stringify(content).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

  if (!dir) {
    return cb(null, "module.exports = " + content);
  }

  Promise.resolve().then(() => {
    if (dir) {
      if (this.resourcePath.indexOf(dir) > -1) {
        return cb(null, "module.exports = " + content);
      }
      let filenameString = this.resourcePath.replace(this.context + PATH.sep, '');
      let writePath = PATH.resolve(process.cwd(), dir);
      if (filename && filename === 'underline') {
        const underlineFileName = this.resourcePath.replace(process.cwd() + PATH.sep, '').split(PATH.sep).join(sep || '__')
        writePath = PATH.resolve(writePath, underlineFileName);
      } else {
        writePath = PATH.join(writePath, this.resourcePath.replace(process.cwd() + PATH.sep, ''));
      }
      mkdirp(PATH.dirname(writePath), (err) => {
        FS.writeFile(writePath, content, (err) => {
          if (err) {
            this.emitError('\r\nWrite to directory failed: ' + err);
            return cb(err);
          }
          cb(null, "module.exports = " + content);
        })
      })
    } else {
      cb(null, "module.exports = " + content);
    }
  }).catch((err) => {
    return err ? cb(new SyntaxError(err)) : cb(err)
  })
}
module.exports.seperable = true;
