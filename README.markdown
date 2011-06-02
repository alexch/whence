# Whence

Once a second, it logs the currently active tab or window (if any) in Chrome into CouchDB / a file in your home directory.

# Instructions

        gem install crxmake
        rake install
        install CouchDB e.g. http://info.couchbase.com/couchbaseCEdownload.html

Complaints to @alexch / alex@stinky.com

## Chromium vs Google Chrome

Multiple Chromes installed? Drag builds/whence.crx to
whichever is your favorite.

## Uninstall it

    rake uninstall
    
# Algorithm

Whence uses what's called a "sampling algorithm" -- approximately once a second, the currently selected tab says "hey, the user is on me". While this can miss some quick context shifts, it's reasonably accurate, and very high performance -- which is very important, since we can't gather data at all if the user disables us!

# TODO

Rename github repo
Include crxmake library 
Included CouchDB executable
Write server in node.js
Stick node.js *inside* CouchDB
  http://www.livelycouch.org/
Use IndexedDB for local storage (in case Couch is missing)  
Smoosh successive hits together
Use tab.favIconUrl (tab is "sender" param of onRequest)
Change icon
  http://raphaeljs.com/icons/

## Credits

- DotJS: <http://github.com/defunkt/dotjs>
- Icon: <http://raphaeljs.com/icons/>
- jQuery: <http://jquery.com/>

# Developer notes

"CouchDB is specifically intended to run in the client, and to provide a form of location transparency where your entire application can be running locally or remotely and you really don't know the difference except that perhaps some of your data is stale until you reconnect to the server."

Unfortunately you can't connect to it via XHR (JS in a browser) so we need an intermediate Ruby server to add the "Access-Control-Allow-Origin" header. See bug https://issues.apache.org/jira/browse/COUCHDB-431

http://css.dzone.com/articles/couchdb-javascript

Built-in Couch APIs:
http://localhost:5984/_utils/script/couch.js
http://localhost:5984/_utils/script/jquery.couch.js

Couch admin console:
http://127.0.0.1:5984/_utils/

CouchDB Cheat Sheets
http://wiki.apache.org/couchdb/API_Cheatsheet
http://www.sowbug.org/mt/2008/06/couchdb-cheat-sheet.html
http://blog.fupps.com/2010/04/20/the-antepenultimate-couchdb-reference-card/
http://www.andyjarrett.co.uk/blog/index.cfm/2010/3/29/CouchDB-quick-refstarting-guide

