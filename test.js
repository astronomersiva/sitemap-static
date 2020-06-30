const test = require('tap').test;
const fs = require('fs');
const concat = require('concat-stream');
const sitemap = require('./');

test('sitemap - one', function(t) {
  sitemap(concat(function(res) {
    if (process.env.UPDATE) {
      fs.writeFileSync('fixtures/one.xml', res);
    }

    let expectedLastModTime = new Date(fs.statSync('fixtures/one/index.html').mtime).toISOString();
    t.equal(res, fs.readFileSync('fixtures/one.xml', 'utf8').replace('LAST_MOD', expectedLastModTime));
    t.end();
  }), {
    findRoot: 'fixtures/one',
    prefix: 'http://www.example.com/'
  });
});

test('sitemap - two', function(t) {
  sitemap(concat(function(res) {
    if (process.env.UPDATE) {
      fs.writeFileSync('fixtures/two.xml', res);
    }

    let actual = fs.readFileSync('fixtures/two.xml', 'utf8');
    actual = actual.replace('LAST_MOD', new Date(fs.statSync('fixtures/two/index.html').mtime).toISOString());
    actual = actual.replace('LAST_MOD', new Date(fs.statSync('fixtures/two/two.html').mtime).toISOString());

    t.equal(res, actual);
    t.end();
  }), {
    findRoot: 'fixtures/two/',
    prefix: 'http://www.example.com/'
  });
});

test('sitemap - two - ignore', function(t) {
  sitemap(concat(function(res) {
    if (process.env.UPDATE) {
      fs.writeFileSync('fixtures/two-ignore.xml', res);
    }

    let actual = fs.readFileSync('fixtures/two-ignore.xml', 'utf8');
    actual = actual.replace('LAST_MOD', new Date(fs.statSync('fixtures/two/index.html').mtime).toISOString());
    actual = actual.replace('LAST_MOD', new Date(fs.statSync('fixtures/two/two.html').mtime).toISOString());

    t.equal(res, actual);
    t.end();
  }), {
    findRoot: 'fixtures/two',
    ignoreFiles: ['index.html', 'some_dir'],
    prefix: 'http://www.example.com/'
  });
});

test('sitemap - three', function(t) {
  sitemap(concat(function(res) {
    if (process.env.UPDATE) {
      fs.writeFileSync('fixtures/three.xml', res);
    }

    let actual = fs.readFileSync('fixtures/three.xml', 'utf8');
    actual = actual.replace('LAST_MOD', new Date(fs.statSync('fixtures/three/about.html').mtime).toISOString());
    actual = actual.replace('LAST_MOD', new Date(fs.statSync('fixtures/three/index.html').mtime).toISOString());
    actual = actual.replace('LAST_MOD', new Date(fs.statSync('fixtures/three/author/main.html').mtime).toISOString());
    actual = actual.replace('LAST_MOD', new Date(fs.statSync('fixtures/three/author/index.html').mtime).toISOString());

    t.equal(res, actual);
    t.end();
  }), {
    findRoot: 'fixtures/three/',
    prefix: 'http://www.example.com/',
    pretty: true
  });
});

test('sitemap - addTrailingSlash', function(t) {
  sitemap(concat(function(res) {
    if (process.env.UPDATE) {
      fs.writeFileSync('fixtures/addTrailingSlash.xml', res);
    }

    let actual = fs.readFileSync('fixtures/addTrailingSlash.xml', 'utf8');
    actual = actual.replace('LAST_MOD', new Date(fs.statSync('fixtures/three/about.html').mtime).toISOString());
    actual = actual.replace('LAST_MOD', new Date(fs.statSync('fixtures/three/index.html').mtime).toISOString());
    actual = actual.replace('LAST_MOD', new Date(fs.statSync('fixtures/three/author/main.html').mtime).toISOString());
    actual = actual.replace('LAST_MOD', new Date(fs.statSync('fixtures/three/author/index.html').mtime).toISOString());

    t.equal(res, actual);
    t.end();
  }), {
    findRoot: 'fixtures/three/',
    prefix: 'http://www.example.com/',
    pretty: true,
    addTrailingSlash: true
  });
});
