# WhereWasI

Once a second, it logs the currently active tab or window (if any) in Chrome into a file in your home directory.

# Instructions

        gem install crxmake
        rake install
        tail -f ~/.js/wherewasi.txt

        also install http://info.couchbase.com/couchbaseCEdownload.html

Complaints to @alexch / alex@stinky.com

"CouchDB is specifically intended to run in the client, and to provide a form of location transparency where your entire application can be running locally or remotely and you really don't know the difference except that perhaps some of your data is stale until you reconnect to the server."

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

..................... dotjs ........................

dotjs  is a  Google Chrome  extension  that executes
JavaScript files in `~/.js` based on their filename.

If  you navigate to  `http://www.google.com/`, dotjs
will execute `~/.js/google.com.js`.

This makes it super  easy to spruce up your favorite
pages using JavaScript.

Bonus:  files  in `~/.js`  have  jQuery 1.5  loaded,
regardless  of  whether  the  site  you're  hacking
uses jQuery.

Double bonus: `~/.js/default.js`  is loaded on every
request,  meaning you  can stick  plugins  or helper
functions in it.

GreaseMonkey user scripts are great, but you need to
publish them  somewhere and re-publish  after making
modifications. With dotjs, just add or edit files in
`~/.js`.

## Example

    $ cat ~/.js/github.com.js
    // swap github logo with trollface
    $('#header .logo img')
      .css('width', '100px')
      .css('margin-top', '-15px')
      .attr('src', '//bit.ly/ghD24e')

![](https://bit.ly/gAHTbC)

## How It Works

Chrome extensions can't access the local filesystem,
so dotjs  runs a tiny  web server on port  3131 that
serves files out of ~/.js.

You don't  have to worry about  starting or stopping
this web server because  we put a pretty great plist
into  ~/Library/LaunchAgents that  handles  all that
for us.

The dotjs Chrome extension then makes ajax requests
to http://localhost:3131/convore.com.js any time you
hit a page on convore.com, for example, and executes
the returned JavaScript.

## Requires

- OS X
- Ruby 1.8
- rake (gem install rake)
- Google Chrome
- `/usr/local/bin` in your $PATH

## Install it

    git clone http://github.com/defunkt/dotjs
    cd dotjs
    rake install

## Chromium vs Google Chrome

Multiple Chromes installed? Drag builds/dotjs.crx to
whichever is your favorite.

## Uninstall it

    rake uninstall

## Credits

- Icon: <http://raphaeljs.com/icons/>
- jQuery: <http://jquery.com/>
- Ryan Tomayko for:

> "I almost wish you could just
   stick JavaScript in ~/.js. Do
   you know what I'm saying?"

## Other Browers

- [Firefox Add-on](https://github.com/rlr/dotjs-addon)
- [Safari Extension](https://github.com/wfarr/dotjs.safariextension)
