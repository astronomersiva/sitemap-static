const findit = require("findit");
const path = require("path");
const fs = require("fs");

const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

function indent(level) {
  let space = '  ';
  let str = '';

  for (let i = 0; i < level; i++) {
    str += space;
  }

  return str;
}

module.exports = function(stream, options) {
  const finder = findit(options.findRoot || '.');
  const prefix = options.prefix || '';
  const addTrailingSlash = options.addTrailingSlash || false;
  const ignore_files = options.ignoreFiles || [];
  const pretty = options.pretty || false;

  let ignore_folders = [];
  let ignore = [];

  stream.write(header);

  if (ignore_files) {
    ignore_folders = ignore_files
      .filter(name => path.extname(name) !== '.html')
      .map(name => new RegExp(`^${name}`));
  }

  // do not use this stat object for getting time info
  finder.on('file', function(file, /** stat */) {
    if (!file.includes('.html') || ignore.includes(file)) {
      return;
    }

    if (ignore_folders.find(folder => file.match(folder))) return;

    let filepath = path.relative(options.findRoot, file);

    if (pretty) {
      if (path.basename(filepath) === 'index.html') {
        let dir = path.dirname(filepath);
        filepath = dir === '.' ? '' : dir;
      } else {
        filepath = path.join(
          path.dirname(filepath),
          path.basename(filepath, '.html')
        );
      }

      if (filepath.length && !filepath.endsWith('/') && addTrailingSlash) {
        filepath = `${filepath}/`;
      }
    }

    let stat = fs.statSync(file);
    let mtime = stat && stat.mtime;
    let lastMod = mtime ? new Date(mtime).toISOString() : Date.now().toISOString();
    let loc = `${prefix}${filepath}`;
    let priority = 1;
    if (pretty) {
      if (loc === prefix) {
        priority = 1;
      } else {
        let subPaths = loc.replace(prefix, '').split('/').length;
        priority = priority - (0.2 * subPaths);
        priority = priority < 0 ? 0.1 : priority;
      }
    } else {
      let subPaths = loc.replace(prefix, '').split('/').length - 1;
      priority = priority - (0.2 * subPaths);
      priority = priority < 0 ? 0.1 : priority;
    }

    let entryItems = [
      `${indent(1)}<url>`,
      `${indent(2)}<loc>${loc}</loc>`,
      `${indent(2)}<lastmod>${lastMod}</lastmod>`,
      `${indent(2)}<priority>${priority.toFixed(2)}</priority>`,
      `${indent(1)}</url>`
    ];

    let entry = entryItems.join('\n');

    stream.write(`\n${entry}`);
  });

  finder.on('end', function() {
    stream.write('\n</urlset>\n');
    if (stream !== process.stdout) {
      stream.end();
    }
  });
};
