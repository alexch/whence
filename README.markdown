# Whence

Once a second, it logs the currently active tab or window (if any) in Chrome into CouchDB.

Complaints to [@alexch](http://twitter.com/alexch) / <mailto:alex@stinky.com>

# Instructions

## Install

1. Install CouchDB e.g. http://info.couchbase.com/couchbaseCEdownload.html
2. Select "Automatically Start At Login"
3. Open [builds/whence.crx](builds/whence.crx) in Google Chrome

## Chromium vs Google Chrome

Multiple Chromes installed? Drag [builds/whence.crx](builds/whence.crx) to whichever is your favorite.
    
## Rebuild

    gem install crxmake
    rake install:chrome
    
## Debug

From Chrome's "Extensions" window, select "Developer mode", scroll down to Whence, then click the "background.html" link to look at the console. You can also look at the console in any page.

# Algorithm

Whence uses what's called a "sampling algorithm" -- approximately once a second, the currently selected tab says "hey, the user is on me". While this can miss some quick context shifts, it's reasonably accurate, and very high performance -- which is very important, since we can't gather data at all if the user disables us!

We could gather all sorts of other events as well, like tab opens and closes. But beware, since these are sometimes missed (e.g. if the computer crashes).

# Discussion

<http://groups.google.com/group/whence-dev>

# TODO

* Better error if CouchDB is not running/installed
* Smoosh successive hits to same host together
  *   possibly using map/reduce
* Store path as well as host
* Change icon
  *   http://raphaeljs.com/icons/
* Visualization
* Replicate/synchronize DBs from multiple computers
* Gather info on which app (other than browser) is active
* Settings page
* Clone RescueTime
* Firefox version
* Safari version
* Include crxmake library
* Include CouchDB executable
* Use IndexedDB for local storage (in case Couch is missing)  
* Write server in node.js
* Stick server *inside* CouchDB
  *   see http://www.livelycouch.org/
* Store tab.favIconUrl (tab is "sender" param of onRequest)

# Credits

- Written by [Alex Chaffee](http://alexch.github.com)
- Originally based on [DotJS](http://github.com/defunkt/dotjs)
- Icon: <http://raphaeljs.com/icons/>
- jQuery: <http://jquery.com/>

