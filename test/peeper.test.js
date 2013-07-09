var fs = require('fs')
  , path = require('path')
  , peeper = require('../peeper')
  , tmp = require('tmp')

describe('peeper', function() {
  describe('existing file', function() {
    var tmpfile

    before(function(done) {
      tmp.file(function(err, filename, fd) {
        if (err) {
          return done(err)
        }
        tmpfile = filename
        done()
      })
    })

    before(function(done) {
      fs.writeFile(tmpfile, 'oh hai', {encoding: 'utf8'}, done)
    })

    it('should notice existing file change', function(done) {
      var watcher = peeper.watch(tmpfile, {interval: 50})
      watcher.on('change', function(event, filename) {
        watcher.close()
        done()
      })
      fs.writeFile(tmpfile, 'different content', {encoding: 'utf8'}, function() {})
    })
  })

  describe('nonexisting file', function() {
    var tmpfile

    before(function(done) {
      tmp.dir(function(err, dir) {
        if (err) {
          return done(err)
        }
        tmpfile = path.resolve(dir, 'tmp.txt')
        done()
      })
    })

    it('should notice file change', function(done) {
      var watcher = peeper.watch(tmpfile, {interval: 50})
      watcher.on('change', function(event, filename) {
        watcher.close()
        done()
      })
      fs.writeFile(tmpfile, 'new content', {encoding: 'utf8'}, function() {})
    })
  })

  describe('exising folder', function() {
    var tmpdir

    before(function(done) {
      tmp.dir(function(err, dir) {
        if (err) {
          return done(err)
        }
        tmpdir = dir
        done()
      })
    })

    before(function(done) {
      fs.writeFile(path.resolve(tmpdir, 'temp1.txt'), 'oh hai', {encoding: 'utf8'}, done)
    })

    it('should notice a new subfile', function(done) {
      var watcher = peeper.watch(tmpdir, {interval: 50})
      watcher.on('change', function(event, filename) {
        watcher.close()
        done()
      })
      fs.writeFile(path.resolve(tmpdir, 'temp2.txt'), 'hello there', {encoding: 'utf8'}, function() {})
    })
  })
})