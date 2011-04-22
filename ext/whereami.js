console.log("loading whereami")
var whereami = {
  ticker: null,
  
  host: window.location.host.replace('www.',''),
  
  start: function() {
    var self = this;
    if (this.ticker == null) {
      console.log("starting tracking " + this.host);
      this.ticker = setInterval(function() {
        $.ajax({
          url: 'http://localhost:3131/' + self.host,
          dataType: 'text',
          success: function() {
            // do nothing
          },
          error: function() {
            console.log("no server found; not tracking");
            self.stop();
          }
        });
      }, 1000);
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

whereami.start();
$(window).blur(function(){
  whereami.stop();
});
$(window).focus(function(){
  whereami.start();
});
