# node-directory-tree-md 

[![Build Status](https://travis-ci.org/uiw-react/node-directory-tree-md.svg)](https://travis-ci.org/uiw-react/node-directory-tree-md)

> A variation of [node-directory-tree](https://github.com/mihneadb/node-directory-tree)

Creates a JavaScript object representing a directory tree.

## Install
```bash
$ npm i directory-tree-md
```

## Usage

Markdown directory is generated.

```js
const dirTree = require('node-directory-tree-md');
const tree = dirTree('/some/path', {
  mdconf: true, // Whether to return Markdown configuration.
  extensions: /\.md/,
});
```

Markdown configuration set by comments, support [yaml](http://www.yaml.org/).

```markdown
<!--
title: Layout 
heder: 😆😆😆😆
des: A detailed description
  header: 
    url: http://google.com
-->

Other Markdown content
```

`node-directory-tree-md` will return this JS object:

```json
{
  "path": "/some/path",
  "name": "doc",
  "children": [
    {
      "path": "/some/path/README.md",
      "name": "README.md",
      "relative": "/README.md",
      "mdconf": {
        "title": "Layout",
        "heder": "😆😆😆😆",
        "des": "A detailed description",
        "header": {
          "url": "http://google.com"
        }
      },
      "isEmpty": true, 
      "size": 23,
      "extension": ".md",
      "type": "file"
    },
    {
      "path": "/some/path/doc/layout.en.md",
      "name": "layout.en.md",
      "relative": "/doc/layout.en.md",
      "mdconf": {
        "title": "Layout"
      },
      "size": 285,
      "extension": ".md",
      "type": "file"
    }
  ],
  "size": 2607,
  "type": "directory"
}
```

And you can also filter by an extensions regex:
This is useful for including only certain types of files.

```js
const dirTree = require('node-directory-tree-md');
const filteredTree = dirTree('/some/path', {extensions:/\.txt/});
```

You can also exclude paths from the tree using a regex:

```js
const dirTree = require('node-directory-tree-md');
const filteredTree = dirTree('/some/path', {exclude:/some_path_to_exclude/});
```

A callback function can be executed with each file that matches the extensions provided:

```js
const PATH = require('path');
const dirTree = require('node-directory-tree-md');

const tree = dirTree('./test/test_data', {extensions:/\.txt$/}, (item, PATH) => {
	console.log(item);
});
```

The callback function takes the directory item (has path, name, size, and extension) and an instance of [node path](https://nodejs.org/api/path.html).

## Result
Given a directory structured like this:

```
photos
├── summer
│   └── june
│       └── windsurf.jpg
└── winter
    └── january
        ├── ski.png
        └── snowboard.jpg
```

`node-directory-tree-md` will return this JS object:

```json
{
  "path": "photos",
  "name": "photos",
  "size": 600,
  "type": "directory",
  "children": [
    {
      "path": "photos/summer",
      "name": "summer",
      "size": 400,
      "type": "directory",
      "children": [
        {
          "path": "photos/summer/june",
          "name": "june",
          "size": 400,
          "type": "directory",
          "children": [
            {
              "path": "photos/summer/june/windsurf.jpg",
              "name": "windsurf.jpg",
              "size": 400,
              "type": "file",
              "extension": ".jpg"
            }
          ]
        }
      ]
    },
    {
      "path": "photos/winter",
      "name": "winter",
      "size": 200,
      "type": "directory",
      "children": [
        {
          "path": "photos/winter/january",
          "name": "january",
          "size": 200,
          "type": "directory",
          "children": [
            {
              "path": "photos/winter/january/ski.png",
              "name": "ski.png",
              "size": 100,
              "type": "file",
              "extension": ".png"
            },
            {
              "path": "photos/winter/january/snowboard.jpg",
              "name": "snowboard.jpg",
              "size": 100,
              "type": "file",
              "extension": ".jpg"
            }
          ]
        }
      ]
    }
  ]
}
```
## Note
Device, FIFO and socket files are ignored.

Files to which the user does not have permissions are included in the directory
tree, however, directories to which the user does not have permissions, along
with all of its contained files, are completely ignored.

## Dev

To run tests go the package root in your CLI and run,

```bash
$ npm test
```

Make sure you have the dev dependencies installed (e.g. `npm install .`)

## Node version

This project requires at least Node v4.2.
Check out version `0.1.1` if you need support for older versions of Node.
