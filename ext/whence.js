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
    url: urlPrefix + dbName,
    type: method.toUpperCase(),   // type = method
    dataType: 'json',             // dataType = response
    data: JSON.stringify(data),   // data = request   // use https://github.com/douglascrockford/JSON-js/blob/master/json2.js to get JSON in non-Chrome environments
    contentType: "application/json",
    success: function(response) {
      if (options.success == undefined) {
        console.log("Success during " + method + " " + urlPrefix + dbName)
        console.log(response);
      } else {
        options.success(response);
      }
    },
    error: function(e) {
      if (options.error == undefined) {
        console.log("Error during " + method + " " + urlPrefix + dbName)
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
couch('get');

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
    if (tab != undefined) {       // we have a selected tab
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
}, 1000)
