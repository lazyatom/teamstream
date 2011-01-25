UnreadMessageCount = function() {
  this.count = 0;
  this.originalDocumentTitle = document.title;
  this.windowInFocus = true;
  var self = this;
  if (window.fluid) {
    window.fluid.dockBadge = '';
  }
  $(window).blur(function() {
    self.windowInFocus = false;
  });
  $(window).focus(function() {
    self.windowInFocus = true;
    self.count = 0;
    document.title = self.originalDocumentTitle;
    if (window.fluid) {
      window.fluid.dockBadge = '';
    }
  }); 
}

UnreadMessageCount.prototype = {
  respondTo: ['chat'],
  process: function(data) {
    if (!this.windowInFocus) {
      this.count ++;
      document.title = '(' + this.count + ') ' + this.originalDocumentTitle;
      if (window.fluid) {
        window.fluid.dockBadge = this.count;
      }
    }
  }
}