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
})