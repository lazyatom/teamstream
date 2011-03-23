Presence = function(panel) {
  this.panel = $(panel);
}

Presence.prototype = {
  respondTo: ['presence'],

  accountList: null,
  process: function(message) {
    var self = this;
    this.panel.find("ol").remove();
    this.accountList = $.ol("");
    this.panel.append(this.accountList);
    $.each(message.accounts, function(i, account) {
      self.accountList.append($.li(account));
    });
  }
}