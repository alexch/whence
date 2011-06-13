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
  var data = null;
  if (options.data) {
    data = options.data; // todo: dup
    data.when = new Date();
  }
  $.ajax({
    url: url,
    type: method.toUpperCase(),       // type = method
    data: JSON.stringify(data),       // data = request   // use https://github.com/douglascrockford/JSON-js/blob/master/json2.js to get JSON in non-Chrome environments
    dataType: 'json',                 // dataType = response
    contentType: "application/json",  // contentType = response
    success: function(response) {
      if (options.success == undefined) {
        console.log("Success during " + method + " " + url)
        console.log(response);
      } else {
        options.success(response);
      }
    },
    error: function(e) {
      if (options.error == undefined) {
        console.log("Error during " + method + " " + url)
        console.log(e);
      }
      else {
        options.error(e);
      }
    }
  })
}

// create the database if necessary
couch('put', {success: function(response) {
  console.log("Created database " + dbName);
  console.log(response);    
}, 
error:function(error) {
  if (error.status == 412) {
    console.log("Found database " + dbName);
  } else {
    say(e.responseText);
    console.log(e);
  }
}});

// log db info, for fun
console.log("db info:")
couch('get');

// create/update the design documents
// Permanent views are stored inside special documents called design documents, and can be accessed via an HTTP GET request to the URI /{dbname}/{docid}/{viewname}, where {docid} has the prefix _design/ so that CouchDB recognizes the document as a design document, and {viewname} has the prefix _view/ so that CouchDB recognizes it as a view.

var views = {
  all: {
    map: (function(doc) { emit(null, doc); }).toString()
  },
  by_when: {
    map: (function(doc) { 
      var secs = Date.parse(doc.when);
      emit(secs, doc); 
    }).toString()
  }
};

console.log("getting view")
couch('get', {
  docId: '_design/sample',
  success: function(response) {
    console.log(response);
    // todo: only put if it's different
    console.log("setting view")
    couch('put', {
      docId: '_design/sample',
      data: {
        language: 'javascript',
        _rev: response._rev,
        views: views,
      },
      success: function(response) {
        // get 'em all, for laffs
        couch('get', {
          docId: '_design/sample/_view/by_when'
        })    
      }
    });
  },
});


// 


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
  
setInterval(function() {
  chrome.tabs.getSelected(null, function(tab) {
    if (tab != undefined    // we have a selected tab
       && !tab.incognito    // it's not in "don't track me" mode
      ) {
      chrome.windows.get(tab.windowId, function(window) {
        if (window.focused) {     // we haven't lost focus
          host = parseUrl(tab.url).host;
          couch('post', {
            data: {host: host},
            success: function() {
              // silence is golden
            }
          });
        }
      });
    }
  });
}, 10000)
