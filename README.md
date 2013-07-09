# peeper

Peeper works like an FS watcher, only it doesn't break when inotify isn't
available (or is overloaded)

It currently uses polling only with a customizable interval.

You may watch files and directories whether they exist or not.

## ```peeper.watch(filename, [options], [listener])```

Returns an object implementing the FSWatcher interface from node core. Only
change events are emitted. This function will not throw an error.

Options are defaulted to ```{persistent: true, interval: 2003}``` which says
that the process will stay alive as long as the watcher is active, and files
will be polled for changes ever 2003ms.

Listener is a callback automatically attached to the watcher change event
