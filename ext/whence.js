var urlPrefix = 'http://localhost:5984/';
var dbName = 'whence';

function couch(method, options) {
  if (options == undefined) {
    options = {};
  }
  var url = urlPrefix + dbName;
  if (options.docId) {
    url += "/" + options.docId;
  }
  if (options.params) {
    url += "?" + options.params;  // todo: if params is a hash, convert to CGI string
  }
  var data;
  if (options.data) {
    data = JSON.stringify(options.data);   // use https://github.com/douglascrockford/JSON-js/blob/master/json2.js to get the JSON object in non-Chrome environments
  } else {
    data = null;
  }
  $.ajax({
    url: url,
    type: method.toUpperCase(),       // type = method
    data: data,                       // data = request
    dataType: 'json',                 // dataType = response
    contentType: "application/json",  // contentType = response
    success: function(response) {
      if (response.error) {
        console.log("CouchDB error during " + method + " " + url + ": " + JSON.stringify(response));
        if (options.error) {
          options.error(response);
        }        
      } else {
        if (options.success == undefined) {
          console.log("HTTP Success during " + method + " " + url)
          console.log(response);
        } else {
          options.success(response);
        }
      }     
    },
    error: function(e) {
      if (options.error == undefined) {
        console.log("HTTP Error during " + method + " " + url)
        console.log(e);
      }
      else {
        options.error(e);
      }
    }
  })
}

(function() {
  var nextStep = logDatabaseInfo;
  // create the database if necessary
  couch('put', {
    success: function(response) {
      console.log("Created database " + dbName);
      console.log(response);
      nextStep();
    }, 
    error:function(error) {
      if (error.status == 412) {
        console.log("Found database " + dbName);
        nextStep();
      } else {
        console.log(e.responseText);
        console.log(e);
      }
    }
  });
})();

function logDatabaseInfo() {
  // log db info, for fun
  couch('get', {success: function(response) {
    console.log("database info:");
    console.log(response);
    setupDesignDocs();
  }});
}

var views = {
  all: {
    map: (function(doc) { emit(null, doc); }).toString()
  },
  by_start: {
    map: (function(doc) { 
      if (doc.start) {
        var secs = Date.parse(doc.start);
        emit(secs, doc);
      }
    }).toString()
  },
  by_when: {
    map: (function(doc) {
      if (doc.when) {
        var secs = Date.parse(doc.when);
        emit(secs, doc); 
      }
    }).toString()
  }
};

// create/update the design documents
// Permanent views are stored inside special documents called design documents, and can be accessed via an HTTP GET request to the URI /{dbname}/{docid}/{viewname}, where {docid} has the prefix _design/ so that CouchDB recognizes the document as a design document, and {viewname} has the prefix _view/ so that CouchDB recognizes it as a view.
function setupDesignDocs() {
  console.log("----- create/update the design documents")
  var designDocId = '_design/sample';
  couch('get', {
    docId: designDocId,
    error: function(error) {
      if (error.code == 404) {
        console.log("Creating design doc")
        couch('put', {
          docId: designDocId,
          data: {
            language: 'javascript',
            views: views,
          },
          success: function(response) {
            startTicker();
          }
        })
      } else {
        console.log(error);
      }    
    },  
    success: function(response) {
      // only re-put if it's different
      if (JSON.stringify(views) != JSON.stringify(response.views)) {
        console.log("Updating design doc")
        couch('put', {
          docId: designDocId,
          data: {
            language: 'javascript',
            _rev: response._rev,
            views: views,
          },
          success: function(response) {
            startTicker();
          }
        });        
      }
    },
  });
}


function migrateWhens() {
  couch('get', {
    docId: '_design/sample/_view/by_when',
    success: function(response) {
      console.log("Migrating " + response.rows.length + " whens")
      var tick = null;
      var rows = response.rows;
      function migrateNextRow() {
        row = rows.shift();
        if (row) {
          var doc = row.value;
          if (tick == null) {
            tick = {host: doc.host, start: doc.when, end: doc.when};
          } else {
            if (doc.host == tick.host) {
              tick.end = doc.when;
            } else {
              console.log("saving " + JSON.stringify(tick));
              couch('post', {data: tick});
              tick = {host: doc.host, start: doc.when, end: doc.when};
            }
          }
          couch('delete', {docId: doc['_id'], params: 'rev=' + doc['_rev']});
          setTimeout(migrateNextRow, 0);
        } else {
          if (tick != null) {
            console.log("saving " + JSON.stringify(tick));
            couch('post', {data: tick});
          }            
        }
      }
      migrateNextRow();
    }
  })    
}

function parseUrl(url) {
  var parts = url.match(/(.*):\/\/([^\/]*)(\/.*)/);
  if (parts == null) {
    console.log("Couldn't parse url '" + url + "'")
    return {host: '?'};
  }
  return {
    protocol: parts[1],
    host: parts[2],
    path: parts[3]
  }
}

function startTicker() {
  migrateWhens();
  console.log("---------- starting ticker")
  
  var period = 1 * 1000; // msec between ticks
  var lastTick = null;  
  var slop = 1 * 1000;    // msec of lag to consider two ticks the same

  setInterval(function() {
    chrome.tabs.getSelected(null, function(tab) {
      if (tab != undefined    // we have a selected tab
         && !tab.incognito    // it's not in "don't track me" mode
        ) {
        chrome.windows.get(tab.windowId, function(window) {
          if (window.focused) {     // we haven't lost focus
            if (tab.url == null || tab.url == '') {
              console.log("Blank URL for tab:")
              console.log(tab)
            } else {
              var host = parseUrl(tab.url).host;
              var now = new Date();
              if (lastTick &&
                lastTick.host == host &&
                lastTick.end >= (now - period - slop))
              {
                lastTick.end = now;
                couch('put', {
                  docId: lastTick['_id'],
                  data: lastTick,
                  success: function(response) {
                    console.log("Logged " + lastTick.host + " " + (lastTick.end - lastTick.start)/1000 + " sec");                    
                    lastTick['_rev'] = response.rev;
                  }
                });
              } else {
                var newTick = {host: host, start: now, end: now};
                couch('post', {
                  data: newTick,
                  success: function(response) {
                    console.log("Logging " + newTick.host);
                    lastTick = newTick;  // todo: dup
                    lastTick['_id'] = response.id;
                    lastTick['_rev'] = response.rev;
                  }
                });
              }
            }
          }
        });
      }
    });
  }, period);
}

setTimeout(startTicker, 1000);

