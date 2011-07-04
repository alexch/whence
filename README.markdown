# Whence

Once a second, it logs the currently active tab or window (if any) in Chrome into CouchDB.

Complaints to [@alexch](http://twitter.com/alexch) / <mailto:alex@stinky.com>

# Instructions

## Install

1. Install [CouchBase](http://www.couchbase.com/downloads/couchbase-server/community)
2. Select "Automatically Start At Login" from CouchBase menu ![CouchBase menu](automatically-start-couchbase.png)
3. Open [builds/whence.crx](builds/whence.crx) in Google Chrome (double clicking might work here)
4. Click "Continue" and "Install" and "X" and whatever other security theater hoops come up

Does it work on Windows or Linux? I don't know yet! Please tell me your experiences.

## Usage

Open <http://localhost:5984/_utils/database.html?whence> and see your data aggregating

 * http://localhost:5984/whence/_design/sample/_view/by_start

TODO: UI :-)

## Chromium vs Google Chrome

Multiple Chromes installed? Drag [builds/whence.crx](builds/whence.crx) to whichever is your favorite.

# Developers

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
  * use Chrome Desktop Notifications http://code.google.com/chrome/extensions/notifications.html
* Detect idle time
  * either stop recording, or record "time since activity" per sample
  * http://paulirish.com/2009/jquery-idletimer-plugin/
  * http://stackoverflow.com/questions/667555/detecting-idle-time-in-javascript-elegantly
  * http://www.frebsite.nl/werk/scripts/jquery_nap_plugin/index_en.php#voorbeelden
* Reports (aka "a user interface of some sort")
  * by day
  * by date range
  * by host
* Store path as well as host
* Store client hostname
* "Destination" rules (potentially several destinations per host, based on path)
  * need better name, but "location" implies geolocation, so...
* Context menu item: add this path as a destination (gets tracked separately)
  * http://code.google.com/chrome/extensions/contextMenus.html
* Export to Locker Project
  * http://gigaom.com/2011/02/04/the-locker-project-why-leave-data-tracking-to-others-do-it-yourself/
  * https://github.com/LockerProject/Locker
* Change icon
* Visualization
* Replicate/synchronize DBs from multiple computers
* Gather info on which app (other than browser) is active
* Settings page
  *    http://code.google.com/chrome/extensions/options.html
* Integrate with MacLogger
* Firefox plugin
* Safari plugin
* Clone RescueTime (Everything version - track active app, not just active tab)
* Store tab.favIconUrl (tab is "sender" param of onRequest)
* Limits (e.g. warn if you're on Slashdot too long)
* Categories a la RescueTime
* log per-page info e.g. GMail subject and from (with content scripts)
* Geolocation (possibly with GeoCouch)
  *  https://github.com/couchbase/geocouch
* Option: Respect incognito mode (don't track incognito tabs)
  * http://code.google.com/chrome/extensions/overview.html#incognito

## Technical chores TODO

* UNIT TESTS (FFS)
* Compact DB on startup
* Include CouchDB executable(s) in distro?
* Use IndexedDB for local storage (in case Couch is missing)
* Include crxmake library inside project
* Stick server *inside* CouchDB?
  *   see http://www.livelycouch.org/

# Credits

- Written by [Alex Chaffee](http://alexch.github.com)
- Originally based on [DotJS](http://github.com/defunkt/dotjs)
- Icon: <http://raphaeljs.com/icons/>
- jQuery: <http://jquery.com/>

