DesktopNotifications = function() {
  this.sendNotify = false;
  var self = this;
  $(window).blur(function() {
    self.sendNotify = true;
  });
  $(window).focus(function() {
    self.sendNotify = false;
  });
}

DesktopNotifications.prototype = {
  respondTo: ["chat"],

  process: function(data) {
    if (this.sendNotify) {
      Notifier.notify(data["stream"] + " - " +data["type"], data["user"] + ": " + data["content"]);
    }
  }
}
