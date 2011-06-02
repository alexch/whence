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

