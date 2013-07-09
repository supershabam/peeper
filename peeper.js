'use strict'

// peeper is an FSWatcher interface but adds some nice things
// such as not breaking if inotify is unavailable! It also can peep at
// a file/folder that does not yet exist (it will poll until it exists)
// it only emits change events (deleted, renamed, created, whatever)

var events = require('events')
  , fs = require('fs')
  , path = require('path')
  , util = require('util')
  , _ = require('underscore')
  , P = Peeper.prototype

util.inherits(Peeper, events.EventEmitter)

function Peeper(filename, options, listener) {
  var self = this

  this.filename = filename
  
  if (typeof options === 'function') {
    listener = options
    options = {}
  }
  options = _.defaults((options || {}), {persistent: true, interval: 2003})
  
  if (typeof listener === 'function') {
    this.on('change', listener)
  }

  // we're just doing polling right now, try and use inotify first later
  fs.watchFile(filename, options, function() {
    self.emit('change', filename)
  })
}

P.close = function() {
  fs.unwatchFile(this.filename)
}

function watch(filename, options, listener) {
  filename = path.resolve(filename)

  return new Peeper(filename, options, listener)
}

module.exports = {watch: watch}
