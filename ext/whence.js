
var whence = {
  ticker: null,
  
  host: window.location.host.replace('www.',''),
  
  start: function() {
    var self = this;
    if (this.ticker == null) {
      console.log("starting tracking " + this.host);      
      function tick() {
        console.log("saving doc to couch");
        var blob = {host: self.host};
        
        chrome.extension.sendRequest({'action' : 'save', data: blob}, function(response) {
          console.log(response);
          if (response == undefined) {
            // error
            console.log("Error on " + self.host + " saving " + blob);
            console.log("lastError=")
            console.log(chrome.extension.lastError)  // ??
           } else {
            // ok
          }
        });
      }      
      this.ticker = setInterval(tick, 1000);
    }
  },
  
  stop: function() {
    console.log("stopping tracking " + this.host);
    if (this.ticker != null) {
      clearInterval(this.ticker);
      this.ticker = null;
    }
  }
};

whence.start();
$(window).blur(function(){
  whence.stop();
});
$(window).focus(function(){
  whence.start();
});
