# sitemap-static

Generate a sitemap for a static website based on files on disk.

This is a fork of [sitemap-static](https://github.com/tmcw/sitemap-static/) that
adds several features and removes certain existing functionality.

### install

`npm install --save @astronomersiva/sitemap-static`

### Usage

```javascript
let generateSitemap = require('sitemap-static');
let fs = require('fs');

let writer = fs.createWriteStream('/path/to/your/sitemap.xml');

generateSitemap(writer, {
  findRoot: '.',
  ignoreFiles: [/ ** An array of files to ignore in the sitemap */],
  prefix: 'https://www.sivasubramanyam.me/',
  pretty: false
})
```

### findRoot

The base directory whose contents you want a sitemap for.

### Ignore Files

An array of files and directories to ignore in the sitemap. Example,
```javascript
[
  'ignore-me.html',
  'ignore-everything-in-me/'
]
```

### Pretty URLs

If you pass `--pretty` to the CLI (or `pretty: true` to the JS API), `sitemap-static` will output pretty URLs rather than the whole path to each file. For example:

| Not pretty | Pretty |
| --- | --- |
| `http://www.example.com/index.html` | `http://www.example.com/` |
| `http://www.example.com/about.html` | `http://www.example.com/about` |
| `http://www.example.com/author/index.html` | `http://www.example.com/author` |
| `http://www.example.com/author/main.html` | `http://www.example.com/author/main` |
