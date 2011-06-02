Presence = function(panel) {
  this.panel = $(panel);
  this.panel.append($.ol(""));
}

Presence.prototype = {
  respondTo: ['presence'],
  usersOnline: [],
  process: function(message) {
    var self = this;

    // remove those that have left the stream
    $.each(self.usersOnline, function(i, user) {
      if ($.inArray(user,message.accounts) == -1) {
        $("ol li#"+user, presence).remove();
      }
    });

    // add new only if not already showing
    self.usersOnline = message.accounts;
    $.each(self.usersOnline, function(i, account) {
      if ($("li#"+account, self.panel).length == 0) {
        $("ol",self.panel).append($.li("",{"id":account}).append($.span(account, {"class":"username"})));
      }
    });

  }
}